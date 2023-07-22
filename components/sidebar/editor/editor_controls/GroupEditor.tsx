import { Button } from "@/components/ui/button";
import useScenefile from "@/hooks/useScenefile";
import assert from "assert";


export default function GroupEditor() {
  const { selected, translateGroup, setGroupTranslate } = useScenefile();
  assert(selected?.type === "group")

  let group = selected.item
  let translate = group.translate ? group.translate : [0, 0, 0]
  
  return (
    <>
      <p><b>{group.name}</b></p>
      <p><b>pos: </b>{`(${translate.join(",")})`}</p>
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
  )
}