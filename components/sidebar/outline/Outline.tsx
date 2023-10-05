import useScenefile from "@/hooks/useScenefile";
import { cn } from "@/lib/cn";
import { Group } from "@/types/Scenefile";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  IconArrowsDown,
  IconCamera,
  IconCone,
  IconCube,
  IconCylinder,
  IconLamp2,
  IconRubberStamp,
  IconSphere,
  IconSunHigh,
  IconTriangles,
} from "@tabler/icons-react";
import OutlineItem, { OutlineItemContent, OutlineItemHeader } from "./OutlineItem";

export default function Outline() {
  const { select, selected, scenefile } = useScenefile();

  return (
    <OutlineScene
      title={scenefile.name}
      select={() => select({ type: "scene", item: scenefile })}
      selected={selected?.item === scenefile}
      depth={0}
    >
      <OutlineCamera
        title={"Camera"}
        icon={cameraIcon}
        select={() => select({ type: "camera", item: scenefile.cameraData })}
        selected={selected?.item === scenefile.cameraData}
        depth={1}
      />
      {scenefile.groups?.map((group) => (
        <OutlineGroup key={group.id} group={group} depth={1} />
      ))}
    </OutlineScene>
  );
}

const isATemplateGroupUser = (group: Group) =>
  group.name &&
  !group.translate &&
  !group.scale &&
  !group.rotate &&
  !group.groups &&
  !group.primitives &&
  !group.lights;

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
    deleteAction,
  }: {
    title?: string;
    icon?: React.ReactNode;
    select?: () => void;
    selected?: boolean;
    depth?: number;
    children?: React.ReactNode;
    deleteAction?: () => void;
  }) {
    return (
      <OutlineItem
        select={select}
        showTrigger={showTrigger}
        selected={selected}
        initialOpen={initialOpen}
        deleteAction={deleteAction}
        depth={depth}>
        <OutlineItemHeader>
          {icon && <span>{icon}</span>}
          <span className={cn(title ? "" : "opacity-50")}>{title || fallbackTitle}</span>
        </OutlineItemHeader>
        <OutlineItemContent>{children}</OutlineItemContent>
      </OutlineItem>
    );
  };

const OutlineGroup = ({ group, depth }: { group: Group; depth?: number }) => {
  const { select, selected, deleteItem } = useScenefile();
  const isTemplateGroupUser = isATemplateGroupUser(group);
  const GroupTemplate = isTemplateGroupUser
    ? OutlineTemplateGroupTemplate
    : OutlineGroupTemplate;

  return (
    <GroupTemplate
      key={group.id}
      title={group.name}
      select={() => select({ type: "group", item: group })}
      selected={selected?.item === group}
      depth={depth}
      deleteAction={() => deleteItem(group)}
      icon={isTemplateGroupUser ? <IconRubberStamp size={16} color="#15a334" /> : undefined}>
      {group.lights?.map((light) => (
        <OutlineLight
          key={light.id}
          title={displayNames[light.type]}
          icon={lightIcons[light.type]}
          select={() => select({ type: "light", item: light })}
          selected={selected?.item === light}
          deleteAction={() => deleteItem(light)}
          depth={(depth ?? 0) + 1}
        />
      ))}
      {group.primitives?.map((primitive) => (
        <OutlinePrimitive
          key={primitive.id}
          title={displayNames[primitive.type]}
          icon={primitiveIcons[primitive.type]}
          deleteAction={() => deleteItem(primitive)}
          select={() => select({ type: "primitive", item: primitive })}
          selected={selected?.item === primitive}
          depth={(depth ?? 0) + 1}
        />
      ))}
      {group.groups?.map((group) => OutlineGroup({ group, depth: (depth ?? 0) + 1 }))}
    </GroupTemplate>
  );
};

const OutlineScene = SceneOutlineItemTemplate({
  fallbackTitle: "Untitled Scene",
  showTrigger: true,
  initialOpen: true,
});

const OutlineCamera = SceneOutlineItemTemplate({
  fallbackTitle: "Camera",
  showTrigger: false,
});

const OutlineGroupTemplate = SceneOutlineItemTemplate({
  fallbackTitle: "Untitled Group",
  showTrigger: true,
  initialOpen: true,
});

const OutlineTemplateGroupTemplate = SceneOutlineItemTemplate({
  fallbackTitle: "Untitled Template Group",
  showTrigger: false,
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

const cameraIcon = <IconCamera size={16} color="#4079bf" />;

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
