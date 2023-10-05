import useScenefile from "@/hooks/useScenefile";
import { LightProperty } from "@/types/Scenefile";
import SingleInput from "../components/SingleInput";
import TripleInput from "../components/TripleInput";
import EditorSection from "../components/EditorSection";

// TODO: find better way to infer this from actual Zod types??
type SingleTripleProp = "single" | "triple";
type LightProperties = { [propCount in SingleTripleProp]: LightProperty[] };
const LIGHT_PROPERTIES_BY_TYPE: { [name: string]: LightProperties } = {
  point: {
    single: [],
    triple: ["attenuationCoeff"],
  },
  directional: {
    single: [],
    triple: ["direction"],
  },
  spot: {
    single: ["penumbra", "angle"],
    triple: ["direction", "attenuationCoeff"],
  },
};
const BASE_PROPERTIES: LightProperties = {
  single: [],
  triple: ["color"],
};

const ALL_PROPERTIES: LightProperties = { single: [], triple: [] };
for (const lightType in LIGHT_PROPERTIES_BY_TYPE) {
  const lightProps = LIGHT_PROPERTIES_BY_TYPE[lightType];
  ALL_PROPERTIES["single"] = [
    ...ALL_PROPERTIES["single"],
    ...lightProps["single"],
  ];
  ALL_PROPERTIES["triple"] = [
    ...ALL_PROPERTIES["triple"],
    ...lightProps["triple"],
  ];
}

export default function LightEditor() {
  const { selected, setLightProperty } = useScenefile();

  if (selected?.type !== "light") return null;

  let light: any = selected.item;

  for (const prop of ALL_PROPERTIES["single"]) {
    if (!(prop in light)) {
      light[prop] = 0;
    }
  }
  for (const prop of ALL_PROPERTIES["triple"]) {
    if (!(prop in light)) {
      light[prop] = [0, 0, 0];
    }
  }

  const propToLabelArray = (prop: string) => {
    switch (prop) {
      case "direction":
        return ["X", "Y", "Z"];
      case "color":
        return ["R", "G", "B"];
      case "attenuationCoeff":
        return ["C1", "C2", "C3"];
      default:
        return [];
    }
  };

  return (
    <>
      {BASE_PROPERTIES["triple"].map((property, index) => {
        let prop = light[property];
        return (
          <EditorSection key={index} label={property}>
            {prop.map((value: any, index: any) => (
              <SingleInput
                key={index}
                value={value}
                label={propToLabelArray(property)[index]}
                min={0}
                max={1}
                step={0.1}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value)) return;
                  setLightProperty(property, [
                    index === 0 ? value : prop[0],
                    index === 1 ? value : prop[1],
                    index === 2 ? value : prop[2],
                  ]);
                }}
              />
            ))}
          </EditorSection>
        );
      })}
      {BASE_PROPERTIES["single"].map((property, index) => {
        return (
          <EditorSection key={index} label={property}>
            <SingleInput
              label={property}
              value={light[property]}
              onChange={(e) => setLightProperty(property, e.target.value)}
            />
          </EditorSection>
        );
      })}
      {/* SPECIFIC LIGHT PROPERTIES: */}
      {LIGHT_PROPERTIES_BY_TYPE[light.type]["triple"].map((property, index) => {
        let prop = light[property];
        return (
          <EditorSection key={index} label={property}>
            {prop.map((value: any, index: any) => (
              <SingleInput
                key={index}
                value={value}
                label={propToLabelArray(property)[index]}
                min={0}
                max={1}
                step={0.1}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value)) return;
                  setLightProperty(property, [
                    index === 0 ? value : prop[0],
                    index === 1 ? value : prop[1],
                    index === 2 ? value : prop[2],
                  ]);
                }}
              />
            ))}
          </EditorSection>
        );
      })}
      {LIGHT_PROPERTIES_BY_TYPE[light.type]["single"].map((property, index) => {
        return (
          <EditorSection key={index} label={property}>
            <SingleInput
              value={light[property]}
              onChange={(e) => setLightProperty(property, e.target.value)}
            />
          </EditorSection>
        );
      })}
    </>
  );
}
