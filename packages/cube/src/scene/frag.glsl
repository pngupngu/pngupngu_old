#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: toLinear = require('@pngu/gl/shaders/gamma/toLinear');

void main() {
  gl_FragColor = vec4(0.0, 1.0, 0.5, 1.0);
}