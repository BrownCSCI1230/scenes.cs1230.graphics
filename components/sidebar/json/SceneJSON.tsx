import useScenefile from "@/hooks/useScenefile";

export default function SceneJSON() {
  const { scenefile } = useScenefile();

  return (
    <pre className="text-xs text-slate-700">
      {JSON.stringify(scenefile, null, 2)}
    </pre>
  );
}
