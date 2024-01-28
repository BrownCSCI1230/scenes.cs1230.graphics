import { useScenefile } from "@/hooks/useScenefile";

export const SceneJSON = () => {
  const { scenefile } = useScenefile();

  return (
    <pre className="text-xs text-slate-700">
      {/* hide id fields */}
      {JSON.stringify(scenefile, null, 2).replace(/"id": "[^"]*",?/g, "")}
    </pre>
  );
};
