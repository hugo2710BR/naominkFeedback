import {
  EMPTY_TILE_COUNT,
  TILE_STAGGER_MAX_INDEX,
  TILE_STAGGER_MS,
} from "@/screens/Home/Home.constants";
import type { GalleryItem } from "@/types";

export function useGallery(items: GalleryItem[]) {
  const isEmpty = items.length === 0;

  function tileDelay(index: number): string {
    return `${Math.min(index, TILE_STAGGER_MAX_INDEX) * TILE_STAGGER_MS}ms`;
  }

  return {
    isEmpty,
    emptyTiles: isEmpty ? Array.from({ length: EMPTY_TILE_COUNT }, (_, i) => i) : [],
    tileDelay,
  };
}
