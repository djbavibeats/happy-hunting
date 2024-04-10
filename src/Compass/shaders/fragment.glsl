varying vec2 vUvs;

uniform sampler2D diffuse;
uniform float time;
uniform float intensity;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

void main() {
    vec3 color = vec3(0.0);
    vec4 diffuseSample = texture2D(diffuse, vUvs);

    // Min 1.0, Max 0.9
    // Change param 4 for darker bars
    float barsfactor = remap(1.0 - intensity, 0.0, 1.0, 0.7, 1.0);
    // Min 1.0, Max 0.5
    // Change param 4 for a more intense flash
    float colorfactor = remap(1.0 - intensity, 0.0, 1.0, 0.5, 1.0);

    float speed = 2.5;
    float rate = remap(abs(sin(time * speed)), -1.0, 1.0, colorfactor, 1.00);

    float t1 = remap(sin(vUvs.y * 100.0 + time * 2.0), -1.0, 1.0, barsfactor, 1.0);
    float t2 = remap(sin(vUvs.y * 10.0 - time * 4.0), -1.0, 1.0, barsfactor, 1.0);
    float bars = t1 * t2;
    color = texture2D(diffuse, vUvs).xyz * bars;
    float colorthing = 1.0;
    if (intensity > 0.5) {
        color = color * vec3(rate * .9568, rate * .9294, rate * .2470);
    } else {
        color = color * vec3(1.0, 1.0, 1.0);
    }
    // color = color * vec3(1.0, 1.0, 1.0);
    // Yellow rgb(244, 237, 63)
    // R: .9568
    // G: .9294
    // B: .2470
    gl_FragColor = vec4(color, 1.0);   
}