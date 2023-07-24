import useScenefile from "@/hooks/useScenefile";
import assert from "assert";


export default function SceneEditor() {
  const { selected } = useScenefile();
  assert(selected?.type === "scene")

  let scene = selected.item

  return (
    <>
      <b>{scene.name ?? "Untitled Scene"}</b>
      <p>TODO: put in info and edit controls</p>
    </>
  )
}