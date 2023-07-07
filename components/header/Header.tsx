import Logo from "./Logo";
import HeaderControls from "./controls/HeaderControls";

export default function Header() {
  return (
    <header className="flex flex-shrink-0 basis-16 justify-between px-8 items-center">
      <Logo />
      <HeaderControls />
    </header>
  );
}
