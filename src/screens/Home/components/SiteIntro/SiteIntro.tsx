import { SITE } from "@/config/site";
import { useSiteIntro } from "@/screens/Home/components/SiteIntro/useSiteIntro";

export function SiteIntro() {
  const { isDone, isLeaving } = useSiteIntro();

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-nmk-bg ${
        isLeaving ? "animate-splashOut" : ""
      }`}
      aria-hidden="true"
    >
      <div className="flex animate-splashIn flex-col items-center gap-[18px]">
        <div className="font-display text-[40px] italic tracking-[0.01em]">{SITE.brand}</div>
        <div className="h-px w-10 bg-[oklch(1_0_0/0.25)]" />
        <div className="text-[11px] uppercase tracking-[0.22em] text-nmk-text-muted">{SITE.role}</div>
      </div>
    </div>
  );
}
