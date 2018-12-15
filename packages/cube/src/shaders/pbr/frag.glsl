// #version 300 es
#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

#ifndef PI
#define PI      3.141592653589793
#endif

#ifndef EPSILON
#define EPSILON 1e-4
#endif

#pragma glslify: perturb = require('@pngu/gl/shaders/perturbNormal');
#pragma glslify: toLinear = require('@pngu/gl/shaders/gamma/toLinear');
#pragma glslify: toGamma = require('@pngu/gl/shaders/gamma/toGamma');
#pragma glslify: fresnelSchlick = require('@pngu/gl/shaders/brdf/fresnelSchlick');
#pragma glslify: distributionBlinnPhong = require('@pngu/gl/shaders/brdf/distribution/blinnPhong');
#pragma glslify: distributionGGX = require('@pngu/gl/shaders/brdf/distribution/ggx');
#pragma glslify: distributionBeckmann = require('@pngu/gl/shaders/brdf/distribution/beckmann');
#pragma glslify: geometryImplicit = require('@pngu/gl/shaders/brdf/geometry/implicit');
#pragma glslify: geometrySchlick = require('@pngu/gl/shaders/brdf/geometry/schlick');
#pragma glslify: geometryGGX = require('@pngu/gl/shaders/brdf/geometry/ggx');
#pragma glslify: geometryCookTorrance = require('@pngu/gl/shaders/brdf/geometry/cookTorrance');
#pragma glslify: diffuseDisney = require('@pngu/gl/shaders/brdf/diffuse/disney');
#pragma glslify: diffuseNormalizedDisney = require('@pngu/gl/shaders/brdf/diffuse/normalizedDisney');
#pragma glslify: diffuseOrenNayar = require('@pngu/gl/shaders/brdf/diffuse/orenNayar');

uniform vec3 ambColor;
uniform vec3 lightColor;
uniform float roughness;
uniform vec3 f0;
uniform vec3 albedo;
uniform float metallic;

uniform sampler2D texNormal;
uniform sampler2D texDiffuse;
uniform bool useTexNormal;
uniform bool useTexDiff;
uniform bool useGamma;
uniform int distributionType;
uniform int geometryType;
uniform int diffuseType;
uniform bool showNormal;

varying vec3 vNormal;
varying vec3 vLightPos;
varying vec3 vVertPos;
varying vec2 vUv;

// out vec4 fragColor;

void main() {
  vec3 lightDir = normalize(vLightPos - vVertPos);
  vec3 viewDir = normalize(-vVertPos);
  vec3 halfVec = normalize(lightDir + viewDir);

  vec3 normal = normalize(vNormal);
  if (useTexNormal) {
    vec3 normalMap = texture2D(texNormal, vUv).xyz * 2.0 - 1.0;
    normal = perturb(normalMap, normal, viewDir, vUv);
    // normal = normalMap;
  }

  float NdotL = clamp(dot(normal, lightDir), 0.0, 1.0);
  float NdotV = clamp(dot(normal, viewDir), 0.0, 1.0);
  float LdotH = clamp(dot(lightDir, halfVec), 0.0, 1.0);
  float LdotV = clamp(dot(lightDir, viewDir), 0.0, 1.0);

  vec3 fresnel0 = mix(f0, albedo, metallic);
  vec3 F = fresnelSchlick(fresnel0, LdotH);
  float D = 0.0;
  if (distributionType == 0) {
    D = distributionBlinnPhong(normal, halfVec, roughness);
  } else if (distributionType == 1) {
    D = distributionGGX(normal, halfVec, roughness);
  } else if (distributionType == 2) {
    D = distributionBeckmann(normal, halfVec, roughness);
  }
  float G = 0.0;
  if (geometryType == 0) {
    G = geometryImplicit(normal, halfVec, viewDir, lightDir, roughness);
  } else if (geometryType == 1) {
    G = geometrySchlick(normal, viewDir, roughness) * geometrySchlick(normal, lightDir, roughness);
  } else if (geometryType == 2) {
    G = geometryGGX(normal, viewDir, roughness) * geometryGGX(normal, lightDir, roughness);
  } else if (geometryType == 3) {
    G = geometryCookTorrance(normal, halfVec, viewDir, lightDir);
  }

  vec3 spec = (F * G * D) / max(4.0 * NdotL * NdotV, EPSILON);
  // vec3 spec = (F * D) / 4.0;

  float diffuse = 1.0;
  if (diffuseType == 0) {
    diffuse = 1.0;
  } else if (diffuseType == 1) {
    diffuse = diffuseDisney(NdotL, NdotV, LdotH, roughness);
  } else if (diffuseType == 2) {
    diffuse = diffuseNormalizedDisney(NdotL, NdotV, LdotH, roughness);
  } else if (diffuseType == 3) {
    diffuse = diffuseOrenNayar(LdotV, NdotL, NdotV, roughness);
  }

  vec3 dcolor = albedo;
  if (useTexDiff) {
    dcolor = texture2D(texDiffuse, vUv).rgb;
    if (useGamma) {
      dcolor = toLinear(dcolor);
    }
  }

  vec3 kD = vec3(1.0) - F;
  kD *= 1.0 - metallic;
  vec3 color = NdotL * lightColor * (spec + kD * dcolor * diffuse);
  if (useTexDiff && useGamma) {
    color = toGamma(color);
  }
  color += ambColor * albedo;

  if (showNormal) {
    color = normal;
  }

  gl_FragColor = vec4(color, 1.0);
  // fragColor = vec4(color, 1.0);
}