import Image from "next/image";
import { SITE } from "@/config/site";

export function Hero() {
  return (
    <div className="relative aspect-[4/5] w-full animate-fadeUp overflow-hidden bg-nmk-bg-deep">
      <Image
        src={SITE.heroImage}
        alt={SITE.heroAlt}
        fill
        priority
        sizes="(max-width: 560px) 100vw, 560px"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.08 0.004 60 / 0) 0%, oklch(0.08 0.004 60 / 0.18) 45%, oklch(0.06 0.004 60 / 0.94) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3.5 px-6 pb-8 pt-7">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[oklch(0.88_0.01_80/0.85)]">
          {SITE.role}
        </div>
        <h1 className="m-0 font-display text-5xl font-normal italic leading-none tracking-[0.005em]">
          {SITE.brand}
        </h1>
      </div>
    </div>
  );
}
