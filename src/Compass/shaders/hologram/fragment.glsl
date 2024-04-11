varying vec2 vUvs;
varying vec3 vPosition;

uniform sampler2D diffuse;
uniform float uTime;
uniform float intensity;




void main() {
    vec4 diffuseSample = texture2D(diffuse, vUvs);

    // Tweak Variables
    float speed = 0.2;
    float numberOfLines = 4.5;
    float lineThickness = intensity;
    // float wavy = sin(vPosition.x * intensity); 
    float wavy = 0.0;

    // Stripes
    float stripes = mod((vPosition.y + wavy - uTime * speed) * numberOfLines, 1.0);
    stripes = smoothstep(0.00, lineThickness, stripes);

    // Base Color
    vec3 baseColor = vec3(0.0);
    vec3 tint = vec3(1.0, 1.0, 1.0 - intensity);
    baseColor = texture2D(diffuse, vUvs).xyz * tint;

    gl_FragColor = vec4(baseColor, stripes);
    // gl_FragColor = vec4(baseColor, 1.0);

    #include <colorspace_fragment>
    #include <tonemapping_fragment>
}