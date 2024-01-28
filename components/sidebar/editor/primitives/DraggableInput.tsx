import { Button } from "@/components/ui/button";
import { Input, InputProps } from "@/components/ui/input";
import { useEvent } from "@/hooks/useEvent";
import { useForwardedRef } from "@/hooks/useForwardedRef";
import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

export type DraggableInputProps = Omit<InputProps, "type">;

// Extends Input component to make it draggable and add buttons on the left and right
export const DraggableInput = forwardRef<HTMLInputElement, DraggableInputProps>(
  ({ className, ...props }, ref) => {
    const propsValue = typeof props.value === "number" ? props.value : 0;
    const [isMouseDown, setIsMouseDown] = useState(false);
    const prevX = useRef(0);
    const [initialY, setInitialY] = useState(0);
    const inputRef = useForwardedRef<HTMLInputElement>(ref);
    const input = inputRef.current;
    const emitChange = useEvent(inputRef, "input", () => {});
    const min = input?.min ? parseFloat(input.min) : Number.NEGATIVE_INFINITY;
    const max = input?.max ? parseFloat(input.max) : Number.POSITIVE_INFINITY;

    const updateValue = useCallback(
      (value: string) => {
        var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, String(value));
      },
      [input],
    );

    const onMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
      setIsMouseDown(true);
      prevX.current = e.clientX;
      setInitialY(e.clientY);
    };

    const onMouseMove = useCallback(
      (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isMouseDown) {
          const deltaX = e.clientX - prevX.current;
          const deltaY = e.clientY - initialY;
          const sensitivity = 1 / Math.exp(Math.abs(deltaY / 100));
          const steps = Math.round(deltaX * sensitivity);
          if (steps !== 0) {
            input?.stepUp(steps);
            prevX.current = e.clientX;
            emitChange();
          }
        }
      },
      [initialY, isMouseDown, input, emitChange, prevX],
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

    return (
      <div className="flex items-center justify-between">
        <Button
          className="rounded-r-none border-r-0"
          variant="outline"
          onClick={() => {
            input?.stepDown();
            emitChange();
          }}
          disabled={
            input ? input.value === input.min : props.value === props.min
          }
        >
          <MinusIcon />
        </Button>
        <Input
          ref={inputRef}
          {...props}
          type="number"
          className={cn(
            "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            "rounded-none",
            "cursor-ew-resize focus-visible:ring-0",
            className,
          )}
          onMouseDown={onMouseDown}
          onKeyDown={(e) => {
            if (input?.type) {
              input.type = "text";
            }
            let value = input?.value ?? "";
            const selectionStart = input?.selectionStart ?? 0;
            const selectionEnd = input?.selectionEnd ?? 0;
            const hasSelection = selectionStart !== selectionEnd;

            const isCtrlOrCmd = e.ctrlKey || e.metaKey;

            if (isCtrlOrCmd) {
              switch (e.key) {
                case "c": // Copy
                case "a": // Select All
                  return; // Do nothing and allow default behavior
                case "v": {
                  // Paste
                  e.preventDefault();

                  // Get clipboard data
                  navigator.clipboard.readText().then((clipText) => {
                    const validChars = "0123456789.-";
                    const pastedData = Array.from(clipText)
                      .filter((char) => validChars.includes(char))
                      .join("");

                    // Handle insertion of the pasted data
                    const newValue =
                      value.slice(0, selectionStart) +
                      pastedData +
                      value.slice(selectionEnd);

                    // Update the input value
                    updateValue(newValue);

                    // Adjust the cursor position
                    const newCaretPosition = selectionStart + pastedData.length;
                    input?.setSelectionRange(
                      newCaretPosition,
                      newCaretPosition,
                    );
                  });
                  return; // Exit early after handling paste
                }
                case "x": {
                  // Cut
                  e.preventDefault();

                  // Cut selected text
                  const cutData = value.slice(selectionStart, selectionEnd);
                  navigator.clipboard.writeText(cutData);

                  const newValue =
                    value.slice(0, selectionStart) + value.slice(selectionEnd);
                  updateValue(newValue);

                  // Adjust the cursor position
                  const newCaretPosition = selectionStart;
                  input?.setSelectionRange(newCaretPosition, newCaretPosition);
                  return; // Exit early after handling cut
                }
                default:
                  break; // Exit for other command combinations
              }
            }

            // For these keys, we want the default behavior
            if (
              [
                "ArrowLeft",
                "ArrowRight",
                "ArrowUp",
                "ArrowDown",
                "Home",
                "End",
                "Tab",
              ].includes(e.key)
            ) {
              return;
            }

            if (e.key === "Enter") {
              // Enter key
              e.preventDefault();
              input?.blur();
              return;
            }

            // If it's not one of the above keys, prevent default
            e.preventDefault();

            let newCaretPosition = selectionStart;

            if (e.key === "Backspace") {
              if (hasSelection) {
                value =
                  value.slice(0, selectionStart) + value.slice(selectionEnd);
                newCaretPosition = selectionStart;
              } else if (isCtrlOrCmd) {
                value = value.slice(selectionStart); // Delete everything before the caret
                newCaretPosition = 0;
              } else {
                value =
                  value.slice(0, selectionStart - 1) +
                  value.slice(selectionStart);
                newCaretPosition = selectionStart - 1;
              }
            } else if (e.key === "Delete") {
              if (hasSelection) {
                value =
                  value.slice(0, selectionStart) + value.slice(selectionEnd);
              } else if (isCtrlOrCmd) {
                value = value.slice(0, selectionStart); // Delete everything after the caret
                // Caret position remains the same
              } else {
                value =
                  value.slice(0, selectionStart) +
                  value.slice(selectionStart + 1);
                // Caret position remains the same after delete
              }
            } else if ("0123456789.-".includes(e.key)) {
              if (hasSelection) {
                value =
                  value.slice(0, selectionStart) +
                  e.key +
                  value.slice(selectionEnd);
                newCaretPosition = selectionStart + 1;
              } else {
                value =
                  value.slice(0, selectionStart) +
                  e.key +
                  value.slice(selectionStart);
                newCaretPosition = selectionStart + 1;
              }
            }
            updateValue(value);
            // Set the caret position
            requestAnimationFrame(() => {
              inputRef.current?.setSelectionRange(
                newCaretPosition,
                newCaretPosition,
              );
            });
          }}
          onBlur={() => {
            const value = input?.value;
            updateValue(String(niceParseFloat(value ?? "")));
            if (
              value !== undefined &&
              (niceParseFloat(value) < min || niceParseFloat(value) > max)
            ) {
              updateValue(String(propsValue));
            }
            emitChange();
            if (input?.type) {
              input.type = "number";
            }
          }}
          onClick={() => {
            if (input?.type) {
              input.type = "text";
              input?.setSelectionRange(0, input.value.length);
            }
          }}
        />
        <Button
          className="rounded-l-none border-l-0"
          variant="outline"
          onClick={() => {
            input?.stepUp();
            emitChange();
          }}
          disabled={
            input ? input.value === input.max : props.value === props.max
          }
        >
          <PlusIcon />
        </Button>
      </div>
    );
  },
);

DraggableInput.displayName = "DraggableInput";

const niceParseFloat = (value: string) => {
  if (value.startsWith(".")) {
    // add a zero to the beginning if the user is typing a decimal
    value = "0" + value;
  } else if (value.endsWith(".")) {
    // add a zero to the end if the user is typing a decimal
    value += "0";
  }
  return parseFloat(value);
};
