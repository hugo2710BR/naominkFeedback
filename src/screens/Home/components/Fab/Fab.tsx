export function Fab({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Adicionar fotografia"
      className="fixed bottom-5 right-[max(20px,calc((100vw_-_560px)/2_+_20px))] z-40 flex h-14 w-14 items-center justify-center rounded-full border-none bg-nmk-accent text-[26px] leading-none text-nmk-accent-ink shadow-fab transition-colors hover:bg-nmk-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-nmk-text"
    >
      +
    </button>
  );
}
