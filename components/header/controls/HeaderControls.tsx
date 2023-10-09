import Download from "../Download";
import Help from "../Help";
import Preset from "../Preset";
import Upload from "../Upload";

export default function HeaderControls() {
  return (
    <div className="flex flex-shrink-0 items-center justify-between gap-2">
      <Help />
      <Preset />
      <Download />
      <Upload />
    </div>
  );
}
