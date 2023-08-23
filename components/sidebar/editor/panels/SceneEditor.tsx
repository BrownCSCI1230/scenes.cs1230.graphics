import { Input } from "@/components/ui/input";
import useScenefile from "@/hooks/useScenefile";
import { GlobalDataProperty } from "@/types/Scenefile";
import EditorSection from "../components/EditorSection";
import SingleInput from "../components/SingleInput";

export default function SceneEditor() {
  const { selected, setGlobalDataProperty } = useScenefile();

  if (selected?.type !== "scene") return null;

  const scene = selected.item;
  const globalData = scene.globalData;
  const globalDataProperties: GlobalDataProperty[] = Object.keys(
    globalData
  ) as GlobalDataProperty[];

  return (
    <div className="flex flex-col gap-4">
      <EditorSection label="Scene name">
        <Input
          type="text"
          autoComplete="off"
          id="scene name"
          placeholder="Untited Scene"
        ></Input>
      </EditorSection>
      <EditorSection label="Global coefficients">
        {globalDataProperties.map((key: GlobalDataProperty) => {
          return (
            <SingleInput
              key={key}
              // remove last 5 characters and capitalize first letter
              label={
                key.slice(0, -5).charAt(0).toUpperCase() + key.slice(1, -5)
              }
              val={globalData[key]}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setGlobalDataProperty(key, value);
              }}
              min={0}
              max={1}
              step={0.01}
            />
          );
        })}
      </EditorSection>
    </div>
  );
}
