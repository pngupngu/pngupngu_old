// https://github.com/glslify/glsl-specular-beckmann
// http://graphicrants.blogspot.jp/2013/08/specular-brdf-reference.html
// https://qiita.com/mebiusbox2/items/8db00cdcaf263992a5ce
float beckmann(vec3 n, vec3 h, float roughness) {
  float NdotH = max(dot(n, h), 0.0);
  float cos2Alpha = NdotH * NdotH;
  float tan2Alpha = (cos2Alpha - 1.0) / cos2Alpha;
  float roughness2 = roughness * roughness;
  float denom = roughness2 * cos2Alpha * cos2Alpha;
  return exp(tan2Alpha / roughness2) / denom;
}

#pragma glslify: export(beckmann)