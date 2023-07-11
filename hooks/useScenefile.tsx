"use client";

import newScene from "@/examples/newScene.json";
import { assignIDs, loadJSON } from "@/lib/loadFile";
import { Scenefile, ScenefileSchema } from "@/types/Scenefile";
import { createContext, useCallback, useContext, useReducer } from "react";
import { toast } from 'react-toastify';
import { cleanErrors } from "./errors/cleanErrors";

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
      dispatch({ type: "LOAD_FILE", scenefile: assignIDs(result.data) });
    } else {
      console.log("Error parsing file");
      console.error(result.error);
      result.error.errors.forEach(e => toast.error(cleanErrors(e)))
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

export default useScenefile;
