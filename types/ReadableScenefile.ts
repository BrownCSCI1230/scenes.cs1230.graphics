type Scenefile = {
  name?: string;
  globalData: GlobalData;
  cameraData: CameraData;
  groups?: Group[];
  templateGroups?: TemplateGroup[];
};

type GlobalData = {
  ambientCoeff: number;
  diffuseCoeff: number;
  specularCoeff: number;
  transparentCoeff: number;
};

type CameraData = {
  position: Vec3;
  up: Vec3;
  heightAngle: number;
  aperture?: number;
  focalLength?: number;
} & ({ look: Vec3; focus?: never } | { focus: Vec3; look?: never }); // must provide either look or focus, but not both

type Group = {
  name?: string;
  primitives?: Primitive[];
  lights?: Light[];
  groups?: Group[];
} & (
  | { translate?: Vec3; rotate?: Vec4; scale?: Vec3; matrix?: never }
  | { matrix?: Mat4; translate?: never; scale?: never; rotate?: never }
); // can provide translate, rotate, and scale vectors, or a matrix, but not both

// TemplateGroup must have a name
type TemplateGroup = Group & { name: string };

type Primitive = {
  ambient?: RGB;
  diffuse?: RGB;
  specular?: RGB;
  reflective?: RGB;
  transparent?: RGB;
  shininess?: number;
  blend?: number;
  textureFile?: string;
  textureU?: number;
  textureV?: number;
  bumpMapFile?: string;
  bumpMapU?: number;
  bumpMapV?: number;
} & ({ type: "cube" | "sphere" | "cylinder" | "cone" } | { type: "mesh"; meshFile: string }); // must provide a meshFile if type is Mesh, but must not if type is Shape

type Light = {
  name?: string;
  color: RGB;
} & (PointLight | DirectionalLight | SpotLight);

type PointLight = {
  type: "point";
  attenuationCoeff: Vec3;
};

type DirectionalLight = {
  type: "directional";
  direction: Vec3;
};

type SpotLight = {
  type: "spot";
  direction: Vec3;
  penumbra: number;
  angle: number;
  attenuationCoeff: Vec3;
};

type Vec2 = number[];
type Vec3 = number[];
type Vec4 = number[];
type Mat4 = number[][];
type RGB = number[];

/**
 * Check that the inferred types from ./Scenefile.ts are the same as the readable ones here
 */
import {
  CameraData as _CameraData,
  GlobalData as _GlobalData,
  _Group,
  _Light,
  _Primitive,
  _Scenefile,
  _TemplateGroup,
} from "./Scenefile";

type IsEqual<Type1, Type2> = Type1 | Type2 extends Type1 & Type2 ? true : never;
type groupEqual = IsEqual<Group, _Group>; // true
type primitiveEqual = IsEqual<Primitive, _Primitive>; // true
type lightEqual = IsEqual<Light, _Light>; // true
type globalDataEqual = IsEqual<GlobalData, _GlobalData>; // true
type cameraDataEqual = IsEqual<CameraData, _CameraData>; // true
type templateGroupEqual = IsEqual<TemplateGroup, _TemplateGroup>; // true
type scenefileEqual = IsEqual<Scenefile, _Scenefile>; // true
