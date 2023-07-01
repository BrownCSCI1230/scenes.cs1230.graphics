import Scene from "@/components/scene/Scene";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Home() {
  return (
    <main className="flex h-screen">
      <Scene />
      <Sidebar />
    </main>
  );
}
