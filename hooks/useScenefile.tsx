"use client";

import { useToast } from "@/components/ui/use-toast";
import defaultScene from "@/examples/default.json";
import { cleanErrors } from "@/lib/cleanErrors";
import { assignIDs, loadJSON } from "@/lib/loadFile";
import {
  CameraData,
  CameraProperty,
  GenericProperty,
  GlobalData,
  GlobalDataProperty,
  Group,
  Light,
  LightProperty,
  Primitive,
  PrimitiveProperty,
  Scenefile,
  ScenefileSchema,
} from "@/types/Scenefile";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

type ScenefileContextType = {
  scenefile: Scenefile;
  scenefilePath?: string;
  originalScenefile: Scenefile;
  scenefileHasChanged: boolean;
  lights: Light[];
  templateGroupMap: { [name: string]: Group };
  select: (id: Selected) => void;
  toggleSelect: (id: Selected) => void;
  selected: Selected | undefined;
  loadFile: (file: File) => void;
  setSceneName: (name: string) => void;
  updateGlobalData: (globalData: GlobalData) => void;
  deleteItem: (item: Deletable) => void;
  translateGroup: (translate: number[]) => void;
  setGroupTranslate: (translate: number[]) => void;
  setGroupName: (name: string) => void;
  rotateGroup: (rotate: number[]) => void;
  setGroupRotate: (rotate: number[]) => void;
  setGroupScale: (scale: number[]) => void;
  setPrimitiveProperty: (
    property: PrimitiveProperty,
    value: GenericProperty,
  ) => void;
  setLightName: (name: string) => void;
  setLightProperty: (property: LightProperty, value: GenericProperty) => void;
  setGlobalDataProperty: (
    property: GlobalDataProperty,
    value: GenericProperty,
  ) => void;
  setCameraPosition: (translate: number[]) => void;
  setCameraLook: (look?: number[]) => void;
  setCameraFocus: (focus?: number[]) => void;
  setCameraUp: (up: number[]) => void;
  setCameraHeightAngle: (value: number) => void;
  setCameraProperty: (property: CameraProperty, value: GenericProperty) => void;
  setAddPrimitive: (primitive: string) => void;
  setAddLight: (light: string) => void;
  setAddGroup: () => void;
};

type SelectedMap = {
  scene: Scenefile;
  camera: CameraData;
  group: Group;
  primitive: Primitive;
  light: Light;
};

type Deletable = Group | Light | Primitive;

export type Selected = {
  [K in keyof SelectedMap]: {
    type: K;
    item: SelectedMap[K];
  };
}[keyof SelectedMap];

export type SelectedWithID = Selected & { id: string };

export const selectedHasID = (selected: Selected): selected is SelectedWithID =>
  "id" in selected.item;

const initialScenefileParseResult = ScenefileSchema.safeParse(defaultScene);
if (!initialScenefileParseResult.success) {
  throw new Error("Initial scenefile parse failed");
}
const initialScenefile: Scenefile = assignIDs(initialScenefileParseResult.data);

type PrimitiveTypeNames = "cone" | "cube" | "cylinder" | "sphere";

// Create context
const ScenefileContext = createContext<ScenefileContextType>({
  scenefile: initialScenefile,
  scenefilePath: undefined,
  originalScenefile: initialScenefile,
  scenefileHasChanged: false,
  selected: undefined,
  select: () => {},
  lights: [],
  templateGroupMap: {},
  toggleSelect: () => {},
  loadFile: () => {},
  setSceneName: () => {},
  updateGlobalData: () => {},
  deleteItem: () => {},
  translateGroup: () => {},
  setGroupTranslate: () => {},
  setGroupName: () => {},
  rotateGroup: () => {},
  setGroupRotate: () => {},
  setGroupScale: () => {},
  setPrimitiveProperty: () => {},
  setLightName: () => {},
  setLightProperty: () => {},
  setGlobalDataProperty: () => {},
  setCameraPosition: () => {},
  setCameraLook: () => {},
  setCameraFocus: () => {},
  setCameraUp: () => {},
  setCameraHeightAngle: () => {},
  setCameraProperty: () => {},
  setAddPrimitive: () => {},
  setAddLight: () => {},
  setAddGroup: () => {},
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
  const scenefileHasChanged = scenefile !== originalScenefile;
  const [selected, setSelected] = useState<Selected>();
  const { toast } = useToast();

  const [lights, setLights] = useState<Light[]>([]);

  const templateGroupMap = useMemo(() => {
    const map: { [name: string]: Group } = {};
    if (scenefile.templateGroups) {
      scenefile.templateGroups.forEach((group) => {
        map[group.name] = group;
      });
    }
    return map;
  }, [scenefile]);

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

  // TODO: figure out why selected.item != scenefile then remove this
  useEffect(() => {
    if (selected?.type === "scene") selected.item = scenefile;
  }, [scenefile, selected]);

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
    [selected],
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
        setSelected(undefined);
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
    [toast],
  );

  const setSceneName = useCallback((name: string) => {
    dispatch({ type: "SET_SCENE_NAME", name: name });
  }, []);

  const updateGlobalData = useCallback((globalData: GlobalData) => {
    dispatch({ type: "UPDATE_GLOBAL_DATA", globalData: globalData });
  }, []);

  const deleteItem = useCallback(
    (item: Deletable) => {
      const deleteItemRecursive = (group: Group) => {
        if (group.groups) {
          group.groups = group.groups.filter((g) => g !== item);
          group.groups.forEach((g) => {
            deleteItemRecursive(g);
          });
        }
        if (group.primitives) {
          group.primitives = group.primitives.filter((p) => p !== item);
        }
        if (group.lights) {
          group.lights = group.lights.filter((l) => l !== item);
        }
      };
      deleteItemRecursive(scenefile);
      dispatch({ type: "LOAD_FILE", scenefile: scenefile });
      setSelected(undefined);
    },
    [scenefile],
  );

  const translateGroup = useCallback(
    (translate: number[]) => {
      if (!selected || selected.type !== "group") return;
      dispatch({
        type: "TRANSLATE_GROUP",
        group: selected.item,
        translate: translate,
      });
    },
    [selected],
  );

  const setGroupTranslate = useCallback(
    (translate: number[]) => {
      if (!selected || selected.type !== "group") return;
      dispatch({
        type: "SET_GROUP_TRANSLATE",
        group: selected.item,
        translate: translate,
      });
    },
    [selected],
  );

  const setGroupName = useCallback(
    (name: string) => {
      if (!selected || selected.type !== "group") return;
      dispatch({
        type: "SET_GROUP_NAME",
        group: selected.item,
        name: name,
      });
    },
    [selected],
  );

  const setCameraPosition = useCallback(
    (translate: number[]) => {
      if (!selected || selected.type !== "camera") return;
      dispatch({
        type: "SET_CAMERA_TRANSLATE",
        camera: selected.item,
        translate: translate,
      });
    },
    [selected],
  );

  const setCameraLook = useCallback(
    (look?: number[]) => {
      if (!selected || selected.type !== "camera") return;
      dispatch({
        type: "SET_CAMERA_LOOK",
        camera: selected.item,
        look: look,
      });
    },
    [selected],
  );

  const setCameraFocus = useCallback(
    (focus?: number[]) => {
      if (!selected || selected.type !== "camera") return;
      dispatch({
        type: "SET_CAMERA_FOCUS",
        camera: selected.item,
        focus: focus,
      });
    },
    [selected],
  );

  const setCameraUp = useCallback(
    (up: number[]) => {
      if (!selected || selected.type !== "camera") return;
      dispatch({
        type: "SET_CAMERA_UP",
        camera: selected.item,
        up: up,
      });
    },
    [selected],
  );

  const setCameraHeightAngle = useCallback(
    (value: number) => {
      if (!selected || selected.type !== "camera") return;
      dispatch({
        type: "SET_CAMERA_HEIGHT_ANGLE",
        camera: selected.item,
        value: value,
      });
    },
    [selected],
  );

  const setCameraProperty = useCallback(
    (property: CameraProperty, value: GenericProperty) => {
      if (!selected || selected.type !== "camera") return;
      dispatch({
        type: "SET_CAMERA_PROPERTY",
        camera: selected.item,
        property: property,
        value: value,
      });
    },
    [selected],
  );

  const rotateGroup = useCallback(
    (rotate: number[]) => {
      if (!selected || selected.type !== "group") return;
      dispatch({ type: "ROTATE_GROUP", group: selected.item, rotate: rotate });
    },
    [selected],
  );

  const setGroupRotate = useCallback(
    (rotate: number[]) => {
      if (!selected || selected.type !== "group") return;
      dispatch({
        type: "SET_GROUP_ROTATE",
        group: selected.item,
        rotate: rotate,
      });
    },
    [selected],
  );

  const setGroupScale = useCallback(
    (scale: number[]) => {
      if (!selected || selected.type !== "group") return;
      dispatch({
        type: "SET_GROUP_SCALE",
        group: selected.item,
        scale: scale,
      });
    },
    [selected],
  );

  const setPrimitiveProperty = useCallback(
    (property: PrimitiveProperty, value: GenericProperty) => {
      if (!selected || selected.type !== "primitive") return;
      dispatch({
        type: "SET_PRIMITIVE_PROPERTY",
        primitive: selected.item,
        property: property,
        value: value,
      });
    },
    [selected],
  );

  const setLightName = useCallback(
    (name: string) => {
      if (!selected || selected.type !== "light") return;
      dispatch({
        type: "SET_LIGHT_NAME",
        light: selected.item,
        name: name,
      });
    },
    [selected],
  );

  const setLightProperty = useCallback(
    (property: LightProperty, value: GenericProperty) => {
      if (!selected || selected.type !== "light") return;
      dispatch({
        type: "SET_LIGHT_PROPERTY",
        light: selected.item,
        property: property,
        value: value,
      });
    },
    [selected],
  );

  const setGlobalDataProperty = useCallback(
    (property: GlobalDataProperty, value: GenericProperty) => {
      if (!selected || selected.type !== "scene") return;
      dispatch({
        type: "SET_GLOBAL_DATA_PROPERTY",
        globalData: selected.item.globalData,
        property: property,
        value: value,
      });
    },
    [selected],
  );

  const setAddPrimitive = useCallback(
    (primitive: string) => {
      if (!selected || selected.type !== "group") return;
      if (!selected.item.primitives) selected.item.primitives = [];
      switch (primitive) {
        case "mesh":
          selected.item.primitives.push({
            type: "mesh",
            meshFile: "meshes/monkey.obj",
            id: Math.random().toString(),
          });
          break;
        default:
          selected.item.primitives.push({
            type: primitive as PrimitiveTypeNames,
            diffuse: [1, 1, 1],
            specular: [1, 1, 1],
            ambient: [0.5, 0.5, 0.5],
            shininess: 1,
            id: Math.random().toString(),
          });
      }
      dispatch({ type: "LOAD_FILE", scenefile: scenefile });
    },
    [selected, scenefile],
  );

  const setAddLight = useCallback(
    (light: string) => {
      if (!selected || selected.type !== "group") return;
      if (!selected.item.lights) selected.item.lights = [];
      switch (light) {
        case "point":
          selected.item.lights.push({
            type: "point",
            color: [1, 1, 1],
            attenuationCoeff: [0, 0, 0],
            id: Math.random().toString(),
          });
          break;
        case "directional":
          selected.item.lights.push({
            type: "directional",
            color: [1, 1, 1],
            direction: [1, 1, 1],
            id: Math.random().toString(),
          });
          break;
        case "spot":
          selected.item.lights.push({
            type: "spot",
            color: [1, 1, 1],
            id: Math.random().toString(),
            direction: [1, 1, 1],
            penumbra: 1,
            angle: 10,
            attenuationCoeff: [1, 0, 0],
          });
          break;
      }
      dispatch({ type: "LOAD_FILE", scenefile: scenefile });
    },
    [selected, scenefile],
  );

  const setAddGroup = useCallback(() => {
    if (!selected) return;
    if (selected.type == "group" || selected.type == "scene") {
      if (!selected.item.groups) selected.item.groups = [];
      selected.item.groups.unshift({
        id: Math.random().toString(),
        name: undefined,
        translate: [0, 0, 0],
        rotate: [0, 1, 0, 0],
        scale: [1, 1, 1],
      });
      dispatch({ type: "LOAD_FILE", scenefile: scenefile });
    }
  }, [selected, scenefile]);

  return (
    <ScenefileContext.Provider
      value={{
        scenefile,
        scenefilePath,
        originalScenefile,
        scenefileHasChanged,
        lights,
        templateGroupMap,
        select,
        toggleSelect,
        selected,
        loadFile,
        setSceneName,
        updateGlobalData,
        deleteItem,
        translateGroup,
        setGroupTranslate,
        setGroupName,
        rotateGroup,
        setGroupRotate,
        setGroupScale,
        setPrimitiveProperty,
        setLightName,
        setLightProperty,
        setGlobalDataProperty,
        setCameraPosition,
        setCameraLook,
        setCameraFocus,
        setCameraUp,
        setCameraHeightAngle,
        setCameraProperty,
        setAddPrimitive,
        setAddLight,
        setAddGroup,
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
    case "SET_SCENE_NAME":
      console.log("setting scene name", action.name);
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
    case "SET_GROUP_NAME": {
      if (action.group && action.name) {
        action.group.name = action.name;
      }
      return {
        ...state,
      };
    }
    case "ROTATE_GROUP": {
      if (action.rotate.length === 4) {
        if (!action.group.rotate) action.group.rotate = [0, 0, 0, 1];
        action.group.rotate[0] += action.rotate[0];
        action.group.rotate[1] += action.rotate[1];
        action.group.rotate[2] += action.rotate[2];
        action.group.rotate[3] += action.rotate[3];
      }
      return {
        ...state,
      };
    }
    case "SET_GROUP_ROTATE": {
      if (action.group && action.rotate.length === 4) {
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
    case "SET_CAMERA_TRANSLATE": {
      if (action.camera && action.translate.length === 3) {
        action.camera.position = action.translate;
      }
      return {
        ...state,
      };
    }
    case "SET_CAMERA_LOOK": {
      if (action.camera && action.look?.length === 3) {
        action.camera.look = action.look;
        action.camera.focus = undefined;
      }
      return {
        ...state,
      };
    }
    case "SET_CAMERA_FOCUS": {
      if (action.camera && action.focus?.length === 3) {
        action.camera.focus = action.focus;
        action.camera.look = undefined;
      }
      return {
        ...state,
      };
    }
    case "SET_CAMERA_UP": {
      if (action.camera && action.up.length === 3) {
        action.camera.up = action.up;
      }
      return {
        ...state,
      };
    }
    case "SET_CAMERA_HEIGHT_ANGLE": {
      if (action.camera && typeof action.value === "number") {
        action.camera.heightAngle = action.value;
      }
      return {
        ...state,
      };
    }
    case "SET_CAMERA_PROPERTY": {
      if (action.camera) {
        (action.camera as any)[action.property] = action.value;
      }
      return {
        ...state,
      };
    }
    case "SET_PRIMITIVE_PROPERTY": {
      if (action.primitive) {
        (action.primitive as any)[action.property] = action.value;
      }
      return {
        ...state,
      };
    }
    case "SET_LIGHT_NAME": {
      if (action.light) {
        action.light.name = action.name;
      }
      return {
        ...state,
      };
    }
    case "SET_LIGHT_PROPERTY": {
      if (action.light) {
        (action.light as any)[action.property] = action.value;
      }
      return {
        ...state,
      };
    }
    case "SET_GLOBAL_DATA_PROPERTY": {
      if (
        action.globalData &&
        action.property in action.globalData &&
        typeof action.value === "number"
      ) {
        action.globalData[action.property] = action.value;
      }
      return {
        ...state,
      };
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

type SetSceneNameAction = {
  type: "SET_SCENE_NAME";
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

type setGroupNameAction = {
  type: "SET_GROUP_NAME";
  group: Group;
  name: string;
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

type SetCameraTranslateAction = {
  type: "SET_CAMERA_TRANSLATE";
  camera: CameraData;
  translate: number[];
};

type SetCameraLookAction = {
  type: "SET_CAMERA_LOOK";
  camera: CameraData;
  look?: number[];
};

type SetCameraFocusAction = {
  type: "SET_CAMERA_FOCUS";
  camera: CameraData;
  focus?: number[];
};

type SetCameraUpAction = {
  type: "SET_CAMERA_UP";
  camera: CameraData;
  up: number[];
};

type SetCameraHeightAngleAction = {
  type: "SET_CAMERA_HEIGHT_ANGLE";
  camera: CameraData;
  value: number;
};

type SetCameraPropertyAction = {
  type: "SET_CAMERA_PROPERTY";
  camera: CameraData;
  property: CameraProperty;
  value: GenericProperty;
};

type SetPrimitivePropertyAction = {
  type: "SET_PRIMITIVE_PROPERTY";
  primitive: Primitive;
  property: PrimitiveProperty;
  value: GenericProperty;
};

type SetLightNameAction = {
  type: "SET_LIGHT_NAME";
  light: Light;
  name: string;
};

type SetLightPropertyAction = {
  type: "SET_LIGHT_PROPERTY";
  light: Light;
  property: LightProperty;
  value: GenericProperty;
};

type SetGlobalDataPropertyAction = {
  type: "SET_GLOBAL_DATA_PROPERTY";
  globalData: GlobalData;
  property: GlobalDataProperty;
  value: GenericProperty;
};

type ScenefileAction =
  | LoadFileAction
  | SetSceneNameAction
  | UpdateGlobalDataAction
  | TranslateGroupAction
  | SetGroupTranslateAction
  | setGroupNameAction
  | RotateGroupAction
  | SetGroupRotateAction
  | SetGroupScaleAction
  | SetCameraTranslateAction
  | SetCameraLookAction
  | SetCameraFocusAction
  | SetCameraUpAction
  | SetCameraHeightAngleAction
  | SetCameraPropertyAction
  | SetPrimitivePropertyAction
  | SetLightNameAction
  | SetLightPropertyAction
  | SetGlobalDataPropertyAction;

export default useScenefile;
