// #version 300 es

#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 matProj;
uniform mat4 matModel;
uniform mat4 matView;
uniform mat4 matModelView;
uniform mat3 matNormal;
uniform vec3 lightPos;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 texcoord;

varying vec3 vVertPos;
varying vec3 vLightPos;
varying vec3 vNormal;
varying vec2 vUv;

void main () {
  vNormal = matNormal * normal;
  vUv = texcoord;

  vec4 eyePos = matModelView * vec4(position, 1.0);
  vVertPos = eyePos.xyz;
  vLightPos = (matView * vec4(lightPos, 1.0)).xyz;

  gl_Position = matProj * eyePos;
}