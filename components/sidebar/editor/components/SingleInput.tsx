import { InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";
import { GenericProperty } from "@/types/Scenefile";
import { useId } from "react";
import DraggableInput from "./DraggableInput";

// a singleProperty is a GenericProperty without number[]
type SingleProperty = Exclude<GenericProperty, number[]>;

interface SingleInputProps extends InputProps {
  label: string;
  val: SingleProperty;
}

export default function SingleInput({
  label,
  val,
  className,
  ...props
}: SingleInputProps) {
  const id = useId();
  return (
    <div className="flex justify-end items-center">
      <Label className="mr-2" htmlFor={id}>
        {label}
      </Label>
      <DraggableInput
        {...props}
        id={id}
        className={cn("max-w-[4rem] w-auto", className)}
        type="number"
        value={val}
      />
    </div>
  );
}
