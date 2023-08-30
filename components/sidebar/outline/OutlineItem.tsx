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
import { ChevronDownIcon, PlusIcon, Share1Icon } from "@radix-ui/react-icons";
import React, { forwardRef, useState } from "react";

interface OutlineItemProps extends React.ComponentPropsWithoutRef<"div"> {
  initialOpen?: boolean;
  showTrigger?: boolean;
  select?: () => void;
  selected?: boolean;
  depth?: number;
}

const OutlineItem = forwardRef<HTMLDivElement, OutlineItemProps>(
  ({ initialOpen, showTrigger, select, selected, depth, className, children, ...props }, ref) => {
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

    const { setAddPrimitive, setAddGroup } = useScenefile();

    return (
      <div ref={ref} className={cn("flex flex-col select-none", className)} {...props}>
        <div
          className={cn(
            "header",
            "flex items-center justify-between gap-2 cursor-pointer px-2 hover:bg-orange-50",
            selected ? "bg-orange-200 hover:bg-orange-200" : "bg-transparent"
          )}
          style={{ paddingLeft: `${(depth ?? 0) + 0.5}rem` }}
          onClick={handleHeaderClick}>
          {showTrigger && (
            <ChevronDownIcon
              className={cn(
                "h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 dark:text-slate-400",
                isOpen ? "rotate-0" : "-rotate-90"
              )}
            />
          )}
          {header && <div className="content flex flex-1 items-center gap-2 py-2">{header}</div>}

          {showTrigger && selected && (
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger className="h-6 w-6 rounded-sm flex items-center justify-center hover:bg-orange-300">
                  <PlusIcon className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={5}>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onSelect={() => {
                        setAddGroup();
                        select && select();
                      }}>
                      <Share1Icon className="h-4 w-4 mr-2 text-purple-500" />
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
                              <DropdownMenuItem>
                                <IconSunHigh size={16} color="gold" className="mr-2" />
                                <span>Point</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <IconArrowsDown size={16} color="gold" className="mr-2" />
                                <span>Directional</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <IconLamp2 size={16} color="gold" className="mr-2" />
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
                                onClick={() => {
                                  setAddPrimitive("cube");
                                  select && select();
                                }}>
                                <IconCube size={16} color="orange" className="mr-2" />
                                <span>Cube</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setAddPrimitive("sphere");
                                  select && select();
                                }}>
                                <IconSphere size={16} color="orange" className="mr-2" />
                                <span>Sphere</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setAddPrimitive("cone");
                                  select && select();
                                }}>
                                <IconCone size={16} color="orange" className="mr-2" />
                                <span>Cone</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setAddPrimitive("cylinder");
                                  select && select();
                                }}>
                                <IconCylinder size={16} color="orange" className="mr-2" />
                                <span>Cylinder</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setAddPrimitive("mesh");
                                  select && select();
                                }}>
                                <IconTriangles size={16} color="orange" className="mr-2" />
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
