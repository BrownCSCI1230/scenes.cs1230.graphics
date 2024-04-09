import {
  DraggableInput,
  DraggableInputProps,
} from "@/components/sidebar/editor/primitives/DraggableInput";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useId } from "react";

interface SingleInputProps extends DraggableInputProps {
  label?: string;
}

export const SingleInput = ({
  label,
  className,
  ...props
}: SingleInputProps) => {
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
        className={cn("w-auto max-w-[5rem]", className)}
      />
    </div>
  );
};
