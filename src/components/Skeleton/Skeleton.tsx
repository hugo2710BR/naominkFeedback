export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-skeleton bg-nmk-elevated-2 ${className}`} />;
}
