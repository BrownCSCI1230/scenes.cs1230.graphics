"use client";

import useCamera from "@/hooks/useCamera";
import useScenefile from "@/hooks/useScenefile";
import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  OrbitControlsChangeEvent,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Vector3 } from "three";
import SceneCamera from "./SceneCamera";
import SceneGroup from "./SceneGroup";


function listToVector3(list: number[]): Vector3 {
  return new Vector3(list[0], list[1], list[2]);
}

function listMagnitude(list: number[]): number {
  let acc = 0
  for (let i = 0; i < list.length; i++) {
    acc += list[i] * list[i]
  }
  return Math.sqrt(acc)
}

export default function Scene() {
  const { scenefile } = useScenefile();
  const { setViewport, perspectiveCamera, orbitControls, setOrbitTarget } = useCamera();

  const updateViewportInfo = (e: OrbitControlsChangeEvent |  undefined) => {
    const pos = e?.target?.object?.position;
    const rot = e?.target?.object?.rotation;
  
    const scenecam_pos = scenefile.cameraData.position;
  
    let focus = scenefile.cameraData.focus
    let look = scenefile.cameraData.look
  
    let FOCAL_DISTANCE = 2;
    const target = (focus) ?  listToVector3(focus) :
                  (look && listMagnitude(look) !== 0) ? listToVector3(scenecam_pos).add(listToVector3(look).multiplyScalar(-FOCAL_DISTANCE))  : new Vector3(0,0,0);
    
    setOrbitTarget(target)
  
    let up = listToVector3(scenefile.cameraData.up)
    if (pos && rot && up) {
      setViewport({ position: pos, rotation: rot, up: up});
    }
  }

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
        onChange={(e) => {
          updateViewportInfo(e)
        }}
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
}
