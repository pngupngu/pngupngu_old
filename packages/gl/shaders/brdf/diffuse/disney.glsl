// https://shikihuiku.wordpress.com/2014/05/01/burley-diffuse%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%E8%80%83%E3%81%88%E3%81%A6%E3%81%BF%E3%82%8B/
// Burley, B. Physically-Based Shading at Disney, 2012 http://blog.selfshadow.com/publications/s2012-shading-course/burley/s2012_pbs_disney_brdf_slides_v2.pdf
// https://github.com/mebiusbox/mebiusbox.github.com/blob/master/contents/diffuse_brdf/shaders/pbr_frag.glsl
float disney(float NdotL, float NdotV, float LdotH, float roughness) {
  float fd90 = 0.5 + 2.0 * LdotH * LdotH * roughness;
  float nl = 1.0 + (fd90 - 1.0) * pow(1.0 - NdotL, 5.0);
  float nv = 1.0 + (fd90 - 1.0) * pow(1.0 - NdotV, 5.0);
  return nl * nv;
}

#pragma glslify: export(disney)