import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useCamera from "@/hooks/useCamera";
import useScenefile from "@/hooks/useScenefile";
import { focusToLook } from "@/lib/cameraUtils";
import { useEffect, useState } from "react";
import EditorSection from "../components/EditorSection";
import SingleInput from "../components/SingleInput";

export default function CameraEditor() {
  const {
    selected,
    setCameraPosition,
    setCameraLook,
    setCameraFocus,
    setCameraUp,
    setCameraHeightAngle,
  } = useScenefile();

  const { updateViewport, lookUpFromViewport, perspectiveCamera } = useCamera();

  const camera = selected?.type === "camera" ? selected?.item : undefined;

  const [orientationMode, setOrientationMode] = useState<"look" | "focus">(
    selected?.type === "camera"
      ? selected.item.look !== undefined
        ? "look"
        : "focus"
      : "look",
  );
  const [look, setLook] = useState(camera?.look ?? [0, 0, 0]);
  const [focus, setFocus] = useState(camera?.focus ?? [0, 0, 0]);

  const orientationVector = orientationMode === "look" ? look : focus;
  const setOrientationVector = orientationMode === "look" ? setLook : setFocus;

  useEffect(() => {
    if (orientationMode === "look") {
      setCameraLook(orientationVector);
    } else {
      setCameraFocus(orientationVector);
    }
  }, [orientationMode, orientationVector, setCameraLook, setCameraFocus]);

  if (selected?.type !== "camera" || !camera) return null;

  return (
    <>
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => {
                  updateViewport(
                    camera.position,
                    camera.look ?? focusToLook(camera.focus, camera.position),
                    camera.up,
                  );
                }}
              >
                Reset viewport
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[18em] text-center">
              <p>Reset the viewport to match the view of the scene camera</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="flex-1"
                variant="default"
                onClick={() => {
                  const [look, up] = lookUpFromViewport();
                  setCameraPosition(
                    perspectiveCamera?.current?.position.toArray() ?? [0, 0, 0],
                  );
                  setOrientationMode("look");
                  setLook(look);
                  setCameraUp(up);
                }}
              >
                Save view
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[18em] text-center">
              <p>Save the current view of the viewport to the scene camera</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <EditorSection label="Position">
        <SingleInput
          label="X"
          value={camera.position[0]}
          step={0.001}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (isNaN(value)) return;
            setCameraPosition([value, camera.position[1], camera.position[2]]);
          }}
        />
        <SingleInput
          label="Y"
          value={camera.position[1]}
          step={0.001}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (isNaN(value)) return;
            setCameraPosition([camera.position[0], value, camera.position[2]]);
          }}
        />
        <SingleInput
          label="Z"
          value={camera.position[2]}
          step={0.001}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (isNaN(value)) return;
            setCameraPosition([camera.position[0], camera.position[1], value]);
          }}
        />
      </EditorSection>
      <EditorSection label="Orientation">
        <Tabs
          value={orientationMode}
          onValueChange={(value) =>
            setOrientationMode(
              value === "look" || value === "focus" ? value : "look",
            )
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="look">Look</TabsTrigger>
            <TabsTrigger value="focus">Focus</TabsTrigger>
          </TabsList>
        </Tabs>
        <SingleInput
          label="X"
          value={orientationVector[0]}
          step={0.001}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (isNaN(value)) return;
            setOrientationVector([
              value,
              orientationVector[1],
              orientationVector[2],
            ]);
          }}
        />
        <SingleInput
          label="Y"
          value={orientationVector[1]}
          step={0.001}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (isNaN(value)) return;
            setOrientationVector([
              orientationVector[0],
              value,
              orientationVector[2],
            ]);
          }}
        />
        <SingleInput
          label="Z"
          value={orientationVector[2]}
          step={0.001}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (isNaN(value)) return;
            setOrientationVector([
              orientationVector[0],
              orientationVector[1],
              value,
            ]);
          }}
        />
        <Separator />
        <SingleInput
          label="Up X"
          value={camera.up[0]}
          step={0.001}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (isNaN(value)) return;
            setCameraUp([value, camera.up[1], camera.up[2]]);
          }}
        />
        <SingleInput
          label="Up Y"
          value={camera.up[1]}
          step={0.001}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (isNaN(value)) return;
            setCameraUp([camera.up[0], value, camera.up[2]]);
          }}
        />
        <SingleInput
          label="Up Z"
          value={camera.up[2]}
          step={0.001}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (isNaN(value)) return;
            setCameraUp([camera.up[0], camera.up[1], value]);
          }}
        />
      </EditorSection>
      <EditorSection label="Height angle">
        <SingleInput
          value={camera.heightAngle}
          min={0}
          max={180}
          step={1}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (isNaN(value)) return;
            setCameraHeightAngle(value);
          }}
        />
      </EditorSection>
    </>
  );
}
