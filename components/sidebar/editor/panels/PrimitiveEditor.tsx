import { EditorSection } from "@/components/sidebar/editor/primitives/EditorSection";
import { SingleInput } from "@/components/sidebar/editor/primitives/SingleInput";
import { useScenefile } from "@/hooks/useScenefile";

export const PrimitiveEditor = () => {
  const { selected, setPrimitiveProperty } = useScenefile();

  if (selected?.type !== "primitive") return null;

  const primitive = selected.item;

  const ambient = primitive.ambient ? primitive.ambient : [0, 0, 0];
  const diffuse = primitive.diffuse ? primitive.diffuse : [0, 0, 0];
  const specular = primitive.specular ? primitive.specular : [0, 0, 0];
  const shininess = primitive.shininess ? primitive.shininess : 10;

  return (
    <>
      <EditorSection label="Ambient">
        {ambient.map((value, index) => (
          <SingleInput
            key={index}
            label={index === 0 ? "R" : index === 1 ? "G" : "B"}
            value={value}
            min={0}
            max={1}
            step={0.01}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (isNaN(value)) return;
              setPrimitiveProperty("ambient", [
                index === 0 ? value : ambient[0],
                index === 1 ? value : ambient[1],
                index === 2 ? value : ambient[2],
              ]);
            }}
          />
        ))}
      </EditorSection>
      <EditorSection label="Diffuse">
        {diffuse.map((value, index) => (
          <SingleInput
            key={index}
            label={index === 0 ? "R" : index === 1 ? "G" : "B"}
            value={value}
            min={0}
            max={1}
            step={0.01}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (isNaN(value)) return;
              setPrimitiveProperty("diffuse", [
                index === 0 ? value : diffuse[0],
                index === 1 ? value : diffuse[1],
                index === 2 ? value : diffuse[2],
              ]);
            }}
          />
        ))}
      </EditorSection>
      <EditorSection label="Specular">
        {specular.map((value, index) => (
          <SingleInput
            key={index}
            label={index === 0 ? "R" : index === 1 ? "G" : "B"}
            value={value}
            min={0}
            max={1}
            step={0.01}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (isNaN(value)) return;
              setPrimitiveProperty("specular", [
                index === 0 ? value : specular[0],
                index === 1 ? value : specular[1],
                index === 2 ? value : specular[2],
              ]);
            }}
          />
        ))}
      </EditorSection>
      <EditorSection label="Shininess">
        <SingleInput
          label="Shininess"
          value={shininess}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (isNaN(value)) return;
            setPrimitiveProperty("shininess", value);
          }}
        />
      </EditorSection>
    </>
  );
};
