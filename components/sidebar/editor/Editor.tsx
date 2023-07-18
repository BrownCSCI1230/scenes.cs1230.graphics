import { Button } from "@/components/ui/button";
import useScenefile from "@/hooks/useScenefile";

export default function Editor() {
  const { selected, translateGroup, setGroupTranslate } = useScenefile();

  return (
    <div className="flex flex-col gap-2">
      {selected?.type === "group" && (
        <>
          <Button variant="outline" onClick={() => translateGroup([1, 0, 0])}>
            Translate group by [1, 0, 0]
          </Button>
          <Button
            variant="outline"
            onClick={() => setGroupTranslate([-1, 0, 0])}
          >
            Set group translate to [-1, 0, 0]
          </Button>
        </>
      )}
    </div>
  );
}
