// #version 300 es

#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 matModelView;
uniform mat4 matProj;

attribute vec3 position;
attribute vec2 texcoord;
attribute vec2 barycentric;

varying vec2 vBarycentric;
varying vec2 vUv;

void main() {
  vUv = texcoord;
  vBarycentric = barycentric;

  gl_Position = matProj * matModelView * vec4(position, 1.0);
}