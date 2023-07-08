"use client";

import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function Scene() {
  return (
    <Canvas className="border border-slate-200 dark:border-slate-800 rounded-lg">
      <color attach="background" args={["white"]} />
      <Grid infiniteGrid sectionColor="lightgray" cellColor="gray" />
      <PerspectiveCamera makeDefault position={[5, 2, 5]} />
      <OrbitControls enableDamping enablePan target={[0, 0, 0]} makeDefault />
      <GizmoHelper alignment="bottom-right">
        <GizmoViewport
          axisColors={["red", "green", "blue"]}
          labelColor="white"
        />
      </GizmoHelper>
    </Canvas>
  );
}
