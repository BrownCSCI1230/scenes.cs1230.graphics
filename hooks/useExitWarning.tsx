import { useEffect } from "react";
import useScenefile from "./useScenefile";

export const useExitWarning = () => {
  const { scenefile, originalScenefile } = useScenefile();
  // if scenefile not the same as originalScenefile, warn before closing tab
  useEffect(() => {
    const callback = (e: BeforeUnloadEvent) => {
      if (scenefile !== originalScenefile) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };
    window.addEventListener("beforeunload", callback);
    return () => window.removeEventListener("beforeunload", callback);
  }, [scenefile, originalScenefile]);
};
