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

mat3 inverse(mat3 m) {
  float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];
  float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];
  float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];

  float b01 = a22 * a11 - a12 * a21;
  float b11 = -a22 * a10 + a12 * a20;
  float b21 = a21 * a10 - a11 * a20;

  float det = a00 * b01 + a01 * b11 + a02 * b21;

  return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),
              b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),
              b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;
}

mat3 transpose(mat3 m) {
  return mat3(m[0][0], m[1][0], m[2][0],
              m[0][1], m[1][1], m[2][1],
              m[0][2], m[1][2], m[2][2]);
}

void main () {
  // vNormal = matNormal * normal;
  vNormal = transpose(inverse(mat3(matModelView))) * normal;
  vUv = texcoord;

  vec4 eyePos = matModelView * vec4(position, 1.0);
  vVertPos = eyePos.xyz;
  vLightPos = (matView * vec4(lightPos, 1.0)).xyz;

  gl_Position = matProj * eyePos;
}