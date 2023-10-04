"use client";

import { createContext, useContext, useState } from "react";
import { Euler, Vector3 } from "three";

// global context of the Three viewport camera

type ViewportInfo = {
  position: Vector3;
  rotation: Euler;
}

type CameraContextType = {
  viewport: ViewportInfo;
  setViewport: (viewport: ViewportInfo) => void;
}

const CameraContext = createContext<CameraContextType>({
  viewport: { 
    position: new Vector3(),
    rotation: new Euler()
  },
  setViewport: () => {}
})

export const CameraProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [viewport, setViewport] = useState<ViewportInfo>({
    position: new Vector3(),
    rotation: new Euler()
  });

  return (
    <CameraContext.Provider
      value={{
        viewport,
        setViewport
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => useContext(CameraContext);


export default useCamera;