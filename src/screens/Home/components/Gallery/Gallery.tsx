import Image from "next/image";
import { useGallery } from "@/screens/Home/components/Gallery/useGallery";
import type { GalleryItem } from "@/types";

export function Gallery({
  items,
  onSelect,
}: {
  items: GalleryItem[];
  onSelect: (item: GalleryItem) => void;
}) {
  const { isEmpty, emptyTiles, tileDelay } = useGallery(items);

  return (
    <div className="relative animate-fadeUp px-4 pb-14">
      <div className="grid grid-cols-3 gap-[2px]">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            aria-label={`Ver a fotografia de ${item.name}`}
            className="relative aspect-square animate-tileIn cursor-pointer overflow-hidden border-none bg-nmk-tile p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-nmk-text"
            style={{ animationDelay: tileDelay(index) }}
          >
            <Image
              src={item.thumbUrl}
              alt={`Tatuagem enviada por ${item.name}`}
              fill
              sizes="(max-width: 560px) 33vw, 176px"
              className="object-cover"
            />
          </button>
        ))}
        {emptyTiles.map((index) => (
          <div
            key={index}
            aria-hidden="true"
            className="aspect-square animate-tileIn bg-nmk-elevated-2"
            style={{ animationDelay: tileDelay(index) }}
          />
        ))}
      </div>

      {isEmpty && (
        <div className="pointer-events-none absolute inset-x-4 bottom-14 top-0 flex items-center justify-center">
          <div className="max-w-[280px] p-6 text-center">
            <p className="m-0 font-display text-lg italic leading-normal text-nmk-text-secondary">
              Ainda não há fotos.
            </p>
            <p className="mb-0 mt-2 text-[13px] leading-relaxed text-nmk-text-muted">
              Sê a primeira pessoa a partilhar a tua tatuagem.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
