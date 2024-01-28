import { useEffect } from "react";

export const useEvent = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  name: string,
  callback: (e: Event) => any,
): (() => void) => {
  useEffect(() => {
    const refCurrent = ref.current;
    ref.current?.addEventListener(name, callback);
    return () => refCurrent?.removeEventListener(name, callback);
  }, [ref, name, callback]);
  return () => ref.current?.dispatchEvent(new Event(name, { bubbles: true }));
};
