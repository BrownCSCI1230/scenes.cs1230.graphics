import { Group, Light, Primitive, Scenefile } from "@/types/Scenefile";

const searchGroups = <T>(
  scenefile: Scenefile,
  predicate: (group: Group) => T | undefined
): T | undefined => {
  const search = (groups?: Group[]): T | undefined => {
    if (!groups) {
      return;
    }
    for (const group of groups) {
      return predicate(group) || search(group.groups);
    }
  };
  return search(scenefile.groups);
};

export const getSelectedGroup = (
  scenefile: Scenefile,
  selected: string
): Group | undefined => {
  const predicate = (group: Group): Group | undefined => {
    if (group.id === selected) {
      return group;
    }
  };
  return searchGroups(scenefile, predicate);
};

export const getSelectedLight = (
  scenefile: Scenefile,
  selected: string
): Light | undefined => {
  const predicate = (group: Group): Light | undefined => {
    if (group.lights) {
      for (const light of group.lights) {
        if (light.id === selected) {
          return light;
        }
      }
    }
  };
  return searchGroups(scenefile, predicate);
};

export const getSelectedPrimitive = (
  scenefile: Scenefile,
  selected: string
): Primitive | undefined => {
  const predicate = (group: Group): Primitive | undefined => {
    if (group.primitives) {
      for (const primitive of group.primitives) {
        if (primitive.id === selected) {
          return primitive;
        }
      }
    }
  };
  return searchGroups(scenefile, predicate);
};
