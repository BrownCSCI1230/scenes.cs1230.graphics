import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";
import { useId } from "react";
import DraggableInput, { DraggableInputProps } from "./DraggableInput";

interface SingleInputProps extends DraggableInputProps {
  label?: string;
}

export default function SingleInput({
  label,
  className,
  ...props
}: SingleInputProps) {
  const id = useId();
  return (
    <div className="flex items-center justify-end">
      {label !== undefined && (
        <Label className="mr-2" htmlFor={id}>
          {label}
        </Label>
      )}
      <DraggableInput
        {...props}
        id={id}
        className={cn("w-auto max-w-[4rem] bg-white", className)}
      />
    </div>
  );
}
