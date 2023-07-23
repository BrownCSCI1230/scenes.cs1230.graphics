import { Primitive } from "@/types/Scenefile";

export default function ScenePrimitive({
  primitive,
}: {
  primitive: Primitive;
}) {
  let component;
  switch (primitive.type) {
    case "cube":
      component = <boxGeometry args={[1, 1, 1]} />;
      break;
    case "sphere":
      component = <sphereGeometry args={[0.5, 64, 64]} />;
      break;
    case "cylinder":
      component = <cylinderGeometry args={[0.5, 0.5, 1, 64]} />;
      break;
    case "cone":
      component = <coneGeometry args={[0.5, 1, 256]} />;
      break;
  }
  return component;
}
