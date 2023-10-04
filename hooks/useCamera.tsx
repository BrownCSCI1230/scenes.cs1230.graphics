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
  syncViewport: () => void;
};

const CameraContext = createContext<CameraContextType>({
  viewport: {
    position: new Vector3(),
    rotation: new Euler(),
  },
  setViewport: () => {},
  perspectiveCamera: undefined,
  syncViewport: () => {},
});

export const CameraProvider = ({ children }: { children: React.ReactNode }) => {
  const [viewport, setViewport] = useState<ViewportInfo>({
    position: new Vector3(5, 2, 5),
    rotation: new Euler(),
  });
  const perspectiveCamera = useRef<THREE.PerspectiveCamera>(null);

  const syncViewport = () => {
    perspectiveCamera.current?.position.copy(viewport.position);
    perspectiveCamera.current?.rotation.copy(viewport.rotation);
  };

  return (
    <CameraContext.Provider
      value={{
        viewport,
        setViewport,
        perspectiveCamera,
        syncViewport,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => useContext(CameraContext);

export default useCamera;
