import { useEffect } from "react";

/**
 * Bloqueia o scroll da página enquanto `active` for true.
 * `pinBody`: `overflow: hidden` sozinho não impede o scroll por toque no
 * iOS Safari, por isso o body é também fixado (`position: fixed`) no
 * offset atual e reposto ao desbloquear.
 */
export function useBodyScrollLock(active = true, { pinBody = false } = {}) {
  useEffect(() => {
    if (!active) return;

    const scrollY = window.scrollY;
    const { body } = document;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    body.style.overflow = "hidden";
    if (pinBody) {
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.width = "100%";
    }

    return () => {
      body.style.overflow = previous.overflow;
      if (pinBody) {
        body.style.position = previous.position;
        body.style.top = previous.top;
        body.style.width = previous.width;
        window.scrollTo(0, scrollY);
      }
    };
  }, [active, pinBody]);
}
