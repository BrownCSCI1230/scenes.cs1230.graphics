import useScenefile, { selectedHasID } from "@/hooks/useScenefile";
import { Group } from "@/types/Scenefile";
import SceneLight from "./SceneLight";
import ScenePrimitive from "./ScenePrimitive";

export default function SceneGroup({ group }: { group: Group }) {
  const translateX = group.translate?.[0] ?? 0;
  const translateY = group.translate?.[1] ?? 0;
  const translateZ = group.translate?.[2] ?? 0;
  const scaleX = group.scale?.[0] ?? 1;
  const scaleY = group.scale?.[1] ?? 1;
  const scaleZ = group.scale?.[2] ?? 1;
  const rotateX = group.rotate?.[0] ?? 0;
  const rotateY = group.rotate?.[1] ?? 0;
  const rotateZ = group.rotate?.[2] ?? 0;

  const { toggleSelect, selected } = useScenefile();

  const isSelected =
    selected && selectedHasID(selected) && selected.item === group;

  return (
    // TODO: investigate whether it's good to nest <mesh> elements
    <mesh
      onClick={() => toggleSelect({ type: "group", item: group })}
      position={[translateX, translateY, translateZ]}
      scale={[scaleX, scaleY, scaleZ]}
      rotation={[rotateX, rotateY, rotateZ]}
    >
      
      {group.lights?.map((light) => (
        <SceneLight key={light.id} light={light} />
      ))}
      {group.primitives?.map((primitive) => (
        <ScenePrimitive key={primitive.id} primitive={primitive} />
      ))}
      {group.groups?.map((child) => (
        <SceneGroup key={child.id} group={child} />
      ))}
    </mesh>
  );
}
