import { Light } from "@/types/Scenefile";
import * as THREE from "three";

export default function SceneLight(light: Light) {
  const colorR = (light.color?.[0] ?? 255) / 255;
  const colorG = (light.color?.[1] ?? 255) / 255;
  const colorB = (light.color?.[2] ?? 255) / 255;

  const color = new THREE.Color(colorR, colorG, colorB);

  let component;
  switch (light.type) {
    case "point":
      component = <pointLight args={[color]} />;
      break;
  }
  return component;
}
