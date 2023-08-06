"use client";

import { useToast } from "@/components/ui/use-toast";
import defaultScene from "@/examples/default.json";
import { cleanErrors } from "@/lib/cleanErrors";
import { assignIDs, loadJSON } from "@/lib/loadFile";
import {
  CameraData,
  GenericProperty,
  GlobalData,
  GlobalDataProperty,
  Group,
  Light,
  LightProperty,
  Primitive,
  PrimitiveProperty,
  Scenefile,
  ScenefileSchema
} from "@/types/Scenefile";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";



type ScenefileContextType = {
  scenefile: Scenefile;
  scenefilePath?: string;
  originalScenefile: Scenefile;
  lights: Light[];
  select: (id: Selected) => void;
  toggleSelect: (id: Selected) => void;
  selected: Selected | undefined;
  loadFile: (file: File) => void;
  updateSceneName: (name: string) => void;
  updateGlobalData: (globalData: GlobalData) => void;
  translateGroup: (translate: number[]) => void;
  setGroupTranslate: (translate: number[]) => void;
  rotateGroup: (rotate: number[]) => void;
  setGroupRotate: (rotate: number[]) => void;
  setGroupScale: (scale: number[]) => void;
  setPrimitiveProperty: (property: PrimitiveProperty, value: GenericProperty) => void;
  setLightProperty: (property: LightProperty, value: GenericProperty) => void;
  setGlobalDataProperty: (property: GlobalDataProperty, value: GenericProperty) => void;
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
  lights: [],
  select: () => {},
  toggleSelect: () => {},
  selected: undefined,
  loadFile: () => {},
  updateSceneName: () => {},
  updateGlobalData: () => {},
  translateGroup: () => {},
  setGroupTranslate: () => {},
  rotateGroup: () => {},
  setGroupRotate: () => {},
  setGroupScale: () => {},
  setPrimitiveProperty: () => {},
  setLightProperty: () => {},
  setGlobalDataProperty: () => {},
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

  const [lights, setLights] = useState<Light[]>([]);

  // TODO: use something like LightCTM in HelperTypes to colllect CTM info along recursive path?
  // .. is there a better way to collect light info than this?
  const getLightsRecursive = useCallback((group: Group) => {
    let allLights: Light[] = [];
    if (group.lights) {
      allLights = allLights.concat(group.lights);
    }
    if (group.groups) {
      group.groups.forEach((childGroup) => {
        allLights = allLights.concat(getLightsRecursive(childGroup));
      });
    }
    return allLights;
  }, []);

  // TODO: maybe a better way to dispatch this only on light-based edits? (add or remove)
  useEffect(() => {
    if (scenefile) {
      const allLights = getLightsRecursive(scenefile);
      setLights(allLights);
    }
  }, [scenefile, getLightsRecursive]);

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
      dispatch({ type: "UPDATE_SCENE_NAME", name: name });
    },
    []
  );

  const updateGlobalData = useCallback(
    () => (globalData: GlobalData) => {
      dispatch({ type: "UPDATE_GLOBAL_DATA", globalData: globalData });
    },
    []
  );

  const translateGroup = useCallback(
    (translate: number[]) => {
      if (!selected || selected.type !== "group" || !selectedHasID(selected))
        return;
      dispatch({ type: "TRANSLATE_GROUP", group: selected.item, translate: translate });
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
        translate: translate,
      });
    },
    [selected]
  );

  const rotateGroup = useCallback(
    (rotate: number[]) => {
      if (!selected || selected.type !== "group" || !selectedHasID(selected))
        return;
      dispatch({ type: "ROTATE_GROUP", group: selected.item, rotate: rotate });
    },
    [selected]
  );

  const setGroupRotate = useCallback(
    (rotate: number[]) => {
      if (!selected || selected.type !== "group" || !selectedHasID(selected))
        return;
      dispatch({
        type: "SET_GROUP_ROTATE",
        group: selected.item,
        rotate: rotate,
      });
    },
    [selected]
  );

  const setGroupScale = useCallback(
    (scale: number[]) => {
      if (!selected || selected.type !== "group" || !selectedHasID(selected))
        return;
      dispatch({
        type: "SET_GROUP_SCALE",
        group: selected.item,
        scale: scale,
      });
    },
    [selected]
  );

  const setPrimitiveProperty = useCallback(
    (property: PrimitiveProperty, value: GenericProperty) => {
      if (!selected || selected.type !== "primitive" || !selectedHasID(selected))
        return;
      dispatch({
        type: "SET_PRIMITIVE_PROPERTY",
        primitive: selected.item,
        property: property,
        value: value,
      });
    },
    [selected]
  );

  const setLightProperty = useCallback(
    (property: LightProperty, value: GenericProperty) => {
      if (!selected || selected.type !== "light" || !selectedHasID(selected))
        return;
      dispatch({
        type: "SET_LIGHT_PROPERTY",
        light: selected.item,
        property: property,
        value: value,
      });
    },
    [selected]
  );

  const setGlobalDataProperty = useCallback( 
    (property: GlobalDataProperty, value: GenericProperty) => {
      if (!selected || (selected.type !== "global" && selected.type !== "scene") || !selectedHasID(selected))
        return;
      dispatch({
        type: "SET_GLOBAL_DATA_PROPERTY",
        globalData: (selected.type == "global") ? selected.item : selected.item.globalData,
        property: property,
        value: value,
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
        lights,
        select,
        toggleSelect,
        selected,
        loadFile,
        updateSceneName,
        updateGlobalData,
        translateGroup,
        setGroupTranslate,
        rotateGroup,
        setGroupRotate,
        setGroupScale,
        setPrimitiveProperty,
        setLightProperty,
        setGlobalDataProperty
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
    case "ROTATE_GROUP": {
      if (action.rotate.length === 3) {
        if (!action.group.rotate) action.group.rotate = [0, 0, 0];
        action.group.rotate[0] += action.rotate[0];
        action.group.rotate[1] += action.rotate[1];
        action.group.rotate[2] += action.rotate[2];
      }
      return {
        ...state,
      };
    }
    case "SET_GROUP_ROTATE": {
      if (action.group && action.rotate.length === 3) {
        action.group.rotate = action.rotate;
      }
      return {
        ...state,
      };
    }
    case "SET_GROUP_SCALE": {
      if (action.group && action.scale.length === 3) {
        action.group.scale = action.scale;
      }
      return {
        ...state,
      };
    }
    case "SET_PRIMITIVE_PROPERTY": {
      if (action.primitive && action.property in action.primitive) {
        (action.primitive as any)[action.property] = action.value;
      }
      return {
        ...state,
      }
    }
    case "SET_LIGHT_PROPERTY": {
      if (action.light && action.property in action.light) {
        (action.light as any)[action.property] = action.value;
      }
      return {
        ...state
      }
    }
    case "SET_GLOBAL_DATA_PROPERTY": {
      if (action.globalData && action.property in action.globalData) {
        (action.globalData as any)[action.property] = action.value;
      }
      return {
        ...state
      }
    }
  }
};

function isValidProperty(obj: object, key: PrimitiveProperty) {
  return key in obj;
}

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

type RotateGroupAction = {
  type: "ROTATE_GROUP";
  group: Group;
  rotate: number[];
};

type SetGroupRotateAction = {
  type: "SET_GROUP_ROTATE";
  group: Group;
  rotate: number[];
};

type SetGroupScaleAction = {
  type: "SET_GROUP_SCALE";
  group: Group;
  scale: number[];
};

type SetPrimitivePropertyAction = {
  type: "SET_PRIMITIVE_PROPERTY";
  primitive: Primitive;
  property: PrimitiveProperty;
  value: GenericProperty;
}

type SetLightPropertyAction = {
  type: "SET_LIGHT_PROPERTY";
  light: Light;
  property: LightProperty;
  value: GenericProperty;
}

type SetGlobalDataPropertyAction = {
  type: "SET_GLOBAL_DATA_PROPERTY";
  globalData: GlobalData;
  property: GlobalDataProperty;
  value: GenericProperty;
}

type ScenefileAction =
  | LoadFileAction
  | UpdateSceneNameAction
  | UpdateGlobalDataAction
  | TranslateGroupAction
  | SetGroupTranslateAction
  | RotateGroupAction
  | SetGroupRotateAction
  | SetGroupScaleAction
  | SetPrimitivePropertyAction
  | SetLightPropertyAction
  | SetGlobalDataPropertyAction;

export default useScenefile;
