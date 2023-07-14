"use client";

import Header from "@/components/header/Header";
import Scene from "@/components/scene/Scene";
import Sidebar from "@/components/sidebar/Sidebar";
import { Separator } from "@/components/ui/separator";
import { useExitWarning } from "@/hooks/useExitWarning";

export default function Home() {
  useExitWarning();
  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <Header />
      <Separator />
      <main className="flex flex-grow p-8 gap-4 overflow-auto text-slate-700">
        <Scene />
        <Sidebar />
      </main>
    </div>
  );
}
