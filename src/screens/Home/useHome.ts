import { useCallback, useMemo, useState } from "react";
import { photoToGalleryItem } from "@/helpers/photoUrl";
import type { CelebrationVariant, GalleryItem, Photo } from "@/types";

export function useHome(initialPhotos: Photo[]) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [modalItemId, setModalItemId] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<CelebrationVariant | null>(null);

  const items = useMemo<GalleryItem[]>(() => photos.map(photoToGalleryItem), [photos]);

  const modalItem = items.find((item) => item.id === modalItemId) ?? null;

  const openSheet = useCallback(() => setSheetOpen(true), []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  const openModal = useCallback((item: GalleryItem) => setModalItemId(item.id), []);
  const closeModal = useCallback(() => setModalItemId(null), []);
  const dismissCelebration = useCallback(() => setCelebration(null), []);

  const handlePublished = useCallback((photo: Photo) => {
    setPhotos((prev) => [photo, ...prev]);
    setSheetOpen(false);
    setCelebration("published");
  }, []);

  const handlePendingApproval = useCallback(() => {
    setSheetOpen(false);
    setCelebration("pending");
  }, []);

  return {
    items,
    modalItem,
    sheetOpen,
    celebration,
    openSheet,
    closeSheet,
    openModal,
    closeModal,
    dismissCelebration,
    handlePublished,
    handlePendingApproval,
  };
}
