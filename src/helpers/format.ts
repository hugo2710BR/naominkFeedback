export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDateTime(iso: string): string {
  return iso ? new Date(iso).toLocaleString("pt-PT") : "";
}

/** Ex.: "28 set. 2026, 14:32" */
export function formatShortDateTime(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("pt-PT", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCharCount(value: string, max: number): string {
  return `${value.length}/${max}`;
}
