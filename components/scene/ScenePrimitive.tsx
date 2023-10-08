import { Primitive, Scenefile } from "@/types/Scenefile";
import { Vector3 } from "three";

import useScenefile from "@/hooks/useScenefile";
import { getLights } from "@/lib/shaderUtils";
import { phongFragmentShader } from "@/shaders/phongFragmentShader";
import { phongVertexShader } from "@/shaders/phongVertexShader";
import { useThree } from "@react-three/fiber";

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
  const {scenefile} = useScenefile();
  const { scene } = useThree();

  return (
    <mesh
    // TODO: how to incorportate onClick stacked on top of group onClick?? (will need custom logic.)
    // onClick={() => toggleSelect({ type: "primitive", item: primitive })}
    >
      <shaderMaterial
        uniforms={exampleUniform(primitive, scenefile, scene)}
        vertexShader={phongVertexShader}
        fragmentShader={phongFragmentShader}
        glslVersion="300 es"
      />
      {primitiveComponent(primitive)}
    </mesh>
  );
}

const exampleUniform = (primitive: Primitive, scenefile: Scenefile, scene: any) => {

  const [pointLights, directionalLights, spotLights] = getLights(scene);
  const lights = [...pointLights, ...directionalLights, ...spotLights];
  console.log(lights);

  const lightTypes = lights.map((light) => light.type);
  const lightColors = lights.map((light) => light.color); 
  const lightFunctions = lights.map((light) => new Vector3(light.intensity * 1.5, 0,0)); 
  const worldSpaceLightPositions = lights.map((light) => light.type === "PointLight" ? new Vector3(light.matrixWorld.elements[12], light.matrixWorld.elements[13], light.matrixWorld.elements[14]) : new Vector3(0, 0, 0));
  const worldSpaceLightDirections = lights.map((light) => light.type === "DirectionalLight" ? light.position : new Vector3(0, 0, 0));
  const angles = lights.map((light) => light.type === "SpotLight" || light.type === "DirectionalLight" ? light.position : new Vector3(0, 0, 0));
  const penumbras = lights.map(() => new Vector3(0, 0, 0));

  const length8Types = Array(8 - lights.length).fill("None");
  const length8Colors = Array(8 - lights.length).fill(new Vector3(0, 0, 0));
  const length8Functions = Array(8 - lights.length).fill(new Vector3(0, 0, 0));
  const length8Positions = Array(8 - lights.length).fill(new Vector3(0, 0, 0));
  const length8Directions = Array(8 - lights.length).fill(new Vector3(0, 0, 0));
  const length8Angles = Array(8 - lights.length).fill(new Vector3(0, 0, 0));
  const length8Penumbras = Array(8 - lights.length).fill(new Vector3(0, 0, 0));



  return {
    ka: { value: scenefile.globalData.ambientCoeff },
    kd: { value: scenefile.globalData.diffuseCoeff },
    ks: { value: scenefile.globalData.specularCoeff },
    ambientColor: {
      value: primitive.ambient ? primitive.ambient : new Vector3(0, 0, 0),
    },
    diffuseColor: {
      value: primitive.diffuse ? primitive.diffuse : new Vector3(0, 0, 0),
    },
    specularColor: {
      value: primitive.specular ? primitive.specular : new Vector3(0, 0, 0),
    },
    shininess: { value: primitive.shininess ? primitive.shininess : 0 },
    lightTypes: { value: [...lightTypes, ...length8Types] },
    lightColors: { value: [...lightColors, ...length8Colors] },
    lightFunctions: { value: [...lightFunctions, ...length8Functions] },
    worldSpaceLightPositions: { value: [...worldSpaceLightPositions, ...length8Positions] },
    worldSpaceLightDirections: { value: [...worldSpaceLightDirections, ...length8Directions] },
    angles: { value: [...angles, ...length8Angles] },
    penumbras: { value: [...penumbras, ...length8Penumbras] },
    numLights: { value: lights.length },
  };
};
