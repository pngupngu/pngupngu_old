#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D state;
uniform vec2 screen;

varying vec2 v_uv;

void main() {
  vec4 color = texture2D(state, v_uv);
  gl_FragColor = vec4(mix(vec3(0.0), color.rgb, color.a), 1.0);
}