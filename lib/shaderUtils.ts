import { Object3D, PointLight, Scene } from "three";

export const glsl = (x: TemplateStringsArray) => x.toString();

export const getLights = (scene: Scene) => {
  const pointLights: PointLight[] = [];
  scene.traverse((child) => {
    if (object3DIsPointLight(child)) {
      pointLights.push(child);
    }
  });
  return pointLights;
};

const object3DIsPointLight = (object: Object3D): object is PointLight => {
  return object.type === "PointLight";
};
