import { formatBytes, formatShortDateTime } from "@/helpers/format";
import type { OrphanGroup } from "@/types";

export function useOrphanRow(group: OrphanGroup) {
  return {
    date: formatShortDateTime(group.lastModified),
    summary: `${formatBytes(group.totalSize)} · ${group.keys.length} ficheiro(s) · envio interrompido`,
  };
}
