import { Group } from "@/types/Scenefile";
import ScenePrimitive from "./ScenePrimitive";

export default function SceneGroup(group: Group) {
  const translateX = group.translate?.[0] ?? 0;
  const translateY = group.translate?.[1] ?? 0;
  const translateZ = group.translate?.[2] ?? 0;
  return (
    // TODO: investigate whether it's good to nest <mesh> elements
    <mesh position={[translateX, translateY, translateZ]}>
      {group.primitives?.map((primitive) => (
        <ScenePrimitive key={primitive.id} {...primitive} />
      ))}
      {group.groups?.map((child) => (
        <SceneGroup key={child.id} {...child} />
      ))}
    </mesh>
  );
}
