import { Skeleton } from "@/components/Skeleton/Skeleton";
import { Spinner } from "@/components/Spinner/Spinner";
import { MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH } from "@/config/uploadLimits";
import { useUploadSheet } from "@/screens/Home/components/UploadSheet/useUploadSheet";
import type { Photo } from "@/types";

const FIELD_CLASSES =
  "w-full rounded-input border border-nmk-border bg-nmk-elevated-2 px-3.5 py-3 font-ui text-sm text-nmk-text placeholder:text-nmk-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-nmk-text disabled:opacity-60";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nmk-text";

export function UploadSheet({
  onClose,
  onPublished,
  onPendingApproval,
}: {
  onClose: () => void;
  onPublished: (photo: Photo) => void;
  onPendingApproval: () => void;
}) {
  const {
    sheetRef,
    fileInputRef,
    sheetStyle,
    isOpen,
    previewUrl,
    name,
    message,
    error,
    isPreparing,
    isPublishing,
    publishDisabled,
    helperText,
    nameCount,
    messageCount,
    requestClose,
    openFilePicker,
    stopPropagation,
    handleHandlePointerDown,
    handleHandlePointerMove,
    handleHandlePointerEnd,
    handleFileChange,
    handleNameChange,
    handleMessageChange,
    handlePublish,
  } = useUploadSheet({ onClose, onPublished, onPendingApproval });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-nmk-scrim-soft transition-opacity duration-300 ease-out"
      style={{ opacity: isOpen ? 1 : 0 }}
      onClick={requestClose}
      role="presentation"
    >
      <div
        ref={sheetRef}
        onClick={stopPropagation}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-sheet-title"
        className="flex w-full max-w-page flex-col overflow-hidden rounded-t-sheet bg-nmk-elevated px-[22px] pb-[22px] pt-3 shadow-sheet"
        style={sheetStyle}
      >
        <div
          onPointerDown={handleHandlePointerDown}
          onPointerMove={handleHandlePointerMove}
          onPointerUp={handleHandlePointerEnd}
          onPointerCancel={handleHandlePointerEnd}
          className="mx-auto mb-3.5 flex h-5 w-16 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
          aria-hidden="true"
        >
          <div className="h-1 w-9 rounded-full bg-nmk-border-strong" />
        </div>

        <div id="upload-sheet-title" className="mb-[18px] font-display text-[19px] italic">
          Partilha a tua tatuagem
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          onChange={handleFileChange}
          className="hidden"
          tabIndex={-1}
        />

        <div className="flex flex-col gap-4">
          {isPreparing ? (
            <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-photo">
              <Skeleton className="absolute inset-0" />
              <span className="relative text-[11px] tracking-[0.08em] text-nmk-text-muted">
                A preparar a fotografia…
              </span>
            </div>
          ) : previewUrl ? (
            <div className="relative h-40 overflow-hidden rounded-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Pré-visualização da fotografia escolhida"
                className="block h-full w-full object-cover"
              />
              {isPublishing && <div className="absolute inset-0 bg-[oklch(0.04_0_0/0.45)]" />}
              <button
                type="button"
                onClick={openFilePicker}
                disabled={isPublishing}
                className={`absolute bottom-2.5 right-2.5 rounded-full border-none bg-nmk-scrim-btn px-3.5 py-2 text-[11px] tracking-[0.04em] text-nmk-text disabled:opacity-60 ${FOCUS_RING}`}
              >
                Alterar fotografia
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openFilePicker}
              className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-photo border border-dashed border-[oklch(1_0_0/0.25)] bg-nmk-bg font-ui text-nmk-text-secondary ${FOCUS_RING}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <rect x="3" y="5" width="18" height="15" rx="2" />
                <circle cx="8.5" cy="10.5" r="1.5" />
                <path d="M21 16l-5-5-4.5 4.5L9 13l-6 6" />
              </svg>
              <span className="text-[13px]">Escolher fotografia</span>
              <span className="text-[11px] text-nmk-text-muted">JPG ou PNG</span>
            </button>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="flex items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-[0.1em] text-nmk-text-secondary">O teu nome</span>
              <span className="text-[11px] text-nmk-text-muted">{nameCount}</span>
            </span>
            <input
              id="guest-name"
              type="text"
              placeholder="O teu nome"
              value={name}
              maxLength={MAX_NAME_LENGTH}
              onChange={handleNameChange}
              disabled={isPublishing}
              className={FIELD_CLASSES}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="flex items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-[0.1em] text-nmk-text-secondary">
                A tua mensagem{" "}
                <span className="normal-case tracking-normal text-nmk-text-muted">(opcional)</span>
              </span>
              <span className="text-[11px] text-nmk-text-muted">{messageCount}</span>
            </span>
            <textarea
              id="guest-message"
              placeholder="Conta-nos como foi a tua experiência…"
              value={message}
              maxLength={MAX_MESSAGE_LENGTH}
              onChange={handleMessageChange}
              disabled={isPublishing}
              rows={3}
              className={`${FIELD_CLASSES} resize-none`}
            />
          </label>

          {error && (
            <div
              role="alert"
              className="rounded-input border border-nmk-danger-border bg-nmk-danger-bg px-3 py-2.5 text-xs leading-normal text-nmk-danger-text"
            >
              {error}
            </div>
          )}

          <div className="mt-1 flex gap-3">
            <button
              type="button"
              onClick={requestClose}
              className={`flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-nmk-border-strong bg-transparent py-3.5 text-[13px] tracking-[0.04em] text-nmk-text-secondary ${FOCUS_RING}`}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishDisabled}
              className={`flex min-h-[44px] flex-[2] items-center justify-center gap-2 rounded-full border-none bg-nmk-accent py-3.5 text-[13px] font-medium tracking-[0.04em] text-nmk-accent-ink disabled:cursor-not-allowed disabled:bg-nmk-disabled disabled:text-nmk-text-muted ${FOCUS_RING}`}
            >
              {isPublishing && <Spinner />}
              {isPublishing ? "A publicar…" : "Publicar"}
            </button>
          </div>

          {helperText && (
            <div className="-mt-1 text-center text-[11px] text-nmk-text-muted">{helperText}</div>
          )}
        </div>
      </div>
    </div>
  );
}
