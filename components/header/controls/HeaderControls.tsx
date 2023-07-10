import Download from "../Download";
import Upload from "../Upload";

export default function HeaderControls() {
  return (
    <div className="flex flex-shrink-0 justify-between items-center">
      <Upload />
      <Download />
    </div>
  );
}
