"use client";

import { Button } from "../ui/button";

import useScenefile from "@/hooks/useScenefile";

export default function Upload() {
  const { scenefile } = useScenefile();

  const downloadScene = () => {
    const jsonContent = JSON.stringify(scenefile, null, 2);

    const blob = new Blob([jsonContent], { type: "application/json" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${scenefile.name}.json`;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="p-1">
      <Button onClick={downloadScene}>Download</Button>
    </div>
  );
}
