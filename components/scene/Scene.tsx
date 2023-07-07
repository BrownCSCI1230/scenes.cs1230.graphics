"use client";

import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Grid } from "@react-three/drei";

export default function Scene() {
  return (
    <Canvas className="flex flex-grow">
      <color attach="background" args={["white"]} />
      <Grid infiniteGrid sectionColor="white" cellColor="white" />
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
