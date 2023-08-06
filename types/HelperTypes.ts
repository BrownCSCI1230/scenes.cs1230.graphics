import { Light, Mat4 } from "@/types/Scenefile"

export interface LightCTM {
  light: Light
  ctm: Mat4 // TODO: implement way to collecting either transform,translate,rotate / Mat4 into full CTM??
}