import useScenefile from "@/hooks/useScenefile";
import assert from "assert";


export default function SceneEditor() {
  const { selected } = useScenefile();
  assert(selected?.type === "scene")

  return (
    <>
      <p>TODO: put in info and edit controls</p>
    </>
  )
}