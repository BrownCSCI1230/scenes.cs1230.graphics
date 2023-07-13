"use client";

import useScenefile from "@/hooks/useScenefile";
import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import SceneGroup from "./SceneGroup";

export default function Scene() {
  const { scenefile } = useScenefile();
  return (
    // TODO: consider adding `frameloop="demand"` to Canvas: https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#on-demand-rendering
    <Canvas className="border border-slate-200 dark:border-slate-800 rounded-lg">
      <color attach="background" args={["#f8fafc"]} />
      <gridHelper args={[10, 10]} />
      <PerspectiveCamera position={[5, 2, 5]} makeDefault />
      <OrbitControls enableDamping enablePan target={[0, 0, 0]} makeDefault />
      <GizmoHelper alignment="bottom-right">
        <GizmoViewport
          axisColors={["red", "green", "blue"]}
          labelColor="white"
        />
      </GizmoHelper>
      {scenefile.groups?.map((group) => (
        <SceneGroup key={group.id} {...group} />
      ))}
    </Canvas>
  );
}
