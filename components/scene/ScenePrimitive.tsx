import { Primitive } from "@/types/Scenefile";

export default function ScenePrimitive(primitive: Primitive) {
  let component;
  switch (primitive.type) {
    case "cube":
      component = <boxGeometry args={[1, 1, 1]} />;
      break;
  }
  return component;
}
