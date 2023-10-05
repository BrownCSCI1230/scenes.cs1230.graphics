"use client";

import useScenefile from "@/hooks/useScenefile";
import { cn } from "@/lib/cn";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Editor from "./editor/Editor";
import SceneJSON from "./json/SceneJSON";
import Outline from "./outline/Outline";

const itemStyle =
  "flex flex-col overflow-auto flex-auto data-[state=closed]:flex-none";
const triggerStyle = "pt-0 pb-1 font-semibold hover:no-underline";
const contentStyle =
  "flex-auto overflow-auto data-[state=closed]:animate-none data-[state=open]:animate-none";

export default function Sidebar() {
  const { scenefile } = useScenefile();

  return (
    <aside className="flex flex-col basis-80 flex-shrink-0 overflow-hidden h-full">
      <Accordion
        key={scenefile.id}
        type="multiple"
        className="flex flex-col flex-auto gap-2 h-full"
        defaultValue={["outline", "editor"]}
      >
        <AccordionItem value="outline" className={cn(itemStyle, "basis-1/2")}>
          <AccordionTrigger className={triggerStyle}>OUTLINE</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <Outline />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="editor" className={cn(itemStyle, "basis-1/2")}>
          <AccordionTrigger className={triggerStyle}>EDITOR</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <Editor />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="json" className={cn(itemStyle, "basis-full")}>
          <AccordionTrigger className={triggerStyle}>JSON</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <SceneJSON />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
