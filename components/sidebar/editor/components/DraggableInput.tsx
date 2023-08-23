import { Button } from "@/components/ui/button";
import { Input, InputProps } from "@/components/ui/input";
import useEvent from "@/hooks/useEvent";
import { useForwardedRef } from "@/hooks/useForwardedRef";
import { cn } from "@/lib/cn";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { forwardRef, useCallback, useEffect, useState } from "react";

// Extends Input component to make it draggable and add buttons on the left and right
const DraggableInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, onChange, ...props }, ref) => {
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
    const [initialY, setInitialY] = useState<number>(0);
    const inputRef = useForwardedRef<HTMLInputElement>(ref);
    const emitChange = useEvent(inputRef, "change", () => {});

    const onMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
      setIsMouseDown(true);
      setInitialY(e.clientY);
    };

    const onMouseMove = useCallback(
      (e: MouseEvent) => {
        e.preventDefault();
        if (isMouseDown) {
          const deltaY = e.clientY - initialY;
          const resistance = 1 + Math.abs(deltaY) / 100;
          const increment = e.movementX / resistance;

          inputRef?.current?.stepUp(increment);
          emitChange();
        }
      },
      [initialY, isMouseDown, inputRef, emitChange]
    );

    const onMouseUp = () => {
      setIsMouseDown(false);
    };

    useEffect(() => {
      if (isMouseDown) {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      } else {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      }

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }, [isMouseDown, onMouseMove]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
    };

    return (
      <div className="flex justify-between items-center">
        <Button
          className="rounded-r-none border-r-0"
          variant="outline"
          onClick={() => {
            inputRef.current?.stepDown();
            emitChange();
          }}
          disabled={inputRef.current?.value === inputRef.current?.min}
        >
          <MinusIcon />
        </Button>
        <Input
          ref={inputRef}
          {...props}
          className={cn(
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            "rounded-none",
            "cursor-ew-resize",
            className
          )}
          onMouseDown={onMouseDown}
          onChange={onChange}
        />
        <Button
          className="rounded-l-none border-l-0"
          variant="outline"
          onClick={() => {
            inputRef.current?.stepUp();
            emitChange();
          }}
          disabled={inputRef.current?.value === inputRef.current?.max}
        >
          <PlusIcon />
        </Button>
      </div>
    );
  }
);
DraggableInput.displayName = "DraggableInput";

export default DraggableInput;
