import { useEffect } from "react";
import useScenefile from "./useScenefile";

export const useExitWarning = () => {
  const { scenefileHasChanged } = useScenefile();
  useEffect(() => {
    const callback = (e: BeforeUnloadEvent) => {
      if (!scenefileHasChanged) return;
      e.preventDefault();
      e.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", callback);
    return () => window.removeEventListener("beforeunload", callback);
  }, [scenefileHasChanged]);
};
