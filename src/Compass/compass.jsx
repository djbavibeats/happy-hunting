import React, { useState, useEffect, useRef } from 'react'
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import { useAspect, useVideoTexture, shaderMaterial, OrbitControls } from '@react-three/drei'
import { TextureLoader } from 'three'
import * as THREE from 'three'

import vertex from './shaders/hologram/vertex.glsl'
import fragment from './shaders/hologram/fragment.glsl'

const VideoShaderMaterial = shaderMaterial(
    {
        uDiffuse: null,
        uTime: 0.0,
        uHeading: 0.0
    },
    vertex,
    fragment
)
extend({ VideoShaderMaterial })

const Scene = ({ camerastream, heading }) => {
    const streammesh = useRef()
    const texture = useVideoTexture(camerastream)

    const [ sizes, setSizes ] = useState({ 
        width: window.innerWidth, 
        height: window.innerHeight
    })

    useEffect(() => {
        streammesh.current.material.uDiffuse = texture
    }, [])

    useFrame((state, delta) => {
        streammesh.current.material.uTime = state.clock.elapsedTime
        streammesh.current.material.uHeading = heading
    })

    useEffect(() => {
        setSizes({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }, [ window.innerWidth, window.innerHeight ])

    const size = useAspect(sizes.width, sizes.height)
    return (<>
        <mesh scale={ 8.5 } ref={ streammesh }>
            <planeGeometry  />
            <videoShaderMaterial 
                transparent={ true }
                side={ THREE.DoubleSide }
            />
        </mesh>
    </>)
}

export default function Compass() {
    const [ orientationPermissionsAvailable, setOrientationPermissionsAvailable ] = useState(false)
    const [ orientationPermissionsGranted, setOrientationPermissionsGranted ] = useState(false)

    const [ cameraPermissionsGranted, setCameraPermissionsGranted ] = useState(false)

    const [ heading, setHeading ] = useState(0.0)
    const [ direction, setDirection ] = useState("")

    const [ camerastream, setCameraStream ] = useState()

    // Check if device is capable of requestion device orientation permissions
    useEffect(() => {
        // If request permission exists
        if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === "function") {
            setOrientationPermissionsAvailable(true)
        } else {
            setOrientationPermissionsAvailable(false)
        }
    }, [])

    // Ask user to grant device orientation permissions
    const grantOrientationPermissions = () => {
        window.DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response == "granted") {
                    setOrientationPermissionsGranted(true)
                } else {
                    setOrientationPermissionsGranted(false)
                }
            })
            .catch(e => {
                setOrientationPermissionsGranted(false)
            })
    }

    const activeCamera = async () => {
        setCameraStream(await navigator.mediaDevices.getUserMedia({ video: true }))
        setCameraPermissionsGranted(true)
    }

    // Get Compass Heading based on device orientation
    const compassHeading = (alpha, beta, gamma) => {
        // Convert degrees to radians
        const alphaRad = alpha * (Math.PI / 180)
        const betaRad = beta * (Math.PI / 180)
        const gammaRad = gamma * (Math.PI / 180)
    
        // Calculate equation components
        const cA = Math.cos(alphaRad)
        const sA = Math.sin(alphaRad)
        const cB = Math.cos(betaRad)
        const sB = Math.sin(betaRad)
        const cG = Math.cos(gammaRad)
        const sG = Math.sin(gammaRad)
    
        // Calculate A, B, C rotation components
        const rA = - cA * sG - sA * sB * cG
        const rB = - sA * sG + cA * sB * cG
        const rC = - cB * cG
    
        // Calculate compass heading
        let compassHeading = Math.atan(rA / rB)
    
        // Convert from half unit circle to whole unit circle
        if(rB < 0) {
            compassHeading += Math.PI
        }else if(rA < 0) {
            compassHeading += 2 * Math.PI
        }
    
        // Convert radians to degrees
        compassHeading *= 180 / Math.PI
    
        return compassHeading
    }

    // Update stuff on orientation change
    useEffect(() => {
        // Facing Mostly North
        if (heading > 315 || heading < 45) {
            setDirection('North')
        }

        // Facing Mostly East
        else if (heading > 45 && heading < 135) {
            setDirection('East')
        }

        // Facing Mostly South
        else if (heading > 135 && heading < 225) {
            setDirection('South')
        }

        // Facing Mostly West
        else if (heading > 225 && heading < 315) {
            setDirection('West')
        }
    }, [ heading ])

    useEffect(() => {
        if (orientationPermissionsGranted) {
            window.addEventListener('deviceorientation', (e) => {
                if (e.webkitCompassHeading) {
                    setHeading(compassHeading(e.alpha, e.beta, e.gamma))
                } else {
                    setHeading(compassHeading(e.alpha, e.beta, e.gamma))
                }
            })
        }
    }, [ orientationPermissionsGranted ])

    return (<div className="h-screen w-screen flex flex-col items-center text-white">
        <div className="frame">
            <div className="clip">
            <Canvas>
                { camerastream &&
                    <Scene 
                        camerastream={ camerastream } 
                        heading={ heading }
                    />
                }
            </Canvas>
            </div>
        </div>
        <div className="flex flex-col items-center gap-y-4 py-4">
            <h1 className="text-yellow text-4xl font-bold mb-0">Compass</h1>
            <div className="flex flex-col items-center justify-center">
                { orientationPermissionsGranted && <>
                    <p>Direction: { direction }</p>
                    <p>Heading: { heading.toFixed(0) }°</p>
                </> }
            </div>
            <div className="flex flex-col gap-y-4">
                { orientationPermissionsAvailable ?
                    !orientationPermissionsGranted &&
                        <button className="bg-yellow text-black font-bold rounded-xl px-4 py-2" onClick={ grantOrientationPermissions }>
                            Grant Orientation Permissions
                        </button>
                    : <p>Device Orientation Not Available On This Device</p>
                }
                {
                    !cameraPermissionsGranted &&
                        <button className="bg-yellow text-black font-bold rounded-xl px-4 py-2" onClick={ activeCamera }>
                            Grant Camera Permissions
                        </button>
                }
            </div>
        </div>
    </div>)
}