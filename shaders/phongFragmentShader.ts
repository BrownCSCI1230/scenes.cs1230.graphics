
export const phongFragShader = `

uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform float shininess;

uniform float ambientCoefficient;
uniform float diffuseCoefficient;
uniform float specularCoefficient;
uniform float transparentCoefficient; // TODO: implement (would be hard?)

// placeholder. TODO: add lighting
uniform vec3 lightPosition;
uniform int lightCount;

varying vec3 vNormal;

void main() {

  vec3 lightDirection = normalize(lightPosition - vNormal);
  vec3 diffuse = diffuseCoefficient * max(dot(vNormal, lightDirection), 0.0) * diffuseColor;

  vec3 viewDirection = normalize(-vNormal);
  vec3 reflectionDirection = reflect(-lightDirection, vNormal);
  float specularFactor = max(dot(reflectionDirection, viewDirection), 0.0);
  vec3 specular = specularCoefficient * pow(specularFactor, shininess) * specularColor;

  vec3 resultColor = ambientCoefficient * ambientColor + diffuse + specular;
  // gl_FragColor = vec4(resultColor, 1.0);
  gl_FragColor = vec4(ambientColor,1.0);
}
`
