import { Spinner } from "@/components/Spinner/Spinner";
import { ROW_ACTION_CLASSES, type RowAction } from "@/screens/Admin/components/rowActions";
import { usePhotoRow } from "@/screens/Admin/components/PhotoRow/usePhotoRow";
import type { Photo } from "@/types";

export function PhotoRow({
  photo,
  busy,
  actions,
}: {
  photo: Photo;
  busy: boolean;
  actions: RowAction[];
}) {
  const { thumbUrl } = usePhotoRow(photo);

  return (
    <div
      className={`flex items-center gap-3.5 rounded-card bg-nmk-elevated p-3 transition-opacity ${
        busy ? "opacity-60" : "opacity-100"
      }`}
      aria-busy={busy}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbUrl}
        alt={`Fotografia de ${photo.name}`}
        className="h-12 w-12 shrink-0 rounded-photo object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="font-display text-[13px] italic">{photo.name}</div>
        {photo.message && (
          <div className="truncate text-xs text-nmk-text-muted">{photo.message}</div>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        {busy ? (
          <Spinner size={14} />
        ) : (
          actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={ROW_ACTION_CLASSES[action.variant]}
            >
              {action.label}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
