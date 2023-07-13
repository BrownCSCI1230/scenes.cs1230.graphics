import { Group, Scenefile, _Group, _Scenefile } from "@/types/Scenefile";
import { v4 as uuidv4 } from "uuid";

/**
 * Loads a JSON scenefile file from the user's computer.
 * @param file The file to load.
 * @returns A Promise that resolves to the JSON scenefile as an unknown object.
 */
export async function loadJSON(file: File): Promise<unknown> {
  const readUploadedFileAsText = () => {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onerror = () => {
        fileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };
      fileReader.onload = () => {
        let contents = fileReader.result;
        if (contents === null) {
          reject(new DOMException("Problem parsing input file."));
          return;
        }
        if (typeof contents !== "string") {
          contents = new TextDecoder("utf-8").decode(contents);
        }
        try {
          const json = JSON.parse(contents);
          resolve(json);
        } catch (e) {
          reject(new DOMException("Invalid JSON."));
          return;
        }
      };
      fileReader.readAsText(file);
    });
  };
  return await readUploadedFileAsText();
}

/**
 * Assigns random UUIDs to all groups, lights, and primitives in a scenefile.
 * @param scenefile The scenefile to assign IDs to.
 * @returns The scenefile with IDs assigned.
 */
export function assignIDs(scenefile: _Scenefile): Scenefile {
  const assignIDsRecursive = (group: _Group): Group => {
    return {
      ...group,
      id: uuidv4(),
      lights: group.lights?.map((light) => {
        return {
          ...light,
          id: uuidv4(),
        };
      }),
      primitives: group.primitives?.map((primitive) => {
        return {
          ...primitive,
          id: uuidv4(),
        };
      }),
      groups: group.groups?.map((group) => {
        return assignIDsRecursive(group);
      }),
    };
  };
  const groups = scenefile.groups?.map((group) => {
    return assignIDsRecursive(group);
  });
  return {
    id: uuidv4(),
    ...scenefile,
    groups,
  };
}
