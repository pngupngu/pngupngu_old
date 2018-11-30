#version 300 es

#ifdef GL_ES
precision mediump float;
#endif

#define PI      3.141592653589793

uniform float width;
uniform float feather;
uniform float squeezeMin;
uniform float squeezeMax;
uniform float dashOffset;
uniform float dashRepeat;
uniform float dashLength;
uniform vec3 colorEdge;
uniform vec3 colorFill;

out vec4 fragColor;

in vec2 vBarycentric;

vec3 baryCoord(vec2 bary) {
  return vec3(bary.x, bary.y, 1.0 - bary.x - bary.y);
}

float positionAlong(vec3 bary) {
  return bary.y * step(bary.x, bary.y) * step(bary.x, bary.z) +
         bary.z * step(bary.y, bary.x) * step(bary.y, bary.z) +
         bary.x * step(bary.z, bary.y) * step(bary.z, bary.x);
}

float gridFactor(vec3 bary, float width, float feather) {
  vec3 d = fwidth(bary);
  vec3 a3 = smoothstep(d * (width - 1.5), d * (width + feather), bary);
  return min(min(a3.x, a3.y), a3.z);
}

float aastep(float threshold, float dist) {
  float af = fwidth(dist) * 0.5;
  return smoothstep(threshold - af, threshold + af, dist);
}

void main() {
  vec3 bary = baryCoord(vBarycentric);
  float pa = positionAlong(bary);

  float thickness = width;
  thickness *= mix(squeezeMin, squeezeMax, (1.0 - sin(pa * PI)));
  float pattern = fract((pa + dashOffset) * dashRepeat);
  thickness *= 1.0 - aastep(dashLength, pattern);

  float g = 1.0 - gridFactor(bary, thickness, feather);

  fragColor = vec4(mix(colorFill, colorEdge, g), mix(0.2, 1.0, g));
}