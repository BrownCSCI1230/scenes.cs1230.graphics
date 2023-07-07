"use client";

import Outline from "./outline/Outline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function Sidebar() {
  return (
    <aside className="flex basis-96">
      <Accordion type="multiple" className="flex flex-col flex-1 gap-2">
        <AccordionItem value="outline">
          <AccordionTrigger className="pt-0 pb-1">Outline</AccordionTrigger>
          <AccordionContent>
            <Outline />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="editor">
          <AccordionTrigger className="pt-0 pb-1">Editor</AccordionTrigger>
          <AccordionContent>Editor</AccordionContent>
        </AccordionItem>
        <AccordionItem value="json">
          <AccordionTrigger className="pt-0 pb-1">JSON</AccordionTrigger>
          <AccordionContent>JSON</AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
