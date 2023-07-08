import useScenefile from "@/hooks/useScenefile";

export default function SceneJSON() {
  const { scenefile } = useScenefile();

  return (
    <pre className="text-xs text-gray-300">
      {JSON.stringify(scenefile, null, 2)}
    </pre>
  );
}
