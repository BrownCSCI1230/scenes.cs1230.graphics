import { Light } from "@/types/Scenefile";
import { useEffect, useRef, useState } from "react";
import { Color, Matrix4 } from "three";

const noTransform: Matrix4 = new Matrix4().identity();

export default function SceneLight({ light }: { light: Light }) {
  const lightRef = useRef(null!);
  const [isMounted, setIsMounted] = useState(false);

  // Janky solution for helper not being rendered on first render (as lightRef.current is null)
  useEffect(() => {
    if (lightRef.current) setIsMounted(true);
  }, [lightRef]);

  const colorR = light.color[0] ?? 1;
  const colorG = light.color[1] ?? 1;
  const colorB = light.color[2] ?? 1;
  const color = new Color(colorR, colorG, colorB);

  switch (light.type) {
    case "point":
      return (
        <>
          <pointLight ref={lightRef} color={color}></pointLight>
          {isMounted && (
            <pointLightHelper
              args={[lightRef.current, 0.2, "gold"]}
              matrix-copy={null}
              matrix={{ ...noTransform }}
            />
          )}
        </>
      );
    // TODO: handle spotlight direction; currently it always points down
    case "spot":
      return (
        <>
          <spotLight
            ref={lightRef}
            penumbra={light.penumbra}
            angle={light.angle}
            position={[0, 0, 0]}
          />
          {isMounted && (
            <spotLightHelper
              args={[lightRef.current, "gold"]}
              matrix-copy={null}
              matrix={{ ...noTransform }}
            />
          )}
        </>
      );
    case "directional":
      const norm = Math.sqrt(
        light.direction[0] ** 2 +
          light.direction[1] ** 2 +
          light.direction[2] ** 2,
      );
      const normalizedDirection = light.direction.map((x) => x / norm);
      return (
        <>
          <directionalLight
            ref={lightRef}
            args={[color]}
            position={[
              -4 * normalizedDirection[0],
              -4 * normalizedDirection[1],
              -4 * normalizedDirection[2],
            ]}
          />
          {isMounted && (
            <directionalLightHelper
              args={[lightRef.current, 0.2, "gold"]}
              // matrix-copy={null}
              // matrix={{ ...noTransform }}
            />
          )}
        </>
      );
  }
}
