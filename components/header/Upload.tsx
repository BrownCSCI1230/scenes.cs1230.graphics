"use client";

import { Button } from "@/components/ui/button";
import { useScenefile } from "@/hooks/useScenefile";
import { ChangeEvent, useRef } from "react";

export const Upload = () => {
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
    <>
      <Button onClick={handleClick}>Upload</Button>
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        hidden
        onInput={handleInputChange}
      />
    </>
  );
};
