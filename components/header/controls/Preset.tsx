"use client";

import { useScenefile } from "@/hooks/useScenefile";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
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
import { useState } from "react";

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
  const [key, setKey] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);

  const [selected, setSelected] = useState<keyof typeof examples>();

  return (
    <>
      <AlertDialog open={alertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSelected(undefined);
                setAlertOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (selected === undefined) return;
                const scenefile = await ScenefileSchema.parseAsync(
                  examples[selected],
                );
                setScenefile(scenefile);
                setKey((key) => key + 1);
                setSelected(undefined);
                setAlertOpen(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Select
        key={key}
        onValueChange={async (name) => {
          if (!isExampleName(name)) return;
          setAlertOpen(true);
          setSelected(name);
        }}
      >
        <SelectTrigger className="w-[180px]" aria-label="Load preset">
          Choose a preset...
        </SelectTrigger>
        <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
          {Object.entries(examples).map((example) => (
            <SelectItem key={example[0]} value={example[0]}>
              {example[0]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
