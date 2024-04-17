varying vec2 vUvs;
varying vec3 vPosition;
varying vec3 vNormal;

uniform float uTime;
uniform float intensity;

float random2D(vec2 value) {
  return fract(sin(dot(value.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

/* void main() {	
  // Position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Glitch
  // float glitchTime = uTime;
  // float glitchStrength = abs(sin(glitchTime)) + 0.5;
  // glitchStrength = smoothstep(0.0, 1.0, glitchStrength);
  // glitchStrength *= intensity * 2.0;
  // modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
  // modelPosition.y += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

  // Final Position
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  // Model Normal
  vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

  // Varyings
  vUvs = uv;
  vPosition = modelPosition.xyz;
  vNormal = modelNormal.xyz;
} */

void main() {
  // Position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Final Position
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
  
  vUvs = uv;
}