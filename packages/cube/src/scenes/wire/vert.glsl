#version 300 es

#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 matModelView;
uniform mat4 matProj;

in vec3 position;
in vec2 texcoord;
in vec2 barycentric;

out vec2 vBarycentric;
out vec2 vUv;

void main() {
  vUv = texcoord;
  vBarycentric = barycentric;

  gl_Position = matProj * matModelView * vec4(position, 1.0);
}