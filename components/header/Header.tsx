import Logo from "./Logo";
import HeaderControls from "./controls/HeaderControls";

export default function Header() {
  return (
    <header className="flex flex-shrink-0 basis-16 items-center justify-between px-8">
      <Logo />
      <HeaderControls />
    </header>
  );
}
