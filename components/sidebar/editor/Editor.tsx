import { CameraEditor } from "@/components/sidebar/editor/panels/CameraEditor";
import { GroupEditor } from "@/components/sidebar/editor/panels/GroupEditor";
import { LightEditor } from "@/components/sidebar/editor/panels/LightEditor";
import { PrimitiveEditor } from "@/components/sidebar/editor/panels/PrimitiveEditor";
import { SceneEditor } from "@/components/sidebar/editor/panels/SceneEditor";
import { useScenefile } from "@/hooks/useScenefile";
import { useMemo } from "react";

export const Editor = () => {
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
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        Select something in the outline to see and edit its properties here
      </div>
    );

  return <div className="flex flex-col gap-2 py-2">{selectedEditor}</div>;
};
