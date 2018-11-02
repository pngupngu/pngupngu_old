vec3 fresnelSchlick(vec3 f0, float u)
{
  return f0 + (1.0 - f0) * pow(1.0 - u, 5.0);
}

#pragma glslify: export(fresnelSchlick)