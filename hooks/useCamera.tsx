"use client";

import { eulerToLookUp, lookUpToEuler } from "@/lib/cameraUtils";
import { createContext, useContext, useRef, useState } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { OrbitControls } from "three-stdlib";

type CameraContextType = {
  perspectiveCamera?: React.RefObject<THREE.PerspectiveCamera>;
  orbitTarget: Vector3;
  setOrbitTarget: (target: Vector3) => void;
  orbitControls?: React.RefObject<OrbitControls>;
  updateViewport: (position: number[], look: number[], up: number[]) => void;
  lookUpFromViewport: () => [number[], number[]];
};

const initialContext: CameraContextType = {
  perspectiveCamera: undefined,
  orbitTarget: new Vector3(0, 0, 0),
  setOrbitTarget: () => {},
  orbitControls: undefined,
  updateViewport: () => {},
  lookUpFromViewport: () => [
    [0, 0, -1],
    [0, 1, 0],
  ],
};

const CameraContext = createContext<CameraContextType>(initialContext);

export const CameraProvider = ({ children }: { children: React.ReactNode }) => {
  const [orbitTarget, setOrbitTarget] = useState<Vector3>(new Vector3(0, 0, 0));
  const perspectiveCamera = useRef<THREE.PerspectiveCamera>(null);
  const orbitControls = useRef<OrbitControls>(null);

  const updateViewport = (position: number[], look: number[], up: number[]) => {
    if (!perspectiveCamera.current || !orbitControls.current) return;
    perspectiveCamera.current.position.set(
      position[0],
      position[1],
      position[2],
    );
    const rotation = lookUpToEuler(look, up);
    perspectiveCamera.current.rotation.set(rotation.x, rotation.y, rotation.z);
    perspectiveCamera.current.up.set(up[0], up[1], up[2]);
    // new target is camera position + some distance in the direction of the camera
    orbitControls.current.target.set(
      position[0] + look[0],
      position[1] + look[1],
      position[2] + look[2],
    );
  };

  const lookUpFromViewport = (): [number[], number[]] => {
    if (!perspectiveCamera.current)
      return [
        [0, 0, -1],
        [0, 1, 0],
      ];
    return eulerToLookUp(perspectiveCamera.current.rotation);
  };

  return (
    <CameraContext.Provider
      value={{
        perspectiveCamera,
        orbitTarget,
        setOrbitTarget,
        orbitControls,
        updateViewport,
        lookUpFromViewport,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => useContext(CameraContext);
