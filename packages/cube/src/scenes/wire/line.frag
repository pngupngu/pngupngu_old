// #version 300 es

#ifdef GL_ES
precision mediump float;
#endif

varying vec3 vColor;

// out vec4 fragColor;

void main(){
  gl_FragColor = vec4(vColor, 1.0);
}