import React, { useState, useEffect, useRef } from 'react'
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import { useAspect, useVideoTexture, shaderMaterial } from '@react-three/drei'
import Slider from 'react-input-slider'
import { TextureLoader } from 'three'

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

const VideoShaderMaterial = shaderMaterial(
    {
        diffuse: null,
        time: 0.0,
        intensity: 1.0
    },
    vertex,
    fragment
)
extend({ VideoShaderMaterial })

const UserInterface = ({ activeCamera, value, setValue }) => {
    return (<div className="w-full absolute bottom-8 left-0 right-0 gap-4 flex flex-col items-center justify-center">
    <button onClick={ activeCamera } className="text-center text-sm bg-yellow text-black rounded-xl px-4 py-2 font-bold">ACTIVATE CAMERA</button>
        <div className="flex items-center gap-8">
            <div className="bg-yellow py-2 px-4 font-bold rounded-xl text-center text-sm">EFFECT INTENSITY</div>
            <Slider 
                className="max-w-[100px]"
                axis="x" 
                xmin={ 0.0 }
                xmax={ 1.0 }
                xstep={ 0.01 }
                x={ value.x } 
                onChange={({ x }) => setValue(value => ({ ...value, x }))} 
            />
        </div>
    </div>)
}

const Scene = ({ camerastream, value }) => {
    const streammesh = useRef()
    const texture = useVideoTexture(camerastream)

    const [ sizes, setSizes ] = useState({ 
        width: window.innerWidth, 
        height: window.innerHeight
    })

    useEffect(() => {
        streammesh.current.material.diffuse = texture
    }, [])

    useEffect(() => {
        streammesh.current.material.intensity = value.x
    }, [ value ])

    useFrame((state, delta) => {
        streammesh.current.material.time = state.clock.elapsedTime
    })

    useEffect(() => {
        setSizes({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }, [ window.innerWidth, window.innerHeight ])

    const size = useAspect(sizes.width, sizes.height)
    return (
        <mesh scale={ size } ref={ streammesh }>
            <planeGeometry />
            <videoShaderMaterial />
        </mesh>
    )
}

export default function Compass() {
    const [ camerastream, setCameraStream ] = useState()
    const [ value, setValue ] = useState({ x: 0.0 })

    const activeCamera = async () => {
        setCameraStream(await navigator.mediaDevices.getUserMedia({ video: true }))
    }

    return (<>
        <Canvas orthographic>
            { camerastream &&
                <Scene activeCamera={ activeCamera } camerastream={ camerastream } value={ value } />
            }
        </Canvas>
        <UserInterface activeCamera={ activeCamera } value={ value } setValue={ setValue } />
    </>)
}