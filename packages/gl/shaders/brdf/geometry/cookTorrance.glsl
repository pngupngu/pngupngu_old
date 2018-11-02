// http://graphicrants.blogspot.jp/2013/08/specular-brdf-reference.html
// https://github.com/glslify/glsl-specular-cook-torrance
// https://github.com/KhronosGroup/glTF-WebGL-PBR
// http://simonstechblog.blogspot.jp/2011/12/microfacet-brdf.html
float cookTorrance(vec3 n, vec3 h, vec3 v, vec3 l) {
  float NdotH = max(dot(n, h), 0.0);
  float NdotV = max(dot(n, v), 0.0);
  float NdotL = max(dot(n, l), 0.0);
  float VdotH = max(dot(v, h), 0.0);
  float x = 2.0 * NdotH / VdotH;
  return min(1.0, min(x * NdotV, x * NdotL));
}

#pragma glslify: export(cookTorrance)