"use client";

import { createContext, useContext, useRef, useState } from "react";
import { Euler, Vector3 } from "three";

// global context of the Three viewport camera

type ViewportInfo = {
  position: Vector3;
  rotation: Euler;
};

type CameraContextType = {
  viewport: ViewportInfo;
  setViewport: (viewport: ViewportInfo) => void;
  perspectiveCamera?: React.RefObject<THREE.PerspectiveCamera>;
  updateViewport: (viewportInfo: ViewportInfo) => void;
};

const CameraContext = createContext<CameraContextType>({
  viewport: {
    position: new Vector3(),
    rotation: new Euler(),
  },
  setViewport: () => {},
  perspectiveCamera: undefined,
  updateViewport: () => {},
});

export const CameraProvider = ({ children }: { children: React.ReactNode }) => {
  const [viewport, setViewport] = useState<ViewportInfo>({
    position: new Vector3(5, 2, 5),
    rotation: new Euler(),
  });
  const perspectiveCamera = useRef<THREE.PerspectiveCamera>(null);

  const updateViewport = (viewportInfo: ViewportInfo) => {
    if (!perspectiveCamera.current?.position) return;
    perspectiveCamera.current?.position.set(
      viewportInfo.position.x,
      viewportInfo.position.y,
      viewportInfo.position.z,
    );
    console.log(perspectiveCamera.current?.rotation);
    perspectiveCamera.current?.rotation.set(
      viewportInfo.rotation.x,
      viewportInfo.rotation.y,
      viewportInfo.rotation.z,
    );
    console.log(perspectiveCamera.current?.rotation);
  };

  return (
    <CameraContext.Provider
      value={{
        viewport,
        setViewport,
        perspectiveCamera,
        updateViewport,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => useContext(CameraContext);

export default useCamera;
