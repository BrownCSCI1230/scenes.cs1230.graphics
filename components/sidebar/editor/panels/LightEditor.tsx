import useScenefile from "@/hooks/useScenefile";
import { LightProperty } from "@/types/Scenefile";
import SingleInput from "../components/SingleInput";
import TripleInput from "../components/TripleInput";

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
  ALL_PROPERTIES["single"] = [...ALL_PROPERTIES["single"], ...lightProps["single"]];
  ALL_PROPERTIES["triple"] = [...ALL_PROPERTIES["triple"], ...lightProps["triple"]];
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

  return (
    <>
      <b>{light.type} light</b>
      {BASE_PROPERTIES["triple"].map((property, index) => {
        let prop = light[property];
        return (
          <TripleInput
            key={index}
            label={property}
            x={prop[0]}
            y={prop[1]}
            z={prop[2]}
            onXChange={(value) => setLightProperty(property, [value, prop[1], prop[2]])}
            onYChange={(value) => setLightProperty(property, [prop[0], value, prop[2]])}
            onZChange={(value) => setLightProperty(property, [prop[0], prop[1], value])}
          />
        );
      })}
      {BASE_PROPERTIES["single"].map((property, index) => {
        return (
          <SingleInput
            key={index}
            label={property}
            value={light[property]}
            onChange={(e) => setLightProperty(property, e.target.value)}
          />
        );
      })}
      {/* SPECIFIC LIGHT PROPERTIES: */}
      {LIGHT_PROPERTIES_BY_TYPE[light.type]["triple"].map((property, index) => {
        let prop = light[property];
        return (
          <TripleInput
            key={index}
            label={property}
            x={prop[0]}
            y={prop[1]}
            z={prop[2]}
            onXChange={(value) => setLightProperty(property, [value, prop[1], prop[2]])}
            onYChange={(value) => setLightProperty(property, [prop[0], value, prop[2]])}
            onZChange={(value) => setLightProperty(property, [prop[0], prop[1], value])}
          />
        );
      })}
      {LIGHT_PROPERTIES_BY_TYPE[light.type]["single"].map((property, index) => {
        return (
          <SingleInput
            key={index}
            label={property}
            value={light[property]}
            onChange={(e) => setLightProperty(property, e.target.value)}
          />
        );
      })}
    </>
  );
}
