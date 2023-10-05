import { SelectedWithID } from "@/hooks/useScenefile";
import { Group, Light, Primitive, Scenefile } from "@/types/Scenefile";

const searchGroups = <T>(
  scenefile: Scenefile,
  predicate: (group: Group) => T | undefined,
): T | undefined => {
  const search = (groups?: Group[]): T | undefined => {
    if (!groups) return;
    for (const group of groups) {
      const result = predicate(group);
      if (result) return result;
      search(group.groups);
    }
  };
  return search(scenefile.groups);
};

export const getSelectedGroup = (
  scenefile: Scenefile,
  selected: SelectedWithID,
): Group | undefined => {
  const predicate = (group: Group): Group | undefined => {
    if (group.id === selected.id) {
      return group;
    }
  };
  return searchGroups(scenefile, predicate);
};

export const getSelectedLight = (
  scenefile: Scenefile,
  selected: SelectedWithID,
): Light | undefined => {
  const predicate = (group: Group): Light | undefined => {
    if (group.lights) {
      for (const light of group.lights) {
        if (light.id === selected.id) {
          return light;
        }
      }
    }
  };
  return searchGroups(scenefile, predicate);
};

export const getSelectedPrimitive = (
  scenefile: Scenefile,
  selected: SelectedWithID,
): Primitive | undefined => {
  const predicate = (group: Group): Primitive | undefined => {
    if (group.primitives) {
      for (const primitive of group.primitives) {
        if (primitive.id === selected.id) {
          return primitive;
        }
      }
    }
  };
  return searchGroups(scenefile, predicate);
};
