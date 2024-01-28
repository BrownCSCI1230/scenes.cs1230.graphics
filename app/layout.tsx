import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ScenefileProvider>
            <CameraProvider>{children}</CameraProvider>
          </ScenefileProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
