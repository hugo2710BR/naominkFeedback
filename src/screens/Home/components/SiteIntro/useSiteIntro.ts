import { useEffect, useState } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const ENTRANCE_MS = 400;
const HOLD_MS = 1200;
const EXIT_MS = 500;

type IntroPhase = "visible" | "leaving" | "done";

/**
 * Splash de entrada: wordmark aparece (400ms), fica (1200ms) e desvanece
 * (500ms) para revelar o hero, que já está renderizado por baixo.
 */
export function useSiteIntro() {
  const [phase, setPhase] = useState<IntroPhase>("visible");

  useEffect(() => {
    const leaveTimeout = window.setTimeout(() => setPhase("leaving"), ENTRANCE_MS + HOLD_MS);
    const doneTimeout = window.setTimeout(() => setPhase("done"), ENTRANCE_MS + HOLD_MS + EXIT_MS);
    return () => {
      window.clearTimeout(leaveTimeout);
      window.clearTimeout(doneTimeout);
    };
  }, []);

  useBodyScrollLock(phase !== "done");

  return {
    isDone: phase === "done",
    isLeaving: phase === "leaving",
  };
}
