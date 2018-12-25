uniform mat4 matModelView;
uniform mat4 matProj;

attribute vec3 position;
attribute vec2 texcoord;

varying vec2 v_uv;

void main() {
  v_uv = texcoord;

  gl_Position = matProj * matModelView * vec4(position, 1.0);
}