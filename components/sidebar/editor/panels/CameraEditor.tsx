import useScenefile from "@/hooks/useScenefile";
import SingleInput from "../components/SingleInput";
import TripleInput from "../components/TripleInput";

export default function CameraEditor() {
  const { selected, setCameraPosition, setCameraLook, setCameraUp, setCameraProperty } = useScenefile();

  if (selected?.type !== "camera") return null;

  const camera = selected.item;
  const pos = camera.position
  const up = camera.up
  const look = camera.look ?? [0, 0, 0];

  return (
    <>
      <h3><b>Camera</b></h3>
      <TripleInput
        label="pos"
        x={pos[0]}
        y={pos[1]}
        z={pos[2]}
        onXChange={(value) =>
          setCameraPosition([value, pos[1], pos[2]])
        }
        onYChange={(value) =>
          setCameraPosition([pos[0], value, pos[2]])
        }
        onZChange={(value) =>
          setCameraPosition([pos[0], pos[1], value])
        }
      />
      <TripleInput
        label="look"
        x={look[0]}
        y={look[1]}
        z={look[2]}
        onXChange={(value) =>
          setCameraLook([value, look[1], look[2]])
        }
        onYChange={(value) =>
          setCameraLook([look[0], value, look[2]])
        }
        onZChange={(value) =>
          setCameraLook([look[0], look[1], value])
        }
      />
      <TripleInput
        label="up"
        x={up[0]}
        y={up[1]}
        z={up[2]}
        onXChange={(value) =>
          setCameraUp([value, up[1], up[2]])
        }
        onYChange={(value) =>
          setCameraUp([up[0], value, up[2]])
        }
        onZChange={(value) =>
          setCameraUp([up[0], up[1], value])
        }
      />
      <SingleInput 
        label="heightAngle"
        value={camera.heightAngle}
        onChange={(e) => setCameraProperty("heightAngle", e.target.value)}
      />

    </>
  );
}
