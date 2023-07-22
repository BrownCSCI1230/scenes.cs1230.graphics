import useScenefile from "@/hooks/useScenefile";
import assert from "assert";


export default function GlobalEditor() {
  const { selected } = useScenefile();
  assert(selected?.type === "global")

  return (
    <>
      <p>TODO: put in info and edit controls</p>
    </>
  )
}