"use client";

import { useToast } from "@/components/ui/use-toast";
import newScene from "@/examples/newScene.json";
import { getSelectedGroup } from "@/lib/getSelected";
import { assignIDs, loadJSON } from "@/lib/loadFile";
import { GlobalData, Scenefile, ScenefileSchema } from "@/types/Scenefile";
import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useState,
} from "react";
import { cleanErrors } from "./errors/cleanErrors";

type ScenefileContextType = {
  scenefile: Scenefile;
  select: (id: string) => void;
  loadFile: (file: File) => void;
  updateSceneName: (name: string) => void;
  updateGlobalData: (globalData: GlobalData) => void;
  translateGroup: (translate: number[]) => void;
  setGroupTranslate: (translate: number[]) => void;
};

// Create context
const ScenefileContext = createContext<ScenefileContextType>({
  scenefile: newScene,
  select: () => {},
  loadFile: () => {},
  updateSceneName: () => {},
  updateGlobalData: () => {},
  translateGroup: () => {},
  setGroupTranslate: () => {},
});

// Context provider
export const ScenefileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [scenefile, dispatch] = useReducer(reducer, newScene);
  const [selected, setSelected] = useState<string | undefined>();
  const { toast } = useToast();

  const select = useCallback((id: string) => {
    console.log("Selected", id);
    setSelected(id);
  }, []);

  const loadFile = useCallback(
    async (file: File) => {
      const data = await loadJSON(file);
      const result = ScenefileSchema.safeParse(data);
      if (result.success) {
        dispatch({ type: "LOAD_FILE", scenefile: assignIDs(result.data) });
      } else {
        result.error.errors.forEach((e) =>
          toast({
            title: "Error parsing file",
            description: cleanErrors(e),
            variant: "destructive",
          })
        );
      }
    },
    [toast]
  );

  const updateSceneName = useCallback(
    () => (name: string) => {
      dispatch({ type: "UPDATE_SCENE_NAME", name });
    },
    []
  );

  const updateGlobalData = useCallback(
    () => (globalData: GlobalData) => {
      dispatch({ type: "UPDATE_GLOBAL_DATA", globalData });
    },
    []
  );

  const translateGroup = useCallback(
    (translate: number[]) => {
      if (!selected) return;
      dispatch({ type: "TRANSLATE_GROUP", selected, translate });
    },
    [selected]
  );

  const setGroupTranslate = useCallback(
    (translate: number[]) => {
      if (!selected) return;
      dispatch({ type: "SET_GROUP_TRANSLATE", selected, translate });
    },
    [selected]
  );

  return (
    <ScenefileContext.Provider
      value={{
        scenefile,
        select,
        loadFile,
        updateSceneName,
        updateGlobalData,
        translateGroup,
        setGroupTranslate,
      }}
    >
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
    case "UPDATE_SCENE_NAME":
      return {
        ...state,
        name: action.name,
      };
    case "UPDATE_GLOBAL_DATA":
      return {
        ...state,
        globalData: action.globalData,
      };
    case "TRANSLATE_GROUP": {
      const group = getSelectedGroup(state, action.selected);
      if (group && action.translate.length === 3) {
        if (!group.translate) group.translate = [0, 0, 0];
        group.translate[0] += action.translate[0];
        group.translate[1] += action.translate[1];
        group.translate[2] += action.translate[2];
      }
      return {
        ...state,
      };
    }
    case "SET_GROUP_TRANSLATE": {
      const group = getSelectedGroup(state, action.selected);
      if (group && action.translate.length === 3) {
        group.translate = action.translate;
      }
      return {
        ...state,
      };
    }
  }
};

type LoadFileAction = {
  type: "LOAD_FILE";
  scenefile: Scenefile;
};

type UpdateSceneNameAction = {
  type: "UPDATE_SCENE_NAME";
  name: string;
};

type UpdateGlobalDataAction = {
  type: "UPDATE_GLOBAL_DATA";
  globalData: GlobalData;
};

type TranslateGroupAction = {
  type: "TRANSLATE_GROUP";
  selected: string;
  translate: number[];
};

type SetGroupTranslateAction = {
  type: "SET_GROUP_TRANSLATE";
  selected: string;
  translate: number[];
};

type ScenefileAction =
  | LoadFileAction
  | UpdateSceneNameAction
  | UpdateGlobalDataAction
  | TranslateGroupAction
  | SetGroupTranslateAction;

export default useScenefile;
