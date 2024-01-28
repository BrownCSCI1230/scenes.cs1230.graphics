"use client";

import { Editor } from "@/components/sidebar/editor/Editor";
import { SceneJSON } from "@/components/sidebar/json/SceneJSON";
import { Outline } from "@/components/sidebar/outline/Outline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion-custom";
import { useScenefile } from "@/hooks/useScenefile";
import { cn } from "@/lib/utils";

const itemStyle =
  "flex flex-col overflow-auto flex-auto data-[state=closed]:flex-none";
const triggerStyle = "pt-0 pb-1 font-semibold hover:no-underline select-none";
const contentStyle =
  "flex-auto overflow-auto data-[state=closed]:animate-none data-[state=open]:animate-none";

export const Sidebar = () => {
  const { scenefile } = useScenefile();

  return (
    <aside className="flex h-full flex-shrink-0 basis-80 flex-col overflow-hidden">
      <Accordion
        key={scenefile.id}
        type="multiple"
        className="flex h-full flex-auto flex-col gap-2"
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
};
