import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import useScenefile from "@/hooks/useScenefile";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import * as React from "react";

const itemStyle = "border-none";
const triggerStyle = "pt-0 pb-1";
const contentStyle = "pl-2";

export default function Outline() {
  const { scenefile } = useScenefile();

  return (
    <Accordion
      type="multiple"
      className="flex flex-col flex-auto gap-2 h-full"
      defaultValue={["outline"]}
    >
      <AccordionItem value="outline" className={itemStyle}>
        <AccordionTrigger className={triggerStyle}>
          {scenefile.name ?? "Untitled Scene"}
        </AccordionTrigger>
        <AccordionContent className={contentStyle}></AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex items-center py-2 gap-2 text-sm font-medium">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-initial !pb-0 transition-all hover:underline [&[data-state=closed]>svg]:-rotate-90 [&[data-state=open]>svg]:rotate-0",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 dark:text-slate-400" />
    </AccordionPrimitive.Trigger>
    {children}
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
