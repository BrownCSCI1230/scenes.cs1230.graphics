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

  if (!selectedEditor)
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-400 p-8 text-center">
        Select something in the outline to see and edit its properties here here
      </div>
    );

  return <div className="flex flex-col gap-2 py-2">{selectedEditor}</div>;
}
