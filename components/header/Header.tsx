import Upload from "./Upload";

export default function Header() {
  return (
    <header className="flex flex-shrink-0 basis-16 justify-between shadow-md">
      <h1>CS1230 Scene Viewer</h1>
      <Upload />
    </header>
  );
}
