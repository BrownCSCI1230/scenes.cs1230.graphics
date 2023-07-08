"use client";

import newScene from "@/examples/newScene.json";
import { Scenefile, ScenefileSchema } from "@/types/Scenefile";
import { createContext, useCallback, useContext, useReducer } from "react";

type ScenefileContextType = {
  scenefile: Scenefile;
  loadFile: (file: File) => void;
};

// Create context
const ScenefileContext = createContext<ScenefileContextType>({
  scenefile: newScene,
  loadFile: () => {},
});

// Context provider
export const ScenefileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [scenefile, dispatch] = useReducer(reducer, newScene);

  const loadFile = useCallback(async (file: File) => {
    const data = await loadJSON(file);
    const result = ScenefileSchema.safeParse(data);
    if (result.success) {
      console.log("File parsed successfully");
      dispatch({ type: "LOAD_FILE", scenefile: result.data });
    } else {
      console.log("Error parsing file");
      console.error(result.error);
    }
  }, []);

  return (
    <ScenefileContext.Provider value={{ scenefile, loadFile }}>
      {children}
    </ScenefileContext.Provider>
  );
};

// Hook
export const useScenefile = () => useContext(ScenefileContext);

const reducer = (state: Scenefile, action: ScenefileAction) => {
  switch (action.type) {
    case "LOAD_FILE":
      return action.scenefile;
    case "UPDATE_GLOBAL_DATA":
      return state;
  }
};

type LoadFileAction = {
  type: "LOAD_FILE";
  scenefile: Scenefile;
};

type UpdateGlobalDataAction = {
  type: "UPDATE_GLOBAL_DATA";
};

type ScenefileAction = LoadFileAction | UpdateGlobalDataAction;

async function loadJSON(file: File) {
  const readUploadedFileAsText = () => {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onerror = () => {
        fileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };
      fileReader.onload = () => {
        let contents = fileReader.result;
        if (contents === null) {
          reject(new DOMException("Problem parsing input file."));
          return;
        }
        if (typeof contents !== "string") {
          contents = new TextDecoder("utf-8").decode(contents);
        }
        try {
          const json = JSON.parse(contents);
          resolve(json);
        } catch (e) {
          reject(new DOMException("Invalid JSON."));
          return;
        }
      };
      fileReader.readAsText(file);
    });
  };
  return await readUploadedFileAsText();
}

export default useScenefile;
