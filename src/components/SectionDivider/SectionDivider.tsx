export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex animate-fadeUp items-center gap-4 px-6 pb-7">
      <div className="h-px flex-1 bg-nmk-rule" />
      <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.2em] text-nmk-text-muted">
        {label}
      </span>
      <div className="h-px flex-1 bg-nmk-rule" />
    </div>
  );
}
