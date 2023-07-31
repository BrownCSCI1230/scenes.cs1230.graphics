import useScenefile from "@/hooks/useScenefile";
import { cn } from "@/lib/cn";
import { Group } from "@/types/Scenefile";
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
import OutlineItem, {
  OutlineItemContent,
  OutlineItemHeader,
} from "./OutlineItem";

export default function Outline() {
  const { select, selected, scenefile } = useScenefile();

  return (
    <OutlineScene
      title={scenefile.name}
      select={() => select({ type: "scene", item: scenefile })}
      selected={selected?.item === scenefile}
      depth={0}
    >
      {scenefile.groups?.map((group) => (
        <OutlineGroup key={group.id} group={group} depth={1} />
      ))}
    </OutlineScene>
  );
}

const SceneOutlineItemTemplate = ({
  fallbackTitle,
  initialOpen,
  showTrigger,
}: {
  fallbackTitle?: string;
  initialOpen?: boolean;
  showTrigger?: boolean;
}) =>
  function SceneOutlineItem({
    title,
    icon,
    select,
    selected,
    depth,
    children,
  }: {
    title?: string;
    icon?: React.ReactNode;
    select?: () => void;
    selected?: boolean;
    depth?: number;
    children?: React.ReactNode;
  }) {
    return (
      <OutlineItem
        select={select}
        showTrigger={showTrigger}
        selected={selected}
        initialOpen={initialOpen}
        depth={depth}
      >
        <OutlineItemHeader>
          {icon && <span>{icon}</span>}
          <span className={cn(title ? "" : "opacity-50")}>
            {title ?? fallbackTitle}
          </span>
        </OutlineItemHeader>
        <OutlineItemContent>{children}</OutlineItemContent>
      </OutlineItem>
    );
  };

const OutlineGroup = ({ group, depth }: { group: Group; depth?: number }) => {
  const { select, selected } = useScenefile();

  return (
    <OutlineGroupTemplate
      key={group.id}
      title={group.name}
      select={() => select({ type: "group", item: group })}
      selected={selected?.item === group}
      depth={depth}
    >
      {group.lights?.map((light) => (
        <OutlineLight
          key={light.id}
          title={displayNames[light.type]}
          icon={lightIcons[light.type]}
          select={() => select({ type: "light", item: light })}
          selected={selected?.item === light}
          depth={(depth ?? 0) + 1}
        />
      ))}
      {group.primitives?.map((primitive) => (
        <OutlinePrimitive
          key={primitive.id}
          title={displayNames[primitive.type]}
          icon={primitiveIcons[primitive.type]}
          select={() => select({ type: "primitive", item: primitive })}
          selected={selected?.item === primitive}
          depth={(depth ?? 0) + 1}
        />
      ))}
      {group.groups?.map((group) =>
        OutlineGroup({ group, depth: (depth ?? 0) + 1 })
      )}
    </OutlineGroupTemplate>
  );
};

const OutlineScene = SceneOutlineItemTemplate({
  fallbackTitle: "Untitled Scene",
  showTrigger: true,
  initialOpen: true,
});

const OutlineGroupTemplate = SceneOutlineItemTemplate({
  fallbackTitle: "Untitled Group",
  showTrigger: true,
  initialOpen: true,
});

const OutlinePrimitive = SceneOutlineItemTemplate({
  fallbackTitle: "Untitled Primitive",
  showTrigger: false,
});

const OutlineLight = SceneOutlineItemTemplate({
  fallbackTitle: "Untitled Light",
  showTrigger: false,
});

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
