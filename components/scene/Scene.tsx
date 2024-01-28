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
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const Scene = () => {
  const [backgroundColor, setBackgroundColor] = useState("#f5f5f5");
  const { theme } = useTheme();
  useEffect(() => {
    // Need to wait a bit for the theme to be applied
    setTimeout(() => {
      const accent = getComputedStyle(
        document.documentElement,
      ).getPropertyValue("--accent");
      setBackgroundColor(hslStringToHex(accent));
    }, 50);
  }, [theme]);

  const { scenefile } = useScenefile();
  const { perspectiveCamera, orbitControls, setOrbitTarget } = useCamera();

  return (
    // TODO: consider adding `frameloop="demand"` to Canvas: https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#on-demand-rendering
    <Canvas className="rounded-lg">
      <color attach="background" args={[backgroundColor]} />
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

const hslStringToHex = (hslString: string) => {
  // Parse the HSL values from the string
  let [h_str, s_str, l_str] = hslString.split(" ");
  let h = parseFloat(h_str); // Hue: Convert to number
  let s = parseFloat(s_str) / 100; // Saturation: Convert percentage to decimal
  let l = parseFloat(l_str) / 100; // Lightness: Convert percentage to decimal

  // Calculate C, X, and m
  const C = (1 - Math.abs(2 * l - 1)) * s;
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - C / 2;

  // Calculate RGB'
  let rPrime, gPrime, bPrime;
  if (h >= 0 && h < 60) {
    [rPrime, gPrime, bPrime] = [C, X, 0];
  } else if (h >= 60 && h < 120) {
    [rPrime, gPrime, bPrime] = [X, C, 0];
  } else if (h >= 120 && h < 180) {
    [rPrime, gPrime, bPrime] = [0, C, X];
  } else if (h >= 180 && h < 240) {
    [rPrime, gPrime, bPrime] = [0, X, C];
  } else if (h >= 240 && h < 300) {
    [rPrime, gPrime, bPrime] = [X, 0, C];
  } else if (h >= 300 && h <= 360) {
    [rPrime, gPrime, bPrime] = [C, 0, X];
  }

  // Convert RGB' to RGB and then to Hex
  const toHex = (c: number | undefined) =>
    c === undefined
      ? "ff"
      : Math.round((c + m) * 255)
          .toString(16)
          .padStart(2, "0");
  const hex = `#${toHex(rPrime)}${toHex(gPrime)}${toHex(bPrime)}`;
  return hex;
};
