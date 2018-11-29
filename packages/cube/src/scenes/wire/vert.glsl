#version 300 es

#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 matModelView;
uniform mat4 matProj;

in vec3 position;
in vec2 texcoord;

out vec2 vUv;

void main() {
  vUv = texcoord;
  gl_Position = vec4(position, 1.0);

  // gl_Position = matProj * matModelView * vec4(position, 1.0);
}