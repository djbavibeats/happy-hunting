uniform float time;
uniform float intensity;

varying vec2 vUvs;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

void main() {	
  float factor = remap(intensity, 0.0, 1.0, 0.0, 25.0);
  vec3 localSpacePosition = position;

  vec4 modelPosition = modelViewMatrix * vec4(localSpacePosition, 1.0);
  modelPosition.x += sin(modelPosition.y + time * 5.0) * factor;
  // modelPosition.x += sin(modelPosition.y + time * 2.5) * 25.0;

  gl_Position = projectionMatrix * modelPosition;
  vUvs = uv;
}