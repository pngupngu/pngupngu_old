#version 300 es

#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 matProj;
uniform mat4 matModel;
uniform mat4 matView;
uniform mat4 matModelView;
uniform mat3 matNormal;
uniform vec3 lightPos;

in vec3 position;
in vec3 normal;
in vec2 uv;

out vec3 vVertPos;
out vec3 vLightPos;
out vec3 vNormal;
out vec2 vUv;

void main () {
  vNormal = matNormal * normal;
  vUv = uv;

  vec4 eyePos = matModelView * vec4(position, 1.0);
  vVertPos = eyePos.xyz;
  vLightPos = (matView * vec4(lightPos, 1.0)).xyz;

  gl_Position = matProj * eyePos;
}