float implicit(vec3 n, vec3 h, vec3 v, vec3 l, float roughness)
{
  return max(dot(n, l), 0.0) * max(dot(n, v), 0.0);
}

#pragma glslify: export(implicit)