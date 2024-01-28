import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CameraProvider } from "@/hooks/useCamera";
import { ScenefileProvider } from "@/hooks/useScenefile";
import { Inter } from "next/font/google";

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
        <ScenefileProvider>
          <CameraProvider>{children}</CameraProvider>
        </ScenefileProvider>
        <Toaster />
      </body>
    </html>
  );
}
