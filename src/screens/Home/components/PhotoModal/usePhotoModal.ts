import { useEffect, useRef, useState } from "react";
import { downloadImage, sanitizeFilename } from "@/helpers/download";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import type { GalleryItem } from "@/types";

export function usePhotoModal(item: GalleryItem, onClose: () => void) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  // Skeleton na foto enquanto a versão de 1600px chega do R2.
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    setIsImageLoaded(false);
  }, [item.url]);

  useEscapeKey(onClose);
  useFocusTrap(dialogRef);

  async function handleDownload() {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadImage(item.url, `${sanitizeFilename(item.name)}.jpg`);
    } catch {
      window.open(item.url, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  }

  function handleImageLoad() {
    setIsImageLoaded(true);
  }

  function stopPropagation(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return {
    closeButtonRef,
    dialogRef,
    isDownloading,
    isImageLoaded,
    handleDownload,
    handleImageLoad,
    stopPropagation,
  };
}
