import { Input } from "@/components/ui/input";
import useScenefile from "@/hooks/useScenefile";
import EditorSection from "../components/EditorSection";
import SingleInput from "../components/SingleInput";

export default function GroupEditor() {
  const {
    selected,
    setGroupTranslate,
    setGroupRotate,
    setGroupScale,
    setGroupName,
    rotateGroup,
  } = useScenefile();

  if (selected?.type !== "group") return null;

  const group = selected.item;
  const translate = group.translate ? group.translate : [0, 0, 0];
  const rotation = group.rotate ? group.rotate : [0, 0, 0, 0];
  const scale = group.scale ? group.scale : [1, 1, 1];

  return (
    <>
      <EditorSection label="Group name">
        <Input
          className="bg-white"
          type="text"
          autoComplete="off"
          id={`group-name` + group.id}
          placeholder="Untited Group"
          value={group.name ?? ""}
          onChange={(e) => {
            setGroupName(e.target.value);
          }}
        ></Input>
      </EditorSection>
      <EditorSection label="Transform">
        {translate.map((value, index) => (
          <SingleInput
            key={index}
            label={index === 0 ? "X" : index === 1 ? "Y" : "Z"}
            value={value}
            step={0.01}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (isNaN(value)) return;
              setGroupTranslate([
                index === 0 ? value : translate[0],
                index === 1 ? value : translate[1],
                index === 2 ? value : translate[2],
              ]);
            }}
          />
        ))}
      </EditorSection>
      <EditorSection label="Rotate">
        {rotation.map((value, index) => (
          <SingleInput
            key={index}
            label={
              index === 0
                ? "X"
                : index === 1
                ? "Y"
                : index === 2
                ? "Z"
                : "Angle"
            }
            value={value}
            step={1}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (isNaN(value)) return;
              setGroupRotate([
                index === 0 ? value : rotation[0],
                index === 1 ? value : rotation[1],
                index === 2 ? value : rotation[2],
                index === 3 ? value : rotation[3],
              ]);
            }}
          />
        ))}
      </EditorSection>
      <EditorSection label="Scale">
        {scale.map((value, index) => (
          <SingleInput
            key={index}
            label={index === 0 ? "X" : index === 1 ? "Y" : "Z"}
            value={value}
            step={0.01}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (isNaN(value)) return;
              setGroupScale([
                index === 0 ? value : scale[0],
                index === 1 ? value : scale[1],
                index === 2 ? value : scale[2],
              ]);
            }}
          />
        ))}
      </EditorSection>
    </>
  );
}
