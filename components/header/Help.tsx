"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Help() {
  return (
    <TooltipProvider>
      <Tooltip>
        <Link
          className="flex items-center"
          href="https://cs1230.graphics/docs/scenes-tutorial"
          target="_blank"
        >
          <TooltipTrigger>
            <InformationCircleIcon className="h-6 w-6 text-slate-300" />
          </TooltipTrigger>
        </Link>
        <TooltipContent side="bottom" collisionPadding={{ left: 40 }}>
          How to use Scenes
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
