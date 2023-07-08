"use client";

import Outline from "./outline/Outline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/sidebar-accordion";
import SceneJSON from "./json/SceneJSON";
import Editor from "./editor/Editor";

export default function Sidebar() {
  return (
    <aside className="flex flex-col basis-96 h-full">
      <Accordion
        type="multiple"
        className="flex flex-col flex-auto gap-2 h-full"
        defaultValue={["outline"]}
      >
        <AccordionItem value="outline">
          <AccordionTrigger className="pt-0 pb-1">Outline</AccordionTrigger>
          <AccordionContent className="pl-2">
            <Outline />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="editor">
          <AccordionTrigger className="pt-0 pb-1">Editor</AccordionTrigger>
          <AccordionContent className="pl-2">
            <Editor />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="json">
          <AccordionTrigger className="pt-0 pb-1">JSON</AccordionTrigger>
          <AccordionContent className="pl-2">
            <SceneJSON />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
