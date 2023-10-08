import { glsl } from "@/lib/shaderUtils";

export const phongFragmentShader = glsl`
// precision highp float;

// Inputs from the vertex shader
in vec3 worldSpace_pos;
in vec3 worldSpace_norm;
in vec2 fragUV;

// Uniforms provided by Three.js
// uniform vec3 cameraPosition;

uniform float ka;
uniform float kd;
uniform float ks;
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform float shininess;

uniform int lightTypes[8];
uniform vec3 lightColors[8];
uniform vec3 lightFunctions[8];
uniform vec3 worldSpaceLightPositions[8];
uniform vec3 worldSpaceLightDirections[8];
uniform float angles[8];
uniform float penumbras[8];
uniform int numLights;

// Output color
out vec4 fragColor;

vec3 getNormalizedToLight(int lightIndex) {
  int LIGHT_POINT = 0;
  int LIGHT_DIRECTIONAL = 1;
  int LIGHT_SPOT = 2;

  if(lightTypes[lightIndex] == LIGHT_DIRECTIONAL) {
      return normalize(-worldSpaceLightDirections[lightIndex]);
  }
  else if(lightTypes[lightIndex] == LIGHT_POINT) {
      return normalize(worldSpaceLightPositions[lightIndex]-worldSpace_pos);
  }
  else if(lightTypes[lightIndex] == LIGHT_SPOT) {
      return normalize(worldSpaceLightPositions[lightIndex]-worldSpace_pos);
  }

  return vec3(0);
}

float attenuationFactor(int lightIndex) {
  int LIGHT_POINT = 0;
  int LIGHT_DIRECTIONAL = 1;
  int LIGHT_SPOT = 2;

  if (lightTypes[lightIndex] == LIGHT_POINT) {
      vec3 coeffs = lightFunctions[lightIndex];
      float d = length(vec3(worldSpaceLightPositions[lightIndex] - worldSpace_pos));
      return 1.0 / (coeffs.x + coeffs.y * d + coeffs.z * d * d);
  }
  else if (lightTypes[lightIndex] == LIGHT_SPOT) {
      vec3 lPos = vec3(worldSpaceLightPositions[lightIndex]);
      vec3 lDir = vec3(worldSpaceLightDirections[lightIndex]);
      float lInner = angles[lightIndex] - penumbras[lightIndex];
      float lOuter = angles[lightIndex];
      vec3 lCoeffs = lightFunctions[lightIndex];

      vec3 toLight = vec3(worldSpaceLightPositions[lightIndex] - worldSpace_pos);

      float d = length(toLight);
      float dist_atten = 1.0 / (lCoeffs.x + lCoeffs.y * d + lCoeffs.z * d * d);

      float a = acos(dot(normalize(lDir), -toLight/d));

      if (a < lInner) {
          return dist_atten;
      } else if (a < lOuter) {
          float temp = (a - lInner) / penumbras[lightIndex];
          float temp2 = temp * temp;
          float falloff = -2. * temp * temp2 + 3. * temp2;
          return dist_atten * (1. - falloff);
      }
      return 0.f;
  }

  return 1.f;
}

float computeDiffuseIntensity(vec3 normalized_worldSpace_toLight, vec3 normalized_worldSpace_norm) {
  // Dot product to get diffuse intensity
  return max(dot(normalize(normalized_worldSpace_toLight), normalize(normalized_worldSpace_norm)), 0.);
}

float computeSpecularIntensity(vec3 normalized_worldSpace_toLight, vec3 normalized_worldSpace_toEye, vec3 normalized_worldSpace_norm) {
  // guard against pow weirdness when exponent is 0
  if (shininess == 0.) {
      return 1.f;
  }

  //reflect toLight
  vec3 worldSpace_toLightReflected = reflect(-normalized_worldSpace_toLight, normalized_worldSpace_norm);

  //Compute specular intensity using toEye, reflected light, and shininess
  return pow(max(dot(worldSpace_toLightReflected, normalized_worldSpace_toEye), 0.), shininess);
}

void main() {
  // Declare any necessary normalized vectors or locations
  vec3 normalized_worldSpace_norm = normalize(worldSpace_norm);

  // Declare ambient, diffuse, and specular terms
  vec3 ambi = ka * ambientColor;
  vec3 diff = vec3(0.0);
  vec3 spec = vec3(0.0);

  // Compute toEye Vector for specular intensity computation;
  vec3 normalized_worldSpace_toEye = normalize(cameraPosition - worldSpace_pos);

  //fragColor = vec4(ambientColor, 1);

  // Compute per-light diffuse and specular contribution
  for(int i = 0; i < numLights; i+= 1){

      // get direction vector to light based on light type
      vec3 normalized_worldSpace_toLight = getNormalizedToLight(i);

      float diffuse_intensity = computeDiffuseIntensity(normalized_worldSpace_toLight, normalized_worldSpace_norm);
      float specular_intensity = computeSpecularIntensity(normalized_worldSpace_toLight, normalized_worldSpace_toEye, normalized_worldSpace_norm);

      float att = attenuationFactor(i);

      diff = diff + diffuse_intensity * lightColors[i] * att;
      spec = spec + specular_intensity * lightColors[i] * att;
  }

  diff = diff * vec3(kd) * vec3(diffuseColor);
  spec = spec * vec3(ks) * vec3(specularColor);

  vec3 tempColor = clamp(ambi + diff + spec, 0., 1.);

  fragColor = vec4(tempColor, 1.0);
}
`;
