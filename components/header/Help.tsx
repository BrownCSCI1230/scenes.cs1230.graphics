"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Help() {

  return (
    <TooltipProvider>
      <Tooltip>
        <Link
          href="https://cs1230.graphics/docs/scenes-tutorial"
          target="_blank"
        >
          <TooltipTrigger>
            <QuestionMarkCircleIcon className="h-7 w-7 text-slate-300 pt-1.5"/>   
          </TooltipTrigger>
        </Link>
        <TooltipContent side="bottom" collisionPadding={{ left: 40 }}>
          How to use Scenes
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    
  )
}