import { Primitive } from "@/types/Scenefile";
import { useMemo } from "react";
import { Color } from "three";

import useScenefile from "@/hooks/useScenefile";
import { phongFragShader } from "@/shaders/phongFragmentShader";
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
  const { scenefile, lights } = useScenefile();

  // the uniform does not update with the primitive controls...
  // TODO: find some way to hook on dispatch of the primitive update?
  const uniforms = useMemo(() => {
    // console.log("UNIFORM UPDATE");
    // console.log("LIGHTS", lights)
    const ambient = primitive.ambient ?? [0, 0, 0];
    const diffuse = primitive.diffuse ?? [0, 0, 0];
    const specular = primitive.specular ?? [0, 0, 0];
    const shininess = primitive.shininess ?? 1.0;
    const ambientCoefficient = scenefile.globalData.ambientCoeff ?? 1.0;
    const diffuseCoefficient = scenefile.globalData.diffuseCoeff ?? 1.0;
    const specularCoefficient = scenefile.globalData.specularCoeff ?? 1.0;
    const transparentCoefficient = scenefile.globalData.transparentCoeff ?? 1.0;
    const sceneLights = lights ?? [];
    const lightCount = sceneLights.length;

    return {
      ambientColor: { value: new Color(ambient[0], ambient[1], ambient[2]) },
      diffuseColor: { value: new Color(diffuse[0], diffuse[1], diffuse[2]) },
      specularColor: {
        value: new Color(specular[0], specular[1], specular[2]),
      },
      shininess: { value: shininess },
      ambientCoefficient: { value: ambientCoefficient },
      diffuseCoefficient: { value: diffuseCoefficient },
      specularCoefficient: { value: specularCoefficient },
      transparentCoefficient: { value: transparentCoefficient },
      lightCount: { value: lightCount },
      // TODO: ingest lightPosition, direction, addit. information from various types of lights (point, directional, spot)
    };
  }, [scenefile, primitive, lights]);

  return (
    <mesh
    // TODO: how to incorportate onClick stacked on top of group onClick?? (will need custom logic.)
    // onClick={() => toggleSelect({ type: "primitive", item: primitive })}
    >
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={phongVertexShader}
        fragmentShader={phongFragShader}
      />
      {primitiveComponent(primitive)}
    </mesh>
  );
}
