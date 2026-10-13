import { useEffect, useRef } from "react";

/** Chama `onEscape` ao carregar em Escape. Usa sempre a versão mais recente do callback. */
export function useEscapeKey(onEscape: () => void) {
  const callbackRef = useRef(onEscape);
  callbackRef.current = onEscape;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") callbackRef.current();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
}
