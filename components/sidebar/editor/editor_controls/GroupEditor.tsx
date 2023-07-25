import { Button } from "@/components/ui/button";
import useScenefile from "@/hooks/useScenefile";
import assert from "assert";
import TripleInput from "./TripleInput";


export default function GroupEditor() {
  const { selected, translateGroup, setGroupTranslate, setGroupRotate } = useScenefile();
  assert(selected?.type === "group")

  let group = selected.item
  let translate = group.translate ? group.translate : [0, 0, 0]
  let rotation = group.rotate ? group.rotate : [0, 0, 0]
  console.log(rotation)

  assert(translate.length === 3)

  return (
    <>
      <p><b>{group.name}</b></p>
      <TripleInput
        label="pos"
        x={translate[0]}
        y={translate[1]}
        z={translate[2]}
        onXChange={(value) => setGroupTranslate([value, translate[1], translate[2]])}
        onYChange={(value) => setGroupTranslate([translate[0], value, translate[2]])}
        onZChange={(value) => setGroupTranslate([translate[0], translate[1], value])}
      />
      {/* <TripleInput
        label="rot"
        x={rotation[0]}
        y={rotation[1]}
        z={rotation[2]}
        onXChange={(value) => setGroupRotate([value, rotation[1], rotation[2]])}
        onYChange={(value) => setGroupRotate([rotation[0], value, rotation[2]])}
        onZChange={(value) => setGroupRotate([rotation[0], rotation[1], value])}
      /> */}
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