attribute vec4 position;
attribute vec2 uv;

varying vec2 v_uv;

void main() {
  v_uv = uv;

  gl_Position = position;
}