import { Button } from "@/components/ui/button";
import useScenefile from "@/hooks/useScenefile";

export default function Editor() {
  const { scenefile, select, translateGroup, setGroupTranslate } =
    useScenefile();

  // TODO: remove all of this since it's just for demonstration purposes
  // select the first group by default
  const selected = scenefile.groups?.[0]?.id;

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" onClick={() => select(selected || "")}>
        Select cube (load cube.json first)
      </Button>
      <Button variant="outline" onClick={() => translateGroup([1, 0, 0])}>
        Translate group by [1, 0, 0]
      </Button>
      <Button variant="outline" onClick={() => setGroupTranslate([-1, 0, 0])}>
        Set group translate to [-1, 0, 0]
      </Button>
    </div>
  );
}
