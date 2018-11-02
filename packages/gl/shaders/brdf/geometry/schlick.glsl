// https://learnopengl.com/#!PBR/Lighting
// http://graphicrants.blogspot.jp/2013/08/specular-brdf-reference.html
// https://github.com/KhronosGroup/glTF-WebGL-PBR
float schlick(vec3 n, vec3 v, float roughness) {
  float NdotV = max(dot(n, v), 0.0);
  // float k = roughness * sqrt(2.0/PI);
  float k = roughness * 0.79788;
  // float k = (roughness + 1.0)  * (roughness + 1.0) / 8.0;
  return NdotV / (NdotV * (1.0 - k) + k);
}

#pragma glslify: export(schlick)