import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import useScenefile from "@/hooks/useScenefile";
import { cn } from "@/lib/utils";
import { Group } from "@/types/Scenefile";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import * as React from "react";

const itemStyle = "border-none";
const triggerStyle = "pt-0 pb-1";
const contentStyle =
  "pl-5 data-[state=closed]:animate-none data-[state=open]:animate-none";

export default function Outline() {
  const { scenefile } = useScenefile();

  return (
    <Accordion
      type="multiple"
      className="flex flex-col flex-auto gap-2 h-full"
      defaultValue={["root"]}
    >
      <AccordionItem value="root" className={itemStyle}>
        <AccordionTrigger className={triggerStyle}>
          {scenefile.name ?? "Untitled Scene"}
        </AccordionTrigger>
        <AccordionContent className={contentStyle}>
          {scenefile.groups?.map((group) => (
            <OutlineGroup key={group.id} group={group} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

const OutlineGroup = ({ group }: { group: Group }) => {
  console.log("render");
  return (
    <AccordionItem value={group.id} className={itemStyle}>
      <AccordionTrigger className={triggerStyle}>{group.name}</AccordionTrigger>
      <AccordionContent className={contentStyle}>
        {group.groups?.map((group) => (
          <OutlineGroup key={group.id} group={group} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

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
