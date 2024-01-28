import { useScenefile } from "@/hooks/useScenefile";
import { useEffect } from "react";

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
