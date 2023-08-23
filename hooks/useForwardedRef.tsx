import { useEffect, useRef } from "react";

export function useForwardedRef<T>(ref: React.Ref<T>) {
  const innerRef = useRef<T>(null);
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(innerRef.current);
    } else {
      // @ts-ignore
      ref.current = innerRef.current;
    }
  });

  return innerRef;
}
