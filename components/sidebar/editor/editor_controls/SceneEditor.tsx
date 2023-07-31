import useScenefile from "@/hooks/useScenefile";
import { GlobalDataProperty } from "@/types/Scenefile";
import assert from "assert";
import SingleInput from "../editor_components/SingleInput";

export default function SceneEditor() {
  const { selected, setGlobalDataProperty } = useScenefile();
  assert(selected?.type === "scene")

  let scene = selected.item
  let globalData = scene.globalData
  let globalDataProperties: GlobalDataProperty[] = Object.keys(globalData) as GlobalDataProperty[];

  return (
    <>
      <b>{scene.name ?? "Untitled Scene"}</b>
      <b>GLOBAL PROPERTIES:</b>
      {/* FOR EACH KEY IN GLOBALDATA, make a singleInput */}
      {globalDataProperties.map((key: GlobalDataProperty, index) => {
        return (<SingleInput
          key={index}
          label={key}
          val={globalData[key]}
          onChange={(value) => setGlobalDataProperty(key, value)}
        />)
      })}
    </>
  )
}