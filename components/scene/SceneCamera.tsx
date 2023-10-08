import { focusToLook, lookUpToEuler } from "@/lib/cameraUtils";
import { CameraData } from "@/types/Scenefile";
import { PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

export default function SceneLight({ camera }: { camera: CameraData }) {
  const cameraRef = useRef(null!);
  const [isMounted, setIsMounted] = useState(false);

  // Janky solution for helper not being rendered on first render (as lightRef.current is null)
  useEffect(() => {
    if (cameraRef.current) setIsMounted(true);
  }, [cameraRef]);

  const rotation = lookUpToEuler(
    camera.look || focusToLook(camera.focus, camera.position),
    camera.up,
  );

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        aspect={1200 / 600}
        position={[camera.position[0], camera.position[1], camera.position[2]]}
        near={1}
        far={2}
        fov={camera.heightAngle}
        rotation={rotation}
      />
      {isMounted && <cameraHelper args={[cameraRef.current]} />}
    </>
  );
}
