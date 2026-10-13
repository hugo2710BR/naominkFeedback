import Image from "next/image";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { Spinner } from "@/components/Spinner/Spinner";
import { usePhotoModal } from "@/screens/Home/components/PhotoModal/usePhotoModal";
import type { GalleryItem } from "@/types";

export function PhotoModal({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  const {
    closeButtonRef,
    dialogRef,
    isDownloading,
    isImageLoaded,
    handleDownload,
    handleImageLoad,
    stopPropagation,
  } = usePhotoModal(item, onClose);

  return (
    <div
      className="fixed inset-0 z-50 flex animate-modalIn items-center justify-center bg-nmk-scrim p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        onClick={stopPropagation}
        role="dialog"
        aria-modal="true"
        aria-labelledby="photo-modal-name"
        className="relative w-full max-w-[330px] overflow-hidden rounded-modal bg-nmk-elevated shadow-modal"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full border-none bg-[oklch(0.04_0_0/0.5)] text-base text-nmk-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nmk-text"
        >
          ×
        </button>

        <div className="relative aspect-[4/5] w-full">
          {!isImageLoaded && <Skeleton className="absolute inset-0" />}
          <Image
            src={item.url}
            alt={`Tatuagem enviada por ${item.name}`}
            fill
            sizes="330px"
            onLoad={handleImageLoad}
            className={`object-cover transition-opacity duration-300 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
          />
        </div>

        <div className="flex flex-col gap-2.5 p-5">
          <div id="photo-modal-name" className="font-display text-[17px] italic">
            Enviado por {item.name}
          </div>
          {item.message && (
            <p className="m-0 text-[13px] leading-relaxed text-nmk-text-secondary">{item.message}</p>
          )}
          {isDownloading ? (
            <div className="mt-1 flex items-center gap-2 text-xs tracking-[0.04em] text-nmk-text-muted">
              <Spinner size={12} />A transferir…
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDownload}
              className="mt-1 self-start border-0 border-b border-solid border-[oklch(1_0_0/0.3)] bg-transparent p-0 pb-0.5 text-xs uppercase tracking-[0.08em] text-nmk-text-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nmk-text"
            >
              Transferir fotografia
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
