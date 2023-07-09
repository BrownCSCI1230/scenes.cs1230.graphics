import { Primitive } from "@/types/Scenefile";

export default function ScenePrimitive(primitive: Primitive) {
  let PrimitiveComponent;
  switch (primitive.type) {
    case "cube":
      PrimitiveComponent = <boxGeometry args={[1, 1, 1]} />;
      break;
  }
  return PrimitiveComponent;
}
