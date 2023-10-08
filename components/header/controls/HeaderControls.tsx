import Download from "../Download";
import Preset from "../Preset";
import Upload from "../Upload";

export default function HeaderControls() {
  return (
    <div className="flex flex-shrink-0 items-center justify-between gap-2">
      <Preset />
      <Download />
      <Upload />
    </div>
  );
}
