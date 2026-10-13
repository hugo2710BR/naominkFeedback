const VARIANT_CLASSES = {
  light: "border-[oklch(0.4_0.01_60)] border-t-[oklch(0.9_0.01_80)]",
  dark: "border-[oklch(0.3_0.006_55)] border-t-nmk-accent-ink",
} as const;

export function Spinner({
  size = 13,
  variant = "light",
}: {
  size?: number;
  variant?: keyof typeof VARIANT_CLASSES;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 animate-spinner rounded-full border-2 ${VARIANT_CLASSES[variant]}`}
      style={{ width: size, height: size }}
    />
  );
}
