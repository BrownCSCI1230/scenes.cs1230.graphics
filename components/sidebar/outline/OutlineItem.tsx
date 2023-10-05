"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu-custom";
import {
  ChevronDownIcon,
  PlusIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  IconArrowsDown,
  IconCone,
  IconCube,
  IconCylinder,
  IconLamp2,
  IconSphere,
  IconSunHigh,
  IconTriangles,
} from "@tabler/icons-react";

import useScenefile from "@/hooks/useScenefile";
import { cn } from "@/lib/cn";
import React, { forwardRef, useDeferredValue, useState } from "react";

interface OutlineItemProps extends React.ComponentPropsWithoutRef<"div"> {
  initialOpen?: boolean;
  showTrigger?: boolean;
  select?: () => void;
  selected?: boolean;
  depth?: number;
  deleteAction?: () => void;
}

const OutlineItem = forwardRef<HTMLDivElement, OutlineItemProps>(
  (
    {
      initialOpen,
      showTrigger,
      select,
      selected: selectedRaw,
      depth,
      deleteAction,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const selected = useDeferredValue(selectedRaw);
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

    const { setAddPrimitive, setAddLight, setAddGroup } = useScenefile();

    return (
      <div
        ref={ref}
        className={cn("flex select-none flex-col", className)}
        {...props}
      >
        <div
          className={cn(
            "header",
            "flex cursor-pointer items-center justify-between gap-2 px-2 hover:bg-orange-50",
            selected ? "bg-orange-200 hover:bg-orange-200" : "bg-transparent",
          )}
          style={{ paddingLeft: `${(depth ?? 0) + 0.5}rem` }}
          onClick={handleHeaderClick}
        >
          {showTrigger && (
            <ChevronDownIcon
              className={cn(
                "h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 dark:text-slate-400",
                isOpen ? "rotate-0" : "-rotate-90",
              )}
            />
          )}
          {header && (
            <div className="content flex flex-1 items-center gap-2 py-2">
              {header}
            </div>
          )}

          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <div className="flex items-center justify-center">
                <div className="">
                  {selected && deleteAction !== undefined && (
                    <div
                      className="ml-2 flex h-6 w-6 items-center justify-center rounded-sm hover:bg-orange-300"
                      onClick={deleteAction}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
                {showTrigger && selected && (
                  <DropdownMenuTrigger className="">
                    <div className="ml-2 flex h-6 w-6 items-center justify-center rounded-sm hover:bg-orange-300">
                      <PlusIcon className="h-4 w-4" />
                    </div>
                  </DropdownMenuTrigger>
                )}
              </div>
              <DropdownMenuContent align="end" sideOffset={5}>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="flex gap-2"
                    onSelect={() => {
                      setAddGroup();
                      select && select();
                    }}
                  >
                    <ShareIcon className="h-4 w-4 text-purple-500" />
                    Group
                  </DropdownMenuItem>
                  {depth !== 0 && (
                    <>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <span className="mr-8">Light</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              className="flex gap-2"
                              onClick={() => {
                                setAddLight("point");
                                select && select();
                              }}
                            >
                              <IconSunHigh size={16} color="gold" />
                              <span>Point</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex gap-2"
                              onClick={() => {
                                setAddLight("directional");
                                select && select();
                              }}
                            >
                              <IconArrowsDown size={16} color="gold" />
                              <span>Directional</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex gap-2"
                              onClick={() => {
                                setAddLight("spot");
                                select && select();
                              }}
                            >
                              <IconLamp2 size={16} color="gold" />
                              <span>Spot</span>
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <span className="mr-4">Primitive</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              className="flex gap-2"
                              onClick={() => {
                                setAddPrimitive("cube");
                                select && select();
                              }}
                            >
                              <IconCube size={16} color="orange" />
                              <span>Cube</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex gap-2"
                              onClick={() => {
                                setAddPrimitive("sphere");
                                select && select();
                              }}
                            >
                              <IconSphere size={16} color="orange" />
                              <span>Sphere</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex gap-2"
                              onClick={() => {
                                setAddPrimitive("cone");
                                select && select();
                              }}
                            >
                              <IconCone size={16} color="orange" />
                              <span>Cone</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex gap-2"
                              onClick={() => {
                                setAddPrimitive("cylinder");
                                select && select();
                              }}
                            >
                              <IconCylinder size={16} color="orange" />
                              <span>Cylinder</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex gap-2"
                              onClick={() => {
                                setAddPrimitive("mesh");
                                select && select();
                              }}
                            >
                              <IconTriangles size={16} color="orange" />
                              <span>Mesh</span>
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {content && isOpen && <div className={cn("flex-1")}>{content}</div>}
      </div>
    );
  },
);
OutlineItem.displayName = "OutlineItem";

export default OutlineItem;
export const OutlineItemHeader = React.Fragment;
export const OutlineItemContent = React.Fragment;
