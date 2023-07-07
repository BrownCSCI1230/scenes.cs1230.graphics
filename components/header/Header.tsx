import Logo from "./Logo";
import Upload from "./Upload";

export default function Header() {
  return (
    <header className="flex flex-shrink-0 basis-16 justify-between shadow-md">
      <Logo />
      <Upload />
    </header>
  );
}
