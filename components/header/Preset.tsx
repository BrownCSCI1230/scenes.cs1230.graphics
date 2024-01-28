"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScenefile } from "@/hooks/useScenefile";

import chess from "@/examples/chess.json";
import cornell_box from "@/examples/cornell_box.json";
import defaultExample from "@/examples/default.json";
import phong_total from "@/examples/phong_total.json";
import point_light_1 from "@/examples/point_light_1.json";
import recursiveCones4 from "@/examples/recursiveCones4.json";
import recursiveCubes4 from "@/examples/recursiveCubes4.json";
import recursive_sphere_2 from "@/examples/recursive_sphere_2.json";
import recursive_sphere_3 from "@/examples/recursive_sphere_3.json";
import recursive_sphere_4 from "@/examples/recursive_sphere_4.json";
import spot_light_1 from "@/examples/spot_light_1.json";
import unit_cone from "@/examples/unit_cone.json";
import unit_cone_cap from "@/examples/unit_cone_cap.json";
import unit_cube from "@/examples/unit_cube.json";
import unit_cylinder from "@/examples/unit_cylinder.json";
import unit_sphere from "@/examples/unit_sphere.json";
import { ScenefileSchema } from "@/types/Scenefile";

const examples = {
  "default.json": defaultExample,
  "chess.json": chess,
  "cornell_box.json": cornell_box,
  "phong_total.json": phong_total,
  "point_light_1.json": point_light_1,
  "recursiveCones4.json": recursiveCones4,
  "recursiveCubes4.json": recursiveCubes4,
  "recursive_sphere_2.json": recursive_sphere_2,
  "recursive_sphere_3.json": recursive_sphere_3,
  "recursive_sphere_4.json": recursive_sphere_4,
  "spot_light_1.json": spot_light_1,
  "unit_cone.json": unit_cone,
  "unit_cone_cap.json": unit_cone_cap,
  "unit_cube.json": unit_cube,
  "unit_cylinder.json": unit_cylinder,
  "unit_sphere.json": unit_sphere,
} as const;

const isExampleName = (name: string): name is keyof typeof examples =>
  name in examples;

export const Preset = () => {
  const { setScenefile } = useScenefile();
  const { scenefilePath } = useScenefile();

  return (
    <Select
      onValueChange={async (name) => {
        if (!isExampleName(name)) return;
        const scenefile = await ScenefileSchema.parseAsync(examples[name]);
        setScenefile(scenefile);
      }}
    >
      <SelectTrigger className="w-[180px]" aria-label="Load preset">
        <SelectValue
          placeholder={scenefilePath ?? "No file loaded"}
          aria-label="Load preset"
        />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(examples).map((example) => (
          <SelectItem key={example[0]} value={example[0]}>
            {example[0]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
