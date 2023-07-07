import Header from "@/components/header/Header";
import Scene from "@/components/scene/Scene";
import Sidebar from "@/components/sidebar/Sidebar";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <Header />
      <Separator />
      <div className="flex h-full p-8 gap-4">
        <Scene />
        <Sidebar />
      </div>
    </main>
  );
}
