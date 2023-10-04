import useScenefile from "@/hooks/useScenefile";
import SingleInput from "../components/SingleInput";
import TripleInput from "../components/TripleInput";
import EditorSection from "../components/EditorSection";

export default function PrimitiveEditor() {
  const { selected, setPrimitiveProperty } = useScenefile();

  if (selected?.type !== "primitive") return null;

  let primitive = selected.item;

  let ambient = primitive.ambient ? primitive.ambient : [0, 0, 0];
  let diffuse = primitive.diffuse ? primitive.diffuse : [0, 0, 0];
  let specular = primitive.specular ? primitive.specular : [0, 0, 0];
  let shininess = primitive.shininess ? primitive.shininess : 10;

  return (
    <>
      <EditorSection label="Ambient">
        {ambient.map((value, index) => (
          <SingleInput
            key={index}
            label={index === 0 ? "R" : index === 1 ? "G" : "B"}
            value={value}
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
}
