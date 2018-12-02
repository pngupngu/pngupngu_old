#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 matModelView;
uniform mat4 matProj;

attribute vec3 position;
attribute vec3 color;

varying vec3 vColor;

void main() {
  vColor = color;

  gl_Position = matProj * matModelView * vec4(position, 1.0);
}