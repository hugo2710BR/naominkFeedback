import { getThumbUrl } from "@/helpers/photoUrl";
import type { Photo } from "@/types";

export function usePhotoRow(photo: Photo) {
  return { thumbUrl: getThumbUrl(photo) };
}
