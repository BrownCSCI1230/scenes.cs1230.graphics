"use client";

import useScenefile from "@/hooks/useScenefile";
import { ChangeEvent } from "react";

export default function Upload() {
  const { loadFile } = useScenefile();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files?.length === 0) {
      return;
    }
    loadFile(e.target.files[0]);
  };

  return <input type="file" accept=".json" onChange={handleInputChange} />;
}
