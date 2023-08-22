import useScenefile from "@/hooks/useScenefile";

export default function CameraEditor() {
  const { selected } = useScenefile();

  if (selected?.type !== "camera") return null;

  return (
    <>
      <p>TODO: put in info and edit controls</p>
    </>
  );
}
