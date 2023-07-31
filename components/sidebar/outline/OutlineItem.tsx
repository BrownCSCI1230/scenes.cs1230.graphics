"use client";

import { cn } from "@/lib/cn";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import React, { forwardRef, useState } from "react";

interface OutlineItemProps extends React.ComponentPropsWithoutRef<"div"> {
  initialOpen?: boolean;
  showTrigger?: boolean;
  select?: () => void;
  selected?: boolean;
  depth?: number;
}

const OutlineItem = forwardRef<HTMLDivElement, OutlineItemProps>(
  (
    {
      initialOpen,
      showTrigger,
      select,
      selected,
      depth,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(initialOpen ?? false);
    const childrenArray = React.Children.toArray(children);

    const header = childrenArray.length >= 1 ? childrenArray[0] : null;
    const content = childrenArray.length >= 2 ? childrenArray[1] : null;

    const handleHeaderClick = () => {
      console.log(depth);
      if (selected) {
        setIsOpen(!isOpen);
      }
      select && select();
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col select-none", className)}
        {...props}
      >
        <div
          className={cn(
            "header",
            "flex items-center justify-between gap-2 cursor-pointer px-2 hover:bg-orange-50",
            selected ? "bg-orange-200 hover:bg-orange-200" : "bg-transparent"
          )}
          style={{ paddingLeft: `${(depth ?? 0) + 0.5}rem` }}
          onClick={handleHeaderClick}
        >
          {showTrigger && (
            <ChevronDownIcon
              className={cn(
                "h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 dark:text-slate-400",
                isOpen ? "rotate-0" : "-rotate-90"
              )}
            />
          )}
          {header && (
            <div className="content flex flex-1 items-center gap-2 py-2">
              {header}
            </div>
          )}
        </div>
        {content && isOpen && <div className={cn("flex-1")}>{content}</div>}
      </div>
    );
  }
);
OutlineItem.displayName = "OutlineItem";

export default OutlineItem;
export const OutlineItemHeader = React.Fragment;
export const OutlineItemContent = React.Fragment;
