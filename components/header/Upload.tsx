"use client";

import useScenefile from "@/hooks/useScenefile";
import { ChangeEvent, useRef } from "react";
import { Button } from "../ui/button";

export default function Upload() {
  const { loadFile } = useScenefile();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files?.length === 0) {
      return;
    }
    loadFile(e.target.files[0]);
  };

  return (
    <>
      <Button>Upload</Button>
      <input type="file" accept=".json" hidden onChange={handleInputChange} />
    </>
  );
}
