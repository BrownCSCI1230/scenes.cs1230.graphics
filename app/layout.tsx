import { Toaster } from "@/components/ui/toaster";
import { ScenefileProvider } from "@/hooks/useScenefile";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Scene Viewer | CS1230",
  description: "Upload CS1230 scenefiles to view and edit them in the browser.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ScenefileProvider>{children}</ScenefileProvider>
        <Toaster />
      </body>
    </html>
  );
}
