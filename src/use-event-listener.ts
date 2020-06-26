import { useEffect } from "react";

export function useWindowEventListener<T extends keyof WindowEventHandlersEventMap>(
  type: T,
  listener: (ev: WindowEventHandlersEventMap[T]) => void,
  dependencies: React.DependencyList = []
): void {
  useEffect(() => {
    window.addEventListener(type, listener);
    return () => window.removeEventListener(type, listener);
  }, [type, listener, ...dependencies]);
}
