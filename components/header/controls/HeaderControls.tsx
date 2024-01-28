import { Download } from "@/components/header/Download";
import { Help } from "@/components/header/Help";
import { Preset } from "@/components/header/Preset";
import { Upload } from "@/components/header/Upload";

export const HeaderControls = () => {
  return (
    <div className="flex flex-shrink-0 items-center justify-between gap-2">
      <Help />
      <Preset />
      <Download />
      <Upload />
    </div>
  );
};
