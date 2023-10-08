"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useScenefile from "@/hooks/useScenefile";

export default function Preset() {
  const { loadFile } = useScenefile();
  const { scenefilePath } = useScenefile();
  // @ts-ignore
  const files = require.context("examples", true, /\.json$/);

  const handleClick = (file: string) => {
    const blob = new Blob([JSON.stringify(files(file), null, 2)], {
      type: "application/json",
    });
    loadFile(blob as File);
  };

  return (
    <Select onValueChange={handleClick}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={scenefilePath ?? "No file loaded"} />
      </SelectTrigger>
      <SelectContent>
        {files.keys().map((key: string) => {
          if (key.includes("examples/")) return;
          return (
            <SelectItem key={key} value={key}>
              {key.replace("./", "").replace(".json", "")}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
