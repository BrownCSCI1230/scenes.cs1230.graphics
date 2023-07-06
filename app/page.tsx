import Header from "@/components/header/Header";
import Scene from "@/components/scene/Scene";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex h-full">
        <Scene />
        <Sidebar />
      </div>
    </main>
  );
}
