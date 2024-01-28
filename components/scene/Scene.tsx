"use client";

import { SceneCamera } from "@/components/scene/SceneCamera";
import { SceneGroup } from "@/components/scene/SceneGroup";
import { useCamera } from "@/hooks/useCamera";
import { useScenefile } from "@/hooks/useScenefile";
import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export const Scene = () => {
  const { scenefile } = useScenefile();
  const { perspectiveCamera, orbitControls, setOrbitTarget } = useCamera();

  return (
    // TODO: consider adding `frameloop="demand"` to Canvas: https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#on-demand-rendering
    <Canvas>
      <color attach="background" args={["#f8fafc"]} />
      <gridHelper args={[10, 10]} />

      <PerspectiveCamera
        ref={perspectiveCamera}
        position={[5, 2, 5]}
        makeDefault
      />
      <OrbitControls
        ref={orbitControls}
        enableDamping
        enablePan
        target={[0, 0, 0]}
        makeDefault
      />
      <GizmoHelper alignment="bottom-right">
        <GizmoViewport
          axisColors={["red", "green", "blue"]}
          labelColor="white"
        />
      </GizmoHelper>
      <SceneCamera camera={scenefile.cameraData} />
      {scenefile.groups?.map((group) => (
        <SceneGroup key={group.id} group={group} />
      ))}
    </Canvas>
  );
};
