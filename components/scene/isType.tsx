import { Selected, SelectedWithID, SelectedWithoutID } from "@/hooks/useScenefile";


export function isTypeSelectedWithID(obj: Selected | undefined): obj is SelectedWithID {
  return obj !== undefined && (obj as SelectedWithID).id !== undefined;
}

export function isTypeSelectedWithoutID(obj: Selected | undefined): obj is SelectedWithoutID {
  return !isTypeSelectedWithID(obj);
}