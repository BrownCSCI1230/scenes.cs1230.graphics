import useScenefile from "@/hooks/useScenefile";
import assert from "assert";


export default function LightEditor() {
  const { selected } = useScenefile();
  assert(selected?.type === "light")

  return (
    <>
      <p>TODO: put in info and edit controls</p>
    </>
  )
}