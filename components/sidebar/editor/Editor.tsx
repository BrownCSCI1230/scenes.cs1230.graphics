import useScenefile from "@/hooks/useScenefile";
import CameraEditor from "./editor_controls/CameraEditor";
import GlobalEditor from "./editor_controls/GlobalEditor";
import GroupEditor from "./editor_controls/GroupEditor";
import LightEditor from "./editor_controls/LightEditor";
import PrimitiveEditor from "./editor_controls/PrimitiveEditor";
import SceneEditor from "./editor_controls/SceneEditor";

export default function Editor() {
  const { selected } = useScenefile();

  const selectedEditor = () => {
    switch(selected?.type) {
      case "scene":     return <SceneEditor />;
      case "global":    return <GlobalEditor />;
      case "camera":    return <CameraEditor />;
      case "light":     return <LightEditor />;
      case "primitive": return <PrimitiveEditor />;
      case "group":     return <GroupEditor />;
      default:          return <p>...</p>
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {selectedEditor()}
    </div>
  );
}
