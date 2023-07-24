import { AccordionContent, AccordionItem } from "@/components/ui/accordion";
import useScenefile from "@/hooks/useScenefile";
import { cn } from "@/lib/cn";
import { Group, Light, Primitive } from "@/types/Scenefile";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
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
import { forwardRef } from "react";

const itemStyle = "border-none";
const triggerStyle = "pt-0 pb-1";
const contentStyle =
  "pl-6 data-[state=closed]:animate-none data-[state=open]:animate-none";

export default function Outline() {
  const { scenefile } = useScenefile();

  return (
    <AccordionItem value="root" className={itemStyle}>
      <AccordionTrigger className={cn(triggerStyle)}>
        <span className={scenefile.name ? "" : "text-slate-500"}>
          {scenefile.name ?? "Untitled Scene"}
        </span>
      </AccordionTrigger>
      <AccordionContent className={contentStyle}>
        {scenefile.groups?.map((group) => (
          <OutlineGroup key={group.id} {...group} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

const OutlineItemTemplate = <T extends { id: string }>({
  fallbackTitle,
  showTrigger,
  titleStyle,
}: {
  fallbackTitle?: string;
  showTrigger?: boolean;
  titleStyle?: string;
}) => {
  function OutlineItem({
    item,
    title,
    icon,
    action,
    children,
  }: {
    item: T;
    title?: string;
    icon?: React.ReactNode;
    action?: () => void;
    children?: React.ReactNode;
  }) {
    return (
      <AccordionItem value={item.id} className={itemStyle}>
        <AccordionTrigger
          className={cn(triggerStyle, showTrigger ? "" : "hidden")}
          disabled={!showTrigger}
          hidden={!showTrigger}
        >
          <div className="flex items-center gap-2" onClick={action}>
            {icon}
            <span className={cn(title ? "" : "opacity-50", titleStyle)}>
              {title ?? fallbackTitle}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className={contentStyle}>{children}</AccordionContent>
      </AccordionItem>
    );
  }
  return OutlineItem;
};

const OutlineGroup = (group: Group) => {
  const OutlineGroupTemplate = OutlineItemTemplate<Group>({
    fallbackTitle: "Untitled Group",
    showTrigger: true,
  });
  return (
    <OutlineGroupTemplate key={group.id} item={group} title={group.name}>
      {group.lights?.map((light) => (
        <OutlineLight
          key={light.id}
          item={light}
          title={displayNames[light.type]}
          icon={lightIcons[light.type]}
        />
      ))}
      {group.primitives?.map((primitive) => (
        <OutlinePrimitive
          key={primitive.id}
          item={primitive}
          title={displayNames[primitive.type]}
          icon={primitiveIcons[primitive.type]}
        />
      ))}
      {group.groups?.map((group) => OutlineGroup(group))}
    </OutlineGroupTemplate>
  );
};

const lightIcons = {
  point: <IconSunHigh size={16} color="gold" />,
  directional: <IconArrowsDown size={16} color="gold" />,
  spot: <IconLamp2 size={16} color="gold" />,
};

const primitiveIcons = {
  cube: <IconCube size={16} color="orange" />,
  sphere: <IconSphere size={16} color="orange" />,
  cone: <IconCone size={16} color="orange" />,
  cylinder: <IconCylinder size={16} color="orange" />,
  mesh: <IconTriangles size={16} color="orange" />,
};

const OutlinePrimitive = OutlineItemTemplate<Primitive>({
  fallbackTitle: "Untitled Primitive",
  showTrigger: false,
  titleStyle: "font-normal text-slate-500",
});

const OutlineLight = OutlineItemTemplate<Light>({
  fallbackTitle: "Untitled Light",
  showTrigger: false,
  titleStyle: "font-normal text-slate-500",
});

const displayNames = {
  cube: "Cube",
  sphere: "Sphere",
  cylinder: "Cylinder",
  cone: "Cone",
  mesh: "Mesh",
  point: "Point Light",
  spot: "Spot Light",
  directional: "Directional Light",
};

const AccordionTrigger = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex items-center py-2 gap-2 text-sm font-medium cursor-pointer">
    <AccordionPrimitive.Trigger
      ref={ref}
      aria-label="Toggle accordion"
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
