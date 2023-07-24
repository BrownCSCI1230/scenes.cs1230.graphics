import useScenefile from "@/hooks/useScenefile";
import assert from "assert";


export default function PrimitiveEditor() {
  const { selected } = useScenefile();
  assert(selected?.type === "primitive")

  let primitive = selected.item

  return (
    <>
      <p><b>{primitive.type} primitive</b></p>
      <p>TODO: put in info and edit controls</p>
    </>
  )
}