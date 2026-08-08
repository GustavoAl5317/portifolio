"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SequenceManifest = {
  /** Quantidade de frames em public/sequence. */
  count: number;
  /** Padrão do nome do arquivo, ex.: "frame-%04d.jpg". */
  pattern: string;
  width: number;
  height: number;
};

const MANIFEST_URL = "/sequence/manifest.json";

/** "frame-%04d.jpg" + 7 -> "frame-0007.jpg" */
function frameName(pattern: string, index: number) {
  return pattern.replace(/%0(\d+)d/, (_, pad: string) =>
    String(index).padStart(Number(pad), "0"),
  );
}

type Props = {
  /** Altura do trecho preso ao scroll, em telas. Mais alto = scrub mais lento. */
  screens?: number;
  /** Mostrado enquanto não existir sequência em public/sequence. */
  fallback: React.ReactNode;
  /** Conteúdo sobreposto ao canvas (títulos, CTAs). */
  children?: (progress: number) => React.ReactNode;
};

/**
 * Reproduz uma sequência de imagens amarrada ao scroll — o frame exibido é
 * função da rolagem, não do tempo. É assim que a foto "se desmonta" enquanto
 * a pessoa rola a página.
 */
export function ScrollSequence({ screens = 3.5, fallback, children }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLImageElement[]>([]);
  const loaded = useRef<boolean[]>([]);
  const raf = useRef(0);

  const [manifest, setManifest] = useState<SequenceManifest | null>(null);
  const [missing, setMissing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadRatio, setLoadRatio] = useState(0);

  // 1. Descobre se existe uma sequência publicada.
  useEffect(() => {
    let cancelled = false;
    fetch(MANIFEST_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("sem manifest"))))
      .then((m: SequenceManifest) => {
        if (cancelled) return;
        if (!m?.count) setMissing(true);
        else setManifest(m);
      })
      .catch(() => {
        if (!cancelled) setMissing(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Pré-carrega os frames, em ordem, atualizando o progresso.
  useEffect(() => {
    if (!manifest) return;
    frames.current = new Array(manifest.count);
    loaded.current = new Array(manifest.count).fill(false);

    let done = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < manifest.count; i++) {
      const img = new window.Image();
      img.decoding = "async";
      img.src = `/sequence/${frameName(manifest.pattern, i + 1)}`;
      img.onload = () => {
        loaded.current[i] = true;
        done += 1;
        setLoadRatio(done / manifest.count);
      };
      img.onerror = () => {
        done += 1;
        setLoadRatio(done / manifest.count);
      };
      frames.current[i] = img;
      imgs.push(img);
    }

    return () => {
      for (const img of imgs) {
        img.onload = null;
        img.onerror = null;
      }
    };
  }, [manifest]);

  const draw = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !manifest) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Enquanto o frame exato não carregou, segura o último já disponível.
      let i = Math.min(manifest.count - 1, Math.max(0, index));
      while (i > 0 && !loaded.current[i]) i -= 1;
      const img = frames.current[i];
      if (!img || !loaded.current[i]) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // cover: preenche sem distorcer
      const ratio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = w / h;
      const dw = canvasRatio > ratio ? w : h * ratio;
      const dh = canvasRatio > ratio ? w / ratio : h;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    },
    [manifest],
  );

  // 3. Amarra scroll -> frame.
  useEffect(() => {
    if (!manifest) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const update = () => {
      const rect = wrap.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const p = distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : 0;
      setProgress(p);
      draw(Math.round(p * (manifest.count - 1)));
    };

    const schedule = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(update);
    };

    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", update);
    };
  }, [manifest, draw, loadRatio]);

  if (missing || !manifest) return <>{fallback}</>;

  return (
    <div
      ref={wrapRef}
      style={{ height: `${screens * 100}vh` }}
      className="relative"
    >
      {/* h-dvh em vez de h-screen: no mobile a barra do navegador some e volta */}
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        {/* vinheta para o texto sempre ter contraste sobre o frame */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/25 to-background/70" />

        {loadRatio < 0.12 && (
          <div className="absolute inset-x-0 bottom-10 mx-auto w-48">
            <div className="h-px w-full bg-borderline">
              <div
                className="h-px bg-accent transition-[width] duration-300"
                style={{ width: `${Math.round(loadRatio * 100)}%` }}
              />
            </div>
          </div>
        )}

        {children?.(progress)}
      </div>
    </div>
  );
}
