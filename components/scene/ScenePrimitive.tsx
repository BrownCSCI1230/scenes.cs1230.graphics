import { Primitive } from "@/types/Scenefile";
import { Color } from "three";

import useScenefile from "@/hooks/useScenefile";

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
  const { scenefile } = useScenefile();

  const ambient = new Color(...(primitive.ambient ?? [0, 0, 0])).multiplyScalar(
    scenefile.globalData.ambientCoeff,
  );
  const diffuse = new Color(...(primitive.diffuse ?? [0, 0, 0])).multiplyScalar(
    scenefile.globalData.diffuseCoeff,
  );
  const specular = new Color(
    ...(primitive.specular ?? [0, 0, 0]),
  ).multiplyScalar(scenefile.globalData.specularCoeff);

  return (
    <mesh>
      <meshPhongMaterial
        emissive={ambient}
        color={diffuse}
        specular={specular}
        shininess={primitive.shininess ?? 1.0}
        transparent
        opacity={1 - scenefile.globalData.transparentCoeff}
      />
      {primitiveComponent(primitive)}
    </mesh>
  );
}
