#ifdef GL_ES
precision mediump float;
#endif

#ifndef PI
#define PI      3.141592653589793
#endif

#ifndef EPSILON
#define EPSILON 1e-4
#endif

#pragma glslify: fresnelSchlick = require('@pngu/gl/shaders/brdf/fresnelSchlick');
#pragma glslify: distributionBlinnPhong = require('@pngu/gl/shaders/brdf/distribution/blinnPhong');
#pragma glslify: diffuseDisney = require('@pngu/gl/shaders/brdf/diffuse/disney');

uniform vec3 ambColor;
uniform vec3 lightColor;
uniform float roughness;
uniform vec3 f0;
uniform vec3 albedo;
uniform float metallic;

varying vec3 vNormal;
varying vec3 vLightPos;
varying vec3 vVertPos;

void main() {
  vec3 lightDir = normalize(vLightPos - vVertPos);
  vec3 viewDir = normalize(-vVertPos);
  vec3 halfVec = normalize(lightDir + viewDir);

  vec3 normal = normalize(vNormal);

  float NdotL = clamp(dot(normal, lightDir), 0.0, 1.0);
  float NdotV = clamp(dot(normal, viewDir), 0.0, 1.0);
  float LdotH = clamp(dot(lightDir, halfVec), 0.0, 1.0);

  vec3 fresnel0 = mix(f0, albedo, metallic);
  vec3 F = fresnelSchlick(fresnel0, LdotH);
  float D = distributionBlinnPhong(normal, halfVec, roughness);
  vec3 spec = (F * D) / 4.0;

  float diffuse = diffuseDisney(NdotL, NdotV, LdotH, roughness);

  vec3 kD = vec3(1.0) - F;
  kD *= 1.0 - metallic;
  vec3 c1 = NdotL * lightColor * (spec + kD * albedo * diffuse) + ambColor * albedo;

  gl_FragColor = vec4(c1, 1.0);
}