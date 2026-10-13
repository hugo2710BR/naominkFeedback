import { Skeleton } from "@/components/Skeleton/Skeleton";
import { Spinner } from "@/components/Spinner/Spinner";
import { ROW_ACTION_CLASSES } from "@/screens/Admin/components/rowActions";
import { useOrphanRow } from "@/screens/Admin/components/OrphanRow/useOrphanRow";
import type { OrphanGroup } from "@/types";

export function OrphanRow({
  group,
  busy,
  onDelete,
}: {
  group: OrphanGroup;
  busy: boolean;
  onDelete: () => void;
}) {
  const { date, summary } = useOrphanRow(group);

  return (
    <div
      className={`flex items-center gap-3.5 rounded-card bg-nmk-elevated p-3 transition-opacity ${
        busy ? "opacity-60" : "opacity-100"
      }`}
      aria-busy={busy}
    >
      <Skeleton className="h-12 w-12 shrink-0 rounded-photo" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="text-[13px] text-nmk-text-soft">{date}</div>
        <div className="truncate text-xs text-nmk-text-muted">{summary}</div>
      </div>
      <div className="flex shrink-0 gap-2">
        {busy ? (
          <Spinner size={14} />
        ) : (
          <button type="button" onClick={onDelete} className={ROW_ACTION_CLASSES.danger}>
            Apagar
          </button>
        )}
      </div>
    </div>
  );
}
