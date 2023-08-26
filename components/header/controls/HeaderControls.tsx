import Download from "../Download";
import Preset from "../Preset";
import Upload from "../Upload";
import useScenefile from "@/hooks/useScenefile";

export default function HeaderControls() {
  return (
    <div className="flex flex-shrink-0 justify-between items-center">
      <Preset />
      <Download />
      <Upload />
    </div>
  );
}
