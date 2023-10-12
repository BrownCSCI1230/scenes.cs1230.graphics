import useScenefile from "@/hooks/useScenefile";
import { Group } from "@/types/Scenefile";
import { Vector3 } from "three";
import SceneLight from "./SceneLight";
import ScenePrimitive from "./ScenePrimitive";

export default function SceneGroup({ group }: { group: Group }) {
  const translateX = group.translate?.[0] ?? 0;
  const translateY = group.translate?.[1] ?? 0;
  const translateZ = group.translate?.[2] ?? 0;
  const scaleX = group.scale?.[0] ?? 1;
  const scaleY = group.scale?.[1] ?? 1;
  const scaleZ = group.scale?.[2] ?? 1;
  const rotateAxis = new Vector3(...(group.rotate?.slice(0, 3) ?? [0, 1, 0]))
    .normalize()
    .toArray();
  const rotateX = group.rotate
    ? ((rotateAxis[0] * group.rotate[3]) / 180) * Math.PI
    : 0;
  const rotateY = group.rotate
    ? ((rotateAxis[1] * group.rotate[3]) / 180) * Math.PI
    : 0;
  const rotateZ = group.rotate
    ? ((rotateAxis[2] * group.rotate[3]) / 180) * Math.PI
    : 0;

  const { toggleSelect, templateGroupMap } = useScenefile();

  const isATemplateGroupUser =
    group.name &&
    !group.translate &&
    !group.scale &&
    !group.rotate &&
    !group.groups &&
    !group.primitives &&
    !group.lights;

  const templateGroup = templateGroupMap[group.name ?? ""];

  return (
    // TODO: investigate whether it's good to nest <mesh> elements
    <>
      {isATemplateGroupUser && templateGroup ? (
        <mesh
          onClick={() => toggleSelect({ type: "group", item: group })}
          position={[
            templateGroup.translate?.[0] ?? 0,
            templateGroup.translate?.[1] ?? 0,
            templateGroup.translate?.[2] ?? 0,
          ]}
          scale={[
            templateGroup.scale?.[0] ?? 1,
            templateGroup.scale?.[1] ?? 1,
            templateGroup.scale?.[2] ?? 1,
          ]}
        >
          {templateGroup.lights?.map((light) => (
            <SceneLight key={light.id} light={light} />
          ))}
          {templateGroup.primitives?.map((primitive) => (
            <ScenePrimitive key={primitive.id} primitive={primitive} />
          ))}
          {templateGroup.groups?.map((child) => (
            <SceneGroup key={child.id} group={child} />
          ))}
        </mesh>
      ) : (
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
      )}
    </>
  );
}
