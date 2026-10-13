"use client";

import { SectionDivider } from "@/components/SectionDivider/SectionDivider";
import { SITE } from "@/config/site";
import { Fab } from "@/screens/Home/components/Fab/Fab";
import { Gallery } from "@/screens/Home/components/Gallery/Gallery";
import { Hero } from "@/screens/Home/components/Hero/Hero";
import { IntroCta } from "@/screens/Home/components/IntroCta/IntroCta";
import { PhotoModal } from "@/screens/Home/components/PhotoModal/PhotoModal";
import { PublishCelebration } from "@/screens/Home/components/PublishCelebration/PublishCelebration";
import { SiteIntro } from "@/screens/Home/components/SiteIntro/SiteIntro";
import { UploadSheet } from "@/screens/Home/components/UploadSheet/UploadSheet";
import { useHome } from "@/screens/Home/useHome";
import type { Photo } from "@/types";

export function Home({ initialPhotos }: { initialPhotos: Photo[] }) {
  const {
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
  } = useHome(initialPhotos);

  return (
    <div className="flex min-h-screen w-full justify-center bg-nmk-bg">
      <SiteIntro />
      <div className="relative w-full max-w-page">
        <Hero />
        <IntroCta onOpenSheet={openSheet} />
        <SectionDivider label={SITE.galleryLabel} />
        <Gallery items={items} onSelect={openModal} />
        <Fab onClick={openSheet} />

        {celebration && <PublishCelebration variant={celebration} onDone={dismissCelebration} />}

        {modalItem && <PhotoModal item={modalItem} onClose={closeModal} />}

        {sheetOpen && (
          <UploadSheet
            onClose={closeSheet}
            onPublished={handlePublished}
            onPendingApproval={handlePendingApproval}
          />
        )}
      </div>
    </div>
  );
}
