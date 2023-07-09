"use client";

import useScenefile from "@/hooks/useScenefile";
import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import SceneGroup from "./SceneGroup";

export default function Scene() {
  const { scenefile } = useScenefile();
  return (
    // TODO: consider adding `framloop="demand"` to Canvas: https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#on-demand-rendering
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
      {scenefile.groups?.map((group) => (
        <SceneGroup key={group.id} {...group} />
      ))}
      {/* temporary basic light */}
      <ambientLight intensity={0.5} />
    </Canvas>
  );
}
