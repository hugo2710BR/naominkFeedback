export type RowActionVariant = "approve" | "danger";

export interface RowAction {
  label: string;
  variant: RowActionVariant;
  onClick: () => void;
}

const BASE =
  "min-h-9 rounded-full border-none px-3.5 py-2 text-[11px] tracking-[0.03em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nmk-text";

export const ROW_ACTION_CLASSES: Record<RowActionVariant, string> = {
  approve: `${BASE} bg-nmk-success-tint text-nmk-success-tint-text`,
  danger: `${BASE} bg-nmk-danger-tint text-nmk-danger-tint-text`,
};
