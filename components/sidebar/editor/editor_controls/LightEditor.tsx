import useScenefile from "@/hooks/useScenefile";
import assert from "assert";


export default function LightEditor() {
  const { selected } = useScenefile();
  assert(selected?.type === "light")

  let light = selected.item

  return (
    <>
      <b>{light.type} light</b>
      <p>TODO: put in info and edit controls</p>
    </>
  )
}