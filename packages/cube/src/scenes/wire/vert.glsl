#version 300 es

#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 matModelView;
uniform mat4 matProj;

in vec4 position;
in vec2 texcoord;

out vec2 vUv;

void main() {
  vUv = texcoord;

  vec4 eyePos = matModelView * position;

  gl_Position = matProj * eyePos;
}