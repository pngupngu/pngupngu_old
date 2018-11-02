// https://qiita.com/mebiusbox2/items/1cd65993ffb546822213#%E6%AD%A3%E8%A6%8F%E5%8C%96
// Moving Frostbite to Physically Based Rendering 3.0
float normalizedDisney(float NdotL, float NdotV, float LdotH, float roughness) {
  float energyBias = mix(0.0, 0.5, roughness);
  float energyFactor = mix(1.0, 1.0/1.51, roughness);
  float fd90 = energyBias + 2.0 * LdotH * LdotH * roughness;
  float nl = 1.0 + (fd90 - 1.0) * pow(1.0 - NdotL, 5.0);
  float nv = 1.0 + (fd90 - 1.0) * pow(1.0 - NdotV, 5.0);
  return nl * nv * energyFactor;
}

#pragma glslify: export(normalizedDisney)