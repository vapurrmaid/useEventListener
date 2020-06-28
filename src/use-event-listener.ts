import { useEffect } from "react";

export function useDocumentEventListener<T extends keyof DocumentEventMap>(
  type: T,
  listener: (ev: DocumentEventMap[T]) => void,
  dependencies: React.DependencyList = []
): void {
  useEffect(() => {
    document.addEventListener(type, listener);
    return () => document.removeEventListener(type, listener);
  }, [type, listener, ...dependencies]);
}

export function useWindowEventListener<T extends keyof WindowEventMap>(
  type: T,
  listener: (ev: WindowEventMap[T]) => void,
  dependencies: React.DependencyList = []
): void {
  useEffect(() => {
    window.addEventListener(type, listener);
    return () => window.removeEventListener(type, listener);
  }, [type, listener, ...dependencies]);
}
