"use client";

import { useEffect, useState } from "react";

export type Sensors = {
  /** Posição do mouse normalizada em -1..1 (centro da janela = 0). */
  mx: number;
  my: number;
  /** Rolagem total da página em 0..1. */
  scroll: number;
};

/**
 * Ponte entre o movimento do site e o personagem: mouse + scroll,
 * amostrados num único rAF para não disparar render a cada evento.
 */
export function useSensors(): Sensors {
  const [sensors, setSensors] = useState<Sensors>({ mx: 0, my: 0, scroll: 0 });

  useEffect(() => {
    const target = { mx: 0, my: 0, scroll: 0 };
    const current = { mx: 0, my: 0, scroll: 0 };
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      target.mx = (e.clientX / window.innerWidth) * 2 - 1;
      target.my = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target.scroll = max > 0 ? window.scrollY / max : 0;
    };

    const tick = () => {
      // Interpolação: o personagem persegue o cursor com inércia, não teleporta.
      current.mx += (target.mx - current.mx) * 0.07;
      current.my += (target.my - current.my) * 0.07;
      current.scroll += (target.scroll - current.scroll) * 0.12;

      setSensors((prev) => {
        const changed =
          Math.abs(prev.mx - current.mx) > 0.002 ||
          Math.abs(prev.my - current.my) > 0.002 ||
          Math.abs(prev.scroll - current.scroll) > 0.002;
        return changed
          ? { mx: current.mx, my: current.my, scroll: current.scroll }
          : prev;
      });

      frame = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return sensors;
}
