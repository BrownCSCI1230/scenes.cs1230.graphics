"use client";

import useCamera from "@/hooks/useCamera";
import useScenefile from "@/hooks/useScenefile";
import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  PerspectiveCamera
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import SceneCamera from "./SceneCamera";
import SceneGroup from "./SceneGroup";

export default function Scene() {
  const { scenefile } = useScenefile();
  const { setViewport } = useCamera();

  const perspectiveCamera = useThree();

  return (
    // TODO: consider adding `frameloop="demand"` to Canvas: https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#on-demand-rendering
      <Canvas >
        <color attach="background" args={["#f8fafc"]} />
        <gridHelper args={[10, 10]} />
        
        <PerspectiveCamera position={[5, 2, 5]} makeDefault />
        <OrbitControls enableDamping enablePan target={[0, 0, 0]} makeDefault
          onChange={(e) => {
            let pos = e?.target?.object?.position
            let rot = e?.target?.object?.rotation
            if (pos && rot) {
              // console.log("UPDATED VIEWPORT")
              // console.log(pos)
              setViewport({ position: pos, rotation: rot })
            }
          }}
        />
        <GizmoHelper alignment="bottom-right">
          <GizmoViewport
            axisColors={["red", "green", "blue"]}
            labelColor="white"
          />
        </GizmoHelper>
        <SceneCamera camera={scenefile.cameraData}/>
        {scenefile.groups?.map((group) => (
          <SceneGroup key={group.id} group={group} />
        ))}

      </Canvas> 
  );
}
