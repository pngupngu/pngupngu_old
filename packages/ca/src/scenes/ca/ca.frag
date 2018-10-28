#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 screen;
uniform vec2 mouse;
uniform float e1;
uniform float e2;
uniform float f1;
uniform float fade;
uniform sampler2D state;
uniform sampler2D stamp;
uniform vec2 stampSize;
uniform int useStamp;

varying vec2 v_uv;

float get(vec2 offset) {
  return ceil(texture2D(state, (v_uv + offset / screen)).a);
}

void main() {
  vec2 md = (mouse - v_uv) * vec2(screen.x / screen.y, 1.0);
  float ld = length(md);

  vec3 color = vec3(0.792, 0.149, 0.149);
  bool survive = false;

 if (useStamp == 1) {
    float aspect = screen.x / screen.y;
    float sAspect = stampSize.x / stampSize.y;

    vec2 scale = vec2(aspect, sAspect) * 2.0;
    vec2 uv = v_uv * scale - (scale - 1.0) * 0.5;
    vec4 tex = texture2D(stamp, uv);
    survive = tex.a > 0.0;
  }

  if (survive) {
    gl_FragColor = vec4(color, 1.0);
  } else if (ld < 0.02) {
    gl_FragColor = vec4(color, 1.0);
  } else {
    float curr = texture2D(state, v_uv).a;
    float n = get(vec2(-1.0, -1.0)) +
              get(vec2(-1.0,  0.0)) +
              get(vec2(-1.0,  1.0)) +
              get(vec2( 0.0, -1.0)) +
              get(vec2( 0.0,  1.0)) +
              get(vec2( 1.0, -1.0)) +
              get(vec2( 1.0,  0.0)) +
              get(vec2( 1.0,  1.0));
    if (curr > 0.0) {
      gl_FragColor = (n >= e1 && n <= e2) ? vec4(color, curr) : vec4(0.0);
    } else {
      gl_FragColor = (n == f1) ? vec4(color, 1.0) : vec4(0.0);
    }
  }
  gl_FragColor.a -= (0.01 * fade);
}