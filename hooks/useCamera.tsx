"use client";

import { createContext, useContext, useRef, useState } from "react";
import { Euler, Vector3 } from "three";
import { OrbitControls } from 'three-stdlib';

// global context of the Three viewport camera

type ViewportInfo = {
  position: Vector3;
  rotation: Euler;
};

type CameraContextType = {
  viewport: ViewportInfo;
  setViewport: (viewport: ViewportInfo) => void;
  perspectiveCamera?: React.RefObject<THREE.PerspectiveCamera>;
  orbitTarget: Vector3;
  setOrbitTarget: (target: Vector3) => void;
  orbitControls?: React.RefObject<OrbitControls>;
  updateViewport: (viewportInfo: ViewportInfo) => void;
};

const CameraContext = createContext<CameraContextType>({
  viewport: {
    position: new Vector3(),
    rotation: new Euler(),
  },
  setViewport: () => {},
  perspectiveCamera: undefined,
  orbitTarget: new Vector3(),
  setOrbitTarget: () => {},
  orbitControls: undefined,
  updateViewport: () => {},
});

export const CameraProvider = ({ children }: { children: React.ReactNode }) => {
  const [viewport, setViewport] = useState<ViewportInfo>({
    position: new Vector3(5, 2, 5),
    rotation: new Euler(),
  });

  const [orbitTarget, setOrbitTarget] = useState<Vector3>(new Vector3(0, 0, 0));

  const perspectiveCamera = useRef<THREE.PerspectiveCamera>(null);
  const orbitControls = useRef<OrbitControls>(null);

  const updateViewport = (viewportInfo: ViewportInfo) => {
    // console.log
    if (!perspectiveCamera.current?.position) return;
    if (!orbitControls.current?.target) return;
    perspectiveCamera.current?.position.set(
      viewportInfo.position.x,
      viewportInfo.position.y,
      viewportInfo.position.z
    );
    // console.log(perspectiveCamera.current?.rotation);
    perspectiveCamera.current?.rotation.set(
      viewportInfo.rotation.x,
      viewportInfo.rotation.y,
      viewportInfo.rotation.z
    );
    // console.log(perspectiveCamera.current?.rotation);
    console.log(orbitTarget)
    orbitControls.current.target.set(
      orbitTarget.x,
      orbitTarget.y,
      orbitTarget.z,
    );
  };

  return (
    <CameraContext.Provider
      value={{
        viewport,
        setViewport,
        perspectiveCamera,
        orbitTarget,
        setOrbitTarget,
        orbitControls,
        updateViewport,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => useContext(CameraContext);

export default useCamera;
