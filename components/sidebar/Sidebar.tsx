"use client";

import Outline from "./outline/Outline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import SceneJSON from "./json/SceneJSON";
import Editor from "./editor/Editor";

const itemStyle =
  "flex flex-col overflow-auto flex-auto data-[state=closed]:flex-none";
const triggerStyle = "pt-0 pb-1 font-semibold hover:no-underline";
const contentStyle =
  "pl-2 flex-auto overflow-auto data-[state=closed]:animate-none data-[state=open]:animate-none";

export default function Sidebar() {
  return (
    <aside className="flex flex-col basis-96 h-full">
      <Accordion
        type="multiple"
        className="flex flex-col flex-auto gap-2 h-full"
        defaultValue={["outline"]}
      >
        <AccordionItem value="outline" className={itemStyle}>
          <AccordionTrigger className={triggerStyle}>OUTLINE</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <Outline />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="editor" className={itemStyle}>
          <AccordionTrigger className={triggerStyle}>EDITOR</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <Editor />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="json" className={itemStyle}>
          <AccordionTrigger className={triggerStyle}>JSON</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <SceneJSON />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
