varying vec2 vUvs;
varying vec3 vPosition;


void main() {	
  // Position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Final Position
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  // Varyings
  vUvs = uv;
  vPosition = modelPosition.xyz;
}