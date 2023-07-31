import useScenefile from "@/hooks/useScenefile";
import assert from "assert";
import SingleInput from "../editor_components/SingleInput";
import TripleInput from "../editor_components/TripleInput";


export default function PrimitiveEditor() {
  const { selected, setPrimitiveProperty } = useScenefile();
  assert(selected?.type === "primitive")

  let primitive = selected.item

  let ambient = primitive.ambient ? primitive.ambient : [0, 0, 0]
  let diffuse = primitive.diffuse ? primitive.diffuse : [0, 0, 0]
  let specular = primitive.specular ? primitive.specular : [0, 0, 0]
  let shininess = primitive.shininess ? primitive.shininess : 10

  return (
    <>
      <p><b>{primitive.type} primitive</b></p>
      <TripleInput
        label="ambient"
        x={ambient[0]}
        y={ambient[1]}
        z={ambient[2]}
        onXChange={(value) => setPrimitiveProperty("ambient", [value, ambient[1], ambient[2]])}
        onYChange={(value) => setPrimitiveProperty("ambient", [ambient[0], value, ambient[2]])}
        onZChange={(value) => setPrimitiveProperty("ambient", [ambient[0], ambient[1], value])}
      />
      <TripleInput
        label="diffuse"
        x={diffuse[0]}
        y={diffuse[1]}
        z={diffuse[2]}
        onXChange={(value) => setPrimitiveProperty("diffuse", [value, diffuse[1], diffuse[2]])}
        onYChange={(value) => setPrimitiveProperty("diffuse", [diffuse[0], value, diffuse[2]])}
        onZChange={(value) => setPrimitiveProperty("diffuse", [diffuse[0], diffuse[1], value])}
      />
      <TripleInput
        label="specular"
        x={specular[0]}
        y={specular[1]}
        z={specular[2]}
        onXChange={(value) => setPrimitiveProperty("specular", [value, specular[1], specular[2]])}
        onYChange={(value) => setPrimitiveProperty("specular", [specular[0], value, specular[2]])}
        onZChange={(value) => setPrimitiveProperty("specular", [specular[0], specular[1], value])}
      />
      <SingleInput
        label="shininess"
        val={shininess}
        onChange={(value) => setPrimitiveProperty("shininess", value)}
      />
    </>
  )
}