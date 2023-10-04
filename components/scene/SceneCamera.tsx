import useScenefile from "@/hooks/useScenefile";
import { CameraData } from "@/types/Scenefile";
import { PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

import { Euler, Matrix4, Vector3 } from "three";

function lookAndUpToRotation(look: Vector3, up: Vector3): Euler {
  const forward = new Vector3().copy(look).normalize();
  const right = new Vector3().crossVectors(up, forward).normalize();
  const newUp = new Vector3().crossVectors(forward, right);

  const matrix = new Matrix4().makeBasis(right, newUp, forward);
  const euler = new Euler();
  euler.setFromRotationMatrix(matrix);

  return euler;
}

export default function SceneLight({ camera }: { camera: CameraData }) {
  const cameraRef = useRef(null!);
  const [isMounted, setIsMounted] = useState(false);

  // Janky solution for helper not being rendered on first render (as lightRef.current is null)
  useEffect(() => {
    if (cameraRef.current) setIsMounted(true);
  }, [cameraRef]);

  const { selected } = useScenefile();
  const isSelected = selected && selected.item === camera;

  const pos = camera.position;

  const look = camera.look
    ? new Vector3(camera.look[0], camera.look[1], camera.look[2])
    : new Vector3(
        camera.position[0] - camera.focus[0],
        camera.position[1] - camera.focus[1],
        camera.position[2] - camera.focus[2]
      );

  const up = new Vector3(camera.up[0], camera.up[1], camera.up[2]);

  const rot = lookAndUpToRotation(look, up);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        aspect={1200 / 600}
        position={[pos[0], pos[1], pos[2]]}
        near={1}
        far={2}
        fov={camera.heightAngle}
        rotation={rot}
      />
      {isMounted && <cameraHelper args={[cameraRef.current]} />}
    </>
  );
}
