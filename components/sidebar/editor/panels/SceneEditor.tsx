import { Input } from "@/components/ui/input";
import useScenefile from "@/hooks/useScenefile";
import { GlobalDataProperty } from "@/types/Scenefile";
import EditorSection from "../components/EditorSection";
import SingleInput from "../components/SingleInput";

export default function SceneEditor() {
  const { scenefile, selected, setSceneName, setGlobalDataProperty } =
    useScenefile();

  if (selected?.type !== "scene") return null;

  const globalData = scenefile.globalData;
  const globalDataProperties: GlobalDataProperty[] = Object.keys(
    globalData
  ) as GlobalDataProperty[];

  return (
    <div className="flex flex-col gap-4">
      <EditorSection label="Scene name">
        <Input
          className="bg-white"
          type="text"
          autoComplete="off"
          id="scene name"
          placeholder="Untited Scene"
          value={scenefile.name ?? ""}
          onChange={(e) => {
            setSceneName(e.target.value);
          }}
        ></Input>
      </EditorSection>
      <EditorSection label="Global coefficients">
        {globalDataProperties.map((key: GlobalDataProperty) => {
          return (
            <SingleInput
              key={key}
              label={globalPropertyDisplayNames[key]}
              value={globalData[key]}
              min={0}
              max={1}
              step={0.001}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (isNaN(value)) return;
                setGlobalDataProperty(key, value);
              }}
            />
          );
        })}
      </EditorSection>
    </div>
  );
}

const globalPropertyDisplayNames: Record<GlobalDataProperty, string> = {
  ambientCoeff: "Ambient",
  diffuseCoeff: "Diffuse",
  specularCoeff: "Specular",
  transparentCoeff: "Transparent",
};
