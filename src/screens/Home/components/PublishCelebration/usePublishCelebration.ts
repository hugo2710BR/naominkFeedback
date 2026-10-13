import { useEffect, useRef, useState } from "react";
import type { CelebrationVariant } from "@/types";

const AUTO_DISMISS_MS = 3000;
const EXIT_MS = 400;

const MESSAGES: Record<CelebrationVariant, string> = {
  published:
    "A tua fotografia já está no mural. Obrigada por partilhares a tua experiência.",
  pending:
    "A tua foto foi enviada e está em validação. Vais vê-la no mural assim que for aprovada.",
};

export function usePublishCelebration(variant: CelebrationVariant, onDone: () => void) {
  const [isLeaving, setIsLeaving] = useState(false);
  const exitTimeoutRef = useRef<number | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  function dismiss() {
    if (exitTimeoutRef.current !== null) return;
    setIsLeaving(true);
    exitTimeoutRef.current = window.setTimeout(() => onDoneRef.current(), EXIT_MS);
  }

  useEffect(() => {
    const timeout = window.setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => {
      window.clearTimeout(timeout);
      if (exitTimeoutRef.current !== null) window.clearTimeout(exitTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopPropagation(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return {
    message: MESSAGES[variant],
    isPending: variant === "pending",
    isLeaving,
    dismiss,
    stopPropagation,
  };
}
