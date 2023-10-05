import { Primitive } from "@/types/Scenefile";
import { Vector3 } from "three";

import { phongFragmentShader } from "@/shaders/phongFragmentShader";
import { phongVertexShader } from "@/shaders/phongVertexShader";

const primitiveComponent = (primitive: Primitive) => {
  switch (primitive.type) {
    case "cube":
      return <boxGeometry args={[1, 1, 1]} />;
    case "sphere":
      return <sphereGeometry args={[0.5, 64, 64]} />;
    case "cylinder":
      return <cylinderGeometry args={[0.5, 0.5, 1, 64]} />;
    case "cone":
      return <coneGeometry args={[0.5, 1, 256]} />;
  }
  return <></>;
};

export default function ScenePrimitive({
  primitive,
}: {
  primitive: Primitive;
}) {
  return (
    <mesh
    // TODO: how to incorportate onClick stacked on top of group onClick?? (will need custom logic.)
    // onClick={() => toggleSelect({ type: "primitive", item: primitive })}
    >
      <shaderMaterial
        uniforms={exampleUniform}
        vertexShader={phongVertexShader}
        fragmentShader={phongFragmentShader}
        glslVersion="300 es"
      />
      {primitiveComponent(primitive)}
    </mesh>
  );
}

const exampleUniform = {
  ka: { value: 0 },
  kd: { value: 1 },
  ks: { value: 0 },
  ambientColor: { value: new Vector3(0.5, 0, 0) },
  diffuseColor: { value: new Vector3(1, 0.5, 0) },
  specularColor: { value: new Vector3(0, 0, 0) },
  shininess: { value: 1 },
  lightTypes: { value: [0] },
  lightColors: { value: [new Vector3(100, 1, 1)] },
  lightFunctions: { value: [new Vector3(1, 0, 0)] },
  worldSpaceLightPositions: { value: [new Vector3(1, 1, 2)] },
  worldSpaceLightDirections: { value: [new Vector3(1, 0, 0)] },
  angles: { value: [1] },
  penumbras: { value: [1] },
  numLights: { value: 1 },
};
