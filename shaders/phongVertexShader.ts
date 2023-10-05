import { glsl } from "@/lib/shaderUtils";

export const phongVertexShader = glsl`
// Default attributes provided by Three.js
// in vec3 position;
// in vec3 normal;
// in vec2 uv;

// Default uniforms provided by Three.js
// uniform mat4 modelMatrix;
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;
// uniform mat3 normalMatrix;
// uniform vec3 cameraPosition;

// Outputs to the fragment shader
out vec3 worldSpace_pos;
out vec3 worldSpace_norm;
out vec2 fragUV;

void main() {
    worldSpace_pos = vec3(modelMatrix * vec4(position, 1.0));
    worldSpace_norm = mat3(modelMatrix) * normal; 
    fragUV = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
