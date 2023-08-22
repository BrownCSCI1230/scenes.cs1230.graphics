import useScenefile from "@/hooks/useScenefile";
import TripleInput from "../components/TripleInput";

export default function GroupEditor() {
  const { selected, setGroupTranslate, setGroupRotate, setGroupScale } =
    useScenefile();

  if (selected?.type !== "group") return null;

  const group = selected.item;
  const translate = group.translate ? group.translate : [0, 0, 0];
  const rotation = group.rotate ? group.rotate : [0, 0, 0];
  const scale = group.scale ? group.scale : [1, 1, 1];

  return (
    <>
      <h3>{group.name}</h3>
      <TripleInput
        label="pos"
        x={translate[0]}
        y={translate[1]}
        z={translate[2]}
        onXChange={(value) =>
          setGroupTranslate([value, translate[1], translate[2]])
        }
        onYChange={(value) =>
          setGroupTranslate([translate[0], value, translate[2]])
        }
        onZChange={(value) =>
          setGroupTranslate([translate[0], translate[1], value])
        }
      />
      <TripleInput
        label="rot"
        x={rotation[0]}
        y={rotation[1]}
        z={rotation[2]}
        onXChange={(value) => setGroupRotate([value, rotation[1], rotation[2]])}
        onYChange={(value) => setGroupRotate([rotation[0], value, rotation[2]])}
        onZChange={(value) => setGroupRotate([rotation[0], rotation[1], value])}
      />
      <TripleInput
        label="scale"
        x={scale[0]}
        y={scale[1]}
        z={scale[2]}
        onXChange={(value) => setGroupScale([value, scale[1], scale[2]])}
        onYChange={(value) => setGroupScale([scale[0], value, scale[2]])}
        onZChange={(value) => setGroupScale([scale[0], scale[1], value])}
      />
    </>
  );
}
