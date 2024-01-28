import { Logo } from "@/components/header/Logo";
import { HeaderControls } from "@/components/header/controls/HeaderControls";

export const Header = () => {
  return (
    <header className="flex flex-shrink-0 basis-16 items-center justify-between px-8">
      <Logo />
      <HeaderControls />
    </header>
  );
};
