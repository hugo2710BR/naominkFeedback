import { SITE } from "@/config/site";

export function IntroCta({ onOpenSheet }: { onOpenSheet: () => void }) {
  return (
    <div className="flex animate-fadeUp flex-col items-center gap-6 px-6 pb-8 pt-10 text-center">
      <p className="m-0 max-w-[420px] text-base leading-relaxed text-nmk-text-secondary">{SITE.intro}</p>
      <button
        type="button"
        onClick={onOpenSheet}
        className="flex min-h-[44px] items-center justify-center rounded-full border-none bg-nmk-accent px-8 py-4 text-sm font-medium tracking-[0.04em] text-nmk-accent-ink transition-colors hover:bg-nmk-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-nmk-text"
      >
        {SITE.ctaLabel}
      </button>
    </div>
  );
}
