#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 proj;
uniform mat4 model;
uniform mat4 view;

attribute vec3 position;
// attribute vec3 normal;
// attribute vec2 uv;

// varying vec3 vVertPos;
// varying vec3 vLightPos;
// varying vec3 vNormal;
// varying vec2 vUv;

void main () {
  gl_Position = proj * view * model * vec4(position, 1.0);
}