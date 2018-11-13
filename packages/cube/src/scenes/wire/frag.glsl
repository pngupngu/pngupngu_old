#version 300 es

#ifdef GL_ES
precision mediump float;
#endif

out vec4 fragColor;

void main() {
  fragColor = vec4(vec3(0.0), 1.0);
}