"use client";

import Header from "@/components/header/Header";
import Scene from "@/components/scene/Scene";
import Sidebar from "@/components/sidebar/Sidebar";
import { Separator } from "@/components/ui/separator";
import { useExitWarning } from "@/hooks/useExitWarning";

export default function Home() {
  useExitWarning();
  return (
    <div className="flex h-screen max-h-screen flex-col overflow-hidden">
      <Header />
      <Separator />
      <main className="flex flex-grow gap-4 overflow-auto p-8 text-slate-700">
        <Scene />
        <Sidebar />
      </main>
    </div>
  );
}
