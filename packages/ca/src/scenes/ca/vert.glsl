attribute vec4 position;
attribute vec2 texcoord;

varying vec2 v_uv;

void main() {
  v_uv = vec2(texcoord.x, 1.0-texcoord.y);

  gl_Position = position;
}