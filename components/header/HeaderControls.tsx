import { Download } from "@/components/header/controls/Download";
import { Help } from "@/components/header/controls/Help";
import { Preset } from "@/components/header/controls/Preset";
import { Upload } from "@/components/header/controls/Upload";
import { ThemeToggle } from "@/components/header/controls/theme/ThemeToggle";

export const HeaderControls = () => {
  return (
    <div className="flex flex-shrink-0 items-center justify-between gap-2">
      <Help />
      <ThemeToggle />
      <Preset />
      <Download />
      <Upload />
    </div>
  );
};
