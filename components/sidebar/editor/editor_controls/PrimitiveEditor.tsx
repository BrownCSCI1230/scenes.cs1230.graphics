import useScenefile from "@/hooks/useScenefile";
import assert from "assert";


export default function PrimitiveEditor() {
  const { selected } = useScenefile();
  assert(selected?.type === "primitive")

  return (
    <>
      <p>TODO: put in info and edit controls</p>
    </>
  )
}