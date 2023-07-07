import Logo from "./Logo";
import Upload from "./Upload";

export default function Header() {
  return (
    <header className="flex flex-shrink-0 basis-16 justify-between px-8 items-center">
      <Logo />
      <Upload />
    </header>
  );
}
