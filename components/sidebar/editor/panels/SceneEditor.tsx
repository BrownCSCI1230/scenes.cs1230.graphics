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
      <EditorSection label="Global properties">
        {globalDataProperties.map((key: GlobalDataProperty, index) => {
          return (
            <SingleInput
              key={index}
              label={key}
              val={globalData[key]}
              onChange={(value) => setGlobalDataProperty(key, value)}
            />
          );
        })}
      </EditorSection>
    </div>
  );
}
