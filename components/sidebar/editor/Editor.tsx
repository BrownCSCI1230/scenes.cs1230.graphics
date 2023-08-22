import useScenefile from "@/hooks/useScenefile";
import { useMemo } from "react";
import CameraEditor from "./panels/CameraEditor";
import GroupEditor from "./panels/GroupEditor";
import LightEditor from "./panels/LightEditor";
import PrimitiveEditor from "./panels/PrimitiveEditor";
import SceneEditor from "./panels/SceneEditor";

export default function Editor() {
  const { selected } = useScenefile();

  const selectedEditor = useMemo(() => {
    switch (selected?.type) {
      case "scene":
        return <SceneEditor />;
      case "camera":
        return <CameraEditor />;
      case "light":
        return <LightEditor />;
      case "primitive":
        return <PrimitiveEditor />;
      case "group":
        return <GroupEditor />;
      default:
        return null;
    }
  }, [selected?.type]);

  return <div className="flex flex-col gap-2 pt-2">{selectedEditor}</div>;
}
