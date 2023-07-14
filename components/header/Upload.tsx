"use client";

import { useExitWarning } from "@/hooks/useExitWarning";
import useScenefile from "@/hooks/useScenefile";
import { ChangeEvent, useRef } from "react";
import { Button } from "../ui/button";

export default function Upload() {
  useExitWarning();
  const { loadFile } = useScenefile();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files?.length === 0) {
      return;
    }
    loadFile(e.target.files[0]);
    // reset the input so that the same file can be uploaded again
    e.target.value = "";
  };

  return (
    <div className="p-1">
      <Button onClick={handleClick}>Upload</Button>
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        hidden
        onInput={handleInputChange}
      />
    </div>
  );
}
