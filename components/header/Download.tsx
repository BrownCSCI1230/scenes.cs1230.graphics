"use client";

import { Button } from "../ui/button";

import useScenefile from "@/hooks/useScenefile";

export default function Upload() {
  const { scenefile } = useScenefile();

  const downloadScene = () => {
    const jsonContent = JSON.stringify(scenefile, null, 2).replace(
      /"id": "[^"]*",?/g,
      "",
    );

    const regex = /,\s*([\]}])/g;
    const nonCommaResult = jsonContent.replace(regex, "$1");

    const blob = new Blob([nonCommaResult], { type: "application/json" });
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
    <Button onClick={downloadScene} variant="outline">
      Download
    </Button>
  );
}
