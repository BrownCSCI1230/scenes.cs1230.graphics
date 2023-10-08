import { DirectionalLight, Object3D, PointLight, Scene, SpotLight } from "three";

export const glsl = (x: TemplateStringsArray) => x.toString();

export const getLights = (scene: Scene) => {
  const allLights: [PointLight[], DirectionalLight[], SpotLight[]] = [
    [],
    [],
    [],
  ];
  scene.traverse((child) => {
    if (object3DIsPointLight(child)) {
      allLights[0].push(child);
    } else if (object3DIsDirectionalLight(child)) {
      allLights[1].push(child);
    }
    else if (object3DIsSpotLight(child)) {
      allLights[2].push(child);
    }
  });
  return allLights;
};

const object3DIsPointLight = (object: Object3D): object is PointLight => {
  return object.type === "PointLight";
};

const object3DIsDirectionalLight = (object: Object3D): object is DirectionalLight => {
  return object.type === "DirectionalLight";
};

const object3DIsSpotLight = (object: Object3D): object is SpotLight => {
  return object.type === "SpotLight";
};
