varying vec2 vUvs;
varying vec3 vPosition;

uniform sampler2D uDiffuse;
uniform float uTime;
uniform float uHeading;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

float random2D(vec2 value) {
  return fract(sin(dot(value.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

void main() {
  vec3 colorOutput = vec3(0.0);
  vec3 videoTexture = texture2D(uDiffuse, fract(vUvs * 1.0)).xyz;
  vec3 tint = vec3(1.0);

  float h = remap(uHeading, 0.0, 360.0, 0.0, 1.0);
  
  if (h < 0.25) {
    tint = vec3(1.0);
  } else if (h > 0.25 && h < 0.5) {
    tint = vec3(1.0, 0.0, 0.0);
  } else if (h > 0.5 && h < 0.75) {
    tint = vec3(0.0, 1.0, 0.0);
  } else if (h > 0.75) {
    tint = vec3(0.0, 0.0, 1.0);
  }
  colorOutput = vec3(videoTexture) * tint;
  gl_FragColor = vec4(colorOutput, 1.0);
}