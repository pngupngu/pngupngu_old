float GGX(vec3 N, vec3 H, float roughness)
{
  float a2     = roughness * roughness;
  float NdotH  = max(dot(N, H), 0.0);
  float NdotH2 = NdotH * NdotH;
  float denom  = NdotH2 * (a2 - 1.0) + 1.0;
  return a2 / (denom * denom);
}

#pragma glslify: export(GGX)