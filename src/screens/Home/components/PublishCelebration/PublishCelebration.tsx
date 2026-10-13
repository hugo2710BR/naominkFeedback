import { usePublishCelebration } from "@/screens/Home/components/PublishCelebration/usePublishCelebration";
import type { CelebrationVariant } from "@/types";

export function PublishCelebration({
  variant,
  onDone,
}: {
  variant: CelebrationVariant;
  onDone: () => void;
}) {
  const { message, isPending, isLeaving, dismiss, stopPropagation } = usePublishCelebration(
    variant,
    onDone
  );

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-nmk-scrim p-6 ${
        isLeaving ? "animate-fadeOut" : "animate-modalIn"
      }`}
      onClick={dismiss}
      role="presentation"
    >
      <div
        role="status"
        aria-live="polite"
        onClick={stopPropagation}
        className="flex w-full max-w-[300px] animate-springIn flex-col items-center gap-4 rounded-modal bg-nmk-elevated px-7 py-10 text-center shadow-modal"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[oklch(1_0_0/0.2)]">
          {isPending ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="oklch(0.85 0.01 80)" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3.5 2" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="oklch(0.85 0.01 80)" strokeWidth="1.6" aria-hidden="true">
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div className="font-display text-[26px] italic">Obrigada!</div>
        <p className="m-0 text-[13px] leading-relaxed text-nmk-text-secondary">{message}</p>
        <button
          type="button"
          onClick={dismiss}
          className="mt-2 border-0 border-b border-solid border-[oklch(1_0_0/0.2)] bg-transparent p-0 pb-0.5 text-[11px] uppercase tracking-[0.08em] text-nmk-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nmk-text"
        >
          Voltar ao mural
        </button>
      </div>
    </div>
  );
}
