import type { GalleryItem, Photo } from "@/types";

export function getR2ObjectUrl(key: string): string {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_R2_PUBLIC_URL não está definida.");
  }
  return `${base.replace(/\/$/, "")}/${key}`;
}

/** URL da miniatura (grelha). */
export function getThumbUrl(photo: Pick<Photo, "thumb_key">): string {
  return getR2ObjectUrl(photo.thumb_key);
}

/** URL da versão web (modal, botão "Transferir"). */
export function getWebUrl(photo: Pick<Photo, "web_key">): string {
  return getR2ObjectUrl(photo.web_key);
}

export function photoToGalleryItem(photo: Photo): GalleryItem {
  return {
    id: photo.id,
    url: getWebUrl(photo),
    thumbUrl: getThumbUrl(photo),
    name: photo.name,
    message: photo.message,
  };
}
