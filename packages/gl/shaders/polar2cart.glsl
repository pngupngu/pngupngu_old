vec3 polar2cart(float theta, float phi, float r) {
  return vec3(cos(theta) * sin(phi), sin(theta) * sin(phi), cos(phi)) * r;
}

#pragma glslify: export(polar2cart)