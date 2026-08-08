"use client";

import { useEffect, useId, useState } from "react";

/** Testadas em ordem: vale a primeira que existir em public/. */
const PHOTO_CANDIDATES = ["/me.jpg", "/me.jpeg", "/me.png", "/me.webp"];

/**
 * Enquadramento da foto dentro da tela do robô. Se o rosto ficar torto,
 * mexa só aqui: zoom aproxima, offset desloca.
 */
const SCREEN = { x: 76, y: 92, w: 88, h: 74, r: 12 };
const FACE = { zoom: 1.25, offsetX: 0, offsetY: -6 };
const faceSize = Math.max(SCREEN.w, SCREEN.h) * FACE.zoom;
const faceX = SCREEN.x + SCREEN.w / 2 - faceSize / 2 + FACE.offsetX;
const faceY = SCREEN.y + SCREEN.h / 2 - faceSize / 2 + FACE.offsetY;

/**
 * O robô que carrega o rosto real do Gustavo na tela — a versão de máquina
 * do personagem ilustrado que aparece na seção de projetos.
 */
export function RobotMe({ className = "" }: { className?: string }) {
  const [photo, setPhoto] = useState<string | null | undefined>(undefined);

  const uid = useId().replace(/:/g, "");
  const ref = (name: string) => `${name}-${uid}`;
  const url = (name: string) => `url(#${name}-${uid})`;

  // `onError` do React não dispara em <image> de SVG: testamos os arquivos à parte.
  useEffect(() => {
    let cancelled = false;

    const test = (src: string) =>
      new Promise<boolean>((resolve) => {
        const probe = new window.Image();
        probe.onload = () => resolve(true);
        probe.onerror = () => resolve(false);
        probe.src = src;
      });

    (async () => {
      for (const src of PHOTO_CANDIDATES) {
        if (await test(src)) {
          if (!cancelled) setPhoto(src);
          return;
        }
      }
      if (!cancelled) setPhoto(null);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <svg
      viewBox="0 0 240 260"
      className={`h-auto w-full overflow-visible ${className}`}
      role="img"
      aria-label="Robô com o rosto do Gustavo na tela"
    >
      <defs>
        <clipPath id={ref("screenClip")}>
          <rect
            x={SCREEN.x}
            y={SCREEN.y}
            width={SCREEN.w}
            height={SCREEN.h}
            rx={SCREEN.r}
          />
        </clipPath>

        <linearGradient id={ref("body")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e6ebf5" />
        </linearGradient>

        <linearGradient id={ref("visor")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b3242" />
          <stop offset="100%" stopColor="#1b2231" />
        </linearGradient>

        <radialGradient id={ref("halo")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={ref("tint")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.12" />
          <stop offset="70%" stopColor="#4f46e5" stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx="120" cy="140" rx="112" ry="104" fill={url("halo")} />
      <ellipse cx="120" cy="240" rx="60" ry="7" fill="#0d1526" opacity="0.09" />

      <g className="anim-float">
        {/* antena */}
        <line x1="120" y1="46" x2="120" y2="64" stroke="#b9c4d6" strokeWidth="3" strokeLinecap="round" />
        <circle cx="120" cy="40" r="7" fill="#4f46e5" />
        <circle cx="120" cy="40" r="11" fill="none" stroke="#4f46e5" strokeWidth="1.4" className="anim-brain-ring" />

        {/* orelhas / alto-falantes */}
        <rect x="52" y="112" width="14" height="34" rx="7" fill="#cdd6e6" />
        <rect x="174" y="112" width="14" height="34" rx="7" fill="#cdd6e6" />

        {/* cabeça */}
        <rect
          x="62"
          y="64"
          width="116"
          height="112"
          rx="28"
          fill={url("body")}
          stroke="#c6d0e0"
          strokeWidth="2"
        />

        {/* visor com a foto */}
        <rect
          x={SCREEN.x - 5}
          y={SCREEN.y - 5}
          width={SCREEN.w + 10}
          height={SCREEN.h + 10}
          rx={SCREEN.r + 4}
          fill={url("visor")}
        />
        {photo ? (
          <>
            <g clipPath={url("screenClip")}>
              <image
                href={photo}
                x={faceX}
                y={faceY}
                width={faceSize}
                height={faceSize}
                preserveAspectRatio="xMidYMid slice"
              />
              <rect
                x={SCREEN.x}
                y={SCREEN.y}
                width={SCREEN.w}
                height={SCREEN.h}
                fill={url("tint")}
              />
            </g>
            <rect
              x={SCREEN.x}
              y={SCREEN.y}
              width={SCREEN.w}
              height={SCREEN.h}
              rx={SCREEN.r}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="1.4"
              opacity="0.55"
            />
          </>
        ) : (
          // Sem foto em public/: o robô fica com olhos de LED.
          <g>
            <rect
              x={SCREEN.x}
              y={SCREEN.y}
              width={SCREEN.w}
              height={SCREEN.h}
              rx={SCREEN.r}
              fill="#141b28"
            />
            <circle cx={SCREEN.x + 26} cy={SCREEN.y + 32} r="7" fill="#4f46e5" />
            <circle cx={SCREEN.x + 62} cy={SCREEN.y + 32} r="7" fill="#4f46e5" />
            <path
              d={`M${SCREEN.x + 30} ${SCREEN.y + 52} Q${SCREEN.x + 44} ${SCREEN.y + 60} ${SCREEN.x + 58} ${SCREEN.y + 52}`}
              stroke="#7c3aed"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {/* tronco */}
        <rect
          x="80"
          y="184"
          width="80"
          height="52"
          rx="18"
          fill={url("body")}
          stroke="#c6d0e0"
          strokeWidth="2"
        />
        <circle cx="120" cy="204" r="8" fill="#eef1fe" stroke="#4f46e5" strokeWidth="1.4" />
        <circle cx="120" cy="204" r="3" fill="#4f46e5" className="anim-spark" />
        <rect x="104" y="220" width="32" height="4" rx="2" fill="#cdd6e6" />

        {/* braços: o direito acena */}
        <path
          d="M80 196 C 62 198, 54 208, 54 218"
          fill="none"
          stroke="#cdd6e6"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="54" cy="220" r="7" fill="#b9c4d6" />
        <g className="anim-wave-arm">
          <path
            d="M160 196 C 176 194, 186 182, 186 170"
            fill="none"
            stroke="#cdd6e6"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="186" cy="166" r="7.5" fill="#b9c4d6" />
        </g>
      </g>
    </svg>
  );
}
