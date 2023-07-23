"use client";

import { useToast } from "@/components/ui/use-toast";
import defaultScene from "@/examples/default.json";
import { cleanErrors } from "@/lib/cleanErrors";
import { assignIDs, loadJSON } from "@/lib/loadFile";
import {
  CameraData,
  GlobalData,
  Group,
  Light,
  Primitive,
  Scenefile,
  ScenefileSchema,
} from "@/types/Scenefile";
import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useState,
} from "react";

type ScenefileContextType = {
  scenefile: Scenefile;
  scenefilePath?: string;
  originalScenefile: Scenefile;
  select: (id: Selected) => void;
  toggleSelect: (id: Selected) => void;
  selected: Selected | undefined;
  loadFile: (file: File) => void;
  updateSceneName: (name: string) => void;
  updateGlobalData: (globalData: GlobalData) => void;
  translateGroup: (translate: number[]) => void;
  setGroupTranslate: (translate: number[]) => void;
};

type TypeMap = {
  scene: Scenefile;
  global: GlobalData;
  camera: CameraData;
  group: Group;
  primitive: Primitive;
  light: Light;
};

export type Selected = {
  [K in keyof TypeMap]: {
    type: K;
    item: TypeMap[K];
  };
}[keyof TypeMap];

export type SelectedWithID = Selected & { id: string };

export const selectedHasID = (selected: Selected): selected is SelectedWithID =>
  "id" in selected.item;

const initialScenefileParseResult = ScenefileSchema.safeParse(defaultScene);
if (!initialScenefileParseResult.success) {
  throw new Error("Initial scenefile parse failed");
}
const initialScenefile: Scenefile = assignIDs(initialScenefileParseResult.data);

// Create context
const ScenefileContext = createContext<ScenefileContextType>({
  scenefile: initialScenefile,
  scenefilePath: undefined,
  originalScenefile: initialScenefile,
  select: () => {},
  toggleSelect: () => {},
  selected: undefined,
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
  const [scenefile, dispatch] = useReducer(reducer, initialScenefile);
  const [scenefilePath, setScenefilePath] = useState<string>();
  const [originalScenefile, setOriginalScenefile] =
    useState<Scenefile>(initialScenefile);
  const [selected, setSelected] = useState<Selected>();
  const { toast } = useToast();

  const select = useCallback((selected: Selected) => {
    console.log("Selected", selected);
    setSelected({ ...selected });
  }, []);

  // toggle version, so a second click deselects
  const toggleSelect = useCallback(
    (newSelected: Selected) => {
      if (selected?.item === newSelected.item) {
        console.log("Deselected", selected);
        setSelected(undefined);
      } else {
        console.log("Selected", newSelected);
        setSelected(newSelected);
      }
    },
    [selected]
  );

  const loadFile = useCallback(
    async (file: File) => {
      const data = await loadJSON(file);
      const result = ScenefileSchema.safeParse(data);
      if (result.success) {
        const scenefile = assignIDs(result.data);
        dispatch({ type: "LOAD_FILE", scenefile: scenefile });
        setScenefilePath(file.name);
        setOriginalScenefile(scenefile);
        console.log("Loaded file", file.name);
      } else {
        result.error.errors.forEach((e) => {
          console.error(e.message, e.path),
            toast({
              title: "Error parsing file",
              description: cleanErrors(e),
              variant: "destructive",
            });
        });
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
      if (!selected || selected.type !== "group" || !selectedHasID(selected))
        return;
      dispatch({ type: "TRANSLATE_GROUP", group: selected.item, translate });
    },
    [selected]
  );

  const setGroupTranslate = useCallback(
    (translate: number[]) => {
      if (!selected || selected.type !== "group" || !selectedHasID(selected))
        return;
      dispatch({
        type: "SET_GROUP_TRANSLATE",
        group: selected.item,
        translate,
      });
    },
    [selected]
  );

  return (
    <ScenefileContext.Provider
      value={{
        scenefile,
        scenefilePath,
        originalScenefile,
        select,
        toggleSelect,
        selected,
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
      if (action.translate.length === 3) {
        if (!action.group.translate) action.group.translate = [0, 0, 0];
        action.group.translate[0] += action.translate[0];
        action.group.translate[1] += action.translate[1];
        action.group.translate[2] += action.translate[2];
      }
      return {
        ...state,
      };
    }
    case "SET_GROUP_TRANSLATE": {
      if (action.group && action.translate.length === 3) {
        action.group.translate = action.translate;
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
  group: Group;
  translate: number[];
};

type SetGroupTranslateAction = {
  type: "SET_GROUP_TRANSLATE";
  group: Group;
  translate: number[];
};

type ScenefileAction =
  | LoadFileAction
  | UpdateSceneNameAction
  | UpdateGlobalDataAction
  | TranslateGroupAction
  | SetGroupTranslateAction;

export default useScenefile;
