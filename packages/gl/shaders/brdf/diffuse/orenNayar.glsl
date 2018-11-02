// FastImprovedOrenNayarDiffuse https://github.com/mebiusbox/mebiusbox.github.com/blob/master/contents/diffuse_brdf/shaders/pbr_frag.glsl
// http://mimosa-pudica.net/improved-oren-nayar.html
// https://qiita.com/mebiusbox2/items/1cd65993ffb546822213#tiny-improved-oren-nayar-model
float orenNayar(float LdotV, float NdotL, float NdotV, float roughness) {
  float s = LdotV - NdotL * NdotV;
  float sigma2 = roughness * roughness;
  float A = 1.0 / (PI + (PI / 2.0 - 2.0 / 3.0) * roughness);
  float B = roughness * A;
  float t = mix(1.0, max(NdotL, NdotV) + 1e-6, step(0.0, s));
  return (A + B * s / t) * PI;
}

#pragma glslify: export(orenNayar)