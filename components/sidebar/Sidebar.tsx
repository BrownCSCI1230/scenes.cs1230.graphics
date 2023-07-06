"use client";

import useScenefile from "@/hooks/useScenefile";

export default function Sidebar() {
  const { scenefile } = useScenefile();
  return (
    <aside className="flex basis-96">
      <pre>{JSON.stringify(scenefile, null, 2)}</pre>
    </aside>
  );
}
