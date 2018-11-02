float blinnPhong(vec3 n, vec3 h, float roughness)
{
  float m = 2.0 / (roughness * roughness) - 2.0;
  return (m + 2.0) * pow(max(dot(n, h), 0.0), m) / 2.0;
}

#pragma glslify: export(blinnPhong)