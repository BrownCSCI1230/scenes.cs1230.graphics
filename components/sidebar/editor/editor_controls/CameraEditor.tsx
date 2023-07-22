import useScenefile from "@/hooks/useScenefile";
import assert from "assert";


export default function CameraEditor() {
  const { selected } = useScenefile();
  assert(selected?.type === "camera")

  return (
    <>
      <p>TODO: put in info and edit controls</p>
    </>
  )
}