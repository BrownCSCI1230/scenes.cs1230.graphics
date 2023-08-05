import { Primitive } from "@/types/Scenefile";
import { useMemo } from "react";
import { Color } from "three";

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
}

export default function ScenePrimitive({
  primitive,
}: {
  primitive: Primitive;
}) {


  // the uniform does not update with the primitive controls...
  // TODO: find some way to hook on dispatch of the primitive update? 
  const uniforms = useMemo(() => {

    console.log("UNIFORM UPDATE");
    let ambient = primitive.ambient ?? [0, 0, 0];
    let diffuse = primitive.diffuse ?? [0, 0, 0];
    let specular = primitive.specular ?? [0, 0, 0];
    let shininess = primitive.shininess ?? 1;
    // TODO: get all lights from the scene, and pass them to the shader
    // (how to do best if they are in different groups?)

    return {
      ambientColor: { value: new Color(ambient[0], ambient[1], ambient[2]) },
      diffuseColor: { value: new Color(diffuse[0], diffuse[1], diffuse[2]) },
      specularColor: { value: new Color(specular[0], specular[1], specular[2]) },
      shininess: { value: shininess },
    };
  }, [primitive]);

  
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
  )
}
