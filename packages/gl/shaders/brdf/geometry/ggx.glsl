// http://www.codinglabs.net/article_physically_based_rendering_cook_torrance.aspx
// https://github.com/KhronosGroup/glTF-WebGL-PBR/blob/master/shaders/pbr-frag.glsl
float GGX(vec3 n, vec3 v, float roughness) {
  float NdotV = max(dot(n, v), 0.0);
  float r2 = roughness * roughness;
  return (2.0 * NdotV) / (NdotV + sqrt(r2 + (1.0 - r2) * (NdotV * NdotV)));
}

#pragma glslify: export(GGX)