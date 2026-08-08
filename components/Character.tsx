"use client";

import { useEffect, useId, useState } from "react";
import { useSensors } from "./useSensors";

/** Testadas em ordem: vale a primeira que existir em public/. */
const PHOTO_CANDIDATES = ["/me.jpg", "/me.jpeg", "/me.png", "/me.webp"];

/**
 * Enquadramento da foto no círculo da cabeça.
 * Se o rosto ficar torto, mexa só aqui: zoom aproxima, offset desloca.
 */
const FACE = { cx: 120, cy: 100, r: 46, zoom: 1.35, offsetX: 3, offsetY: 4 };
const faceSize = FACE.r * 2 * FACE.zoom;
const faceX = FACE.cx - faceSize / 2 + FACE.offsetX;
const faceY = FACE.cy - faceSize / 2 + FACE.offsetY;

/**
 * Ponto do cérebro dentro do viewBox — é daqui que saem as linhas de ideia.
 * BRAIN_ANCHOR converte esse ponto em % para posicionar a âncora no DOM.
 */
const VIEW_W = 240;
const VIEW_H = 300;
const BRAIN = { x: 120, y: 30 };
const BRAIN_ANCHOR = {
  left: `${(BRAIN.x / VIEW_W) * 100}%`,
  top: `${(BRAIN.y / VIEW_H) * 100}%`,
};

/** Paleta do personagem, num lugar só para ficar fácil de ajustar. */
const C = {
  skin: "#b9825b",
  skinShade: "#a06d49",
  skinLight: "#cb9670",
  hair: "#171210",
  hairLight: "#2e2219",
  brow: "#171210",
  iris: "#4a2c17",
  pupil: "#100a06",
  mouth: "#63302c",
  teeth: "#fdfdfd",
  shirt: "#2b3242",
  shirtLight: "#3b4459",
  trim: "#6366f1",
  device: "#dde4f0",
  deviceEdge: "#b9c4d6",
  deviceDark: "#2b3242",
  ink: "#4f46e5",
};

/**
 * Cachos: círculos ao longo da silhueta do cabelo. Ficam todos acima de
 * y=78 para o cabelo não descer sobre a testa nem cobrir as orelhas.
 */
const CURLS: Array<[number, number, number]> = [
  [120, 47, 12],
  [105, 52, 11],
  [135, 52, 11],
  [93, 64, 9.5],
  [147, 64, 9.5],
  [112, 45, 8.5],
  [128, 45, 8.5],
  [98, 55, 8],
  [142, 55, 8],
  [88, 73, 7],
  [152, 73, 7],
];

type Props = {
  /** Âncora invisível usada pelo overlay para achar o cérebro na tela. */
  brainRef?: React.Ref<HTMLSpanElement>;
  /** Muda quando outro projeto entra em foco: dispara o clarão no cérebro. */
  pulseKey?: number;
  className?: string;
};

export function Character({ brainRef, pulseKey = 0, className = "" }: Props) {
  const { mx, my, scroll } = useSensors();
  // undefined = ainda procurando; string = achou; null = nenhuma foto em public/.
  const [photo, setPhoto] = useState<string | null | undefined>(undefined);

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

  // Duas instâncias do personagem podem conviver na página: os ids do <defs>
  // precisam ser únicos, senão a segunda usa os gradientes da primeira.
  const uid = useId().replace(/:/g, "");
  const ref = (name: string) => `${name}-${uid}`;
  const url = (name: string) => `url(#${name}-${uid})`;

  // A cabeça acompanha o cursor; o corpo inteiro balança de leve com o scroll.
  const headTilt = mx * 7 + Math.sin(scroll * Math.PI * 4) * 1.5;
  const headLift = my * 4;
  const bodySway = mx * 2.5;
  const bodyDrift = Math.sin(scroll * Math.PI * 6) * 2;
  // Os olhos seguem o cursor um pouco mais do que a cabeça.
  const gazeX = mx * 1.6;
  const gazeY = my * 1.1;

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label="Ilustração do Gustavo digitando"
      >
        <defs>
          <linearGradient id={ref("shirtGrad")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.shirtLight} />
            <stop offset="100%" stopColor={C.shirt} />
          </linearGradient>

          <linearGradient id={ref("screenGrad")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#eef2fb" />
          </linearGradient>

          <radialGradient id={ref("glow")} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.ink} stopOpacity="0.14" />
            <stop offset="100%" stopColor={C.ink} stopOpacity="0" />
          </radialGradient>

          <radialGradient id={ref("brainGlow")} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.ink} stopOpacity="0.5" />
            <stop offset="100%" stopColor={C.ink} stopOpacity="0" />
          </radialGradient>

          <clipPath id={ref("headClip")}>
            <circle cx={FACE.cx} cy={FACE.cy} r={FACE.r} />
          </clipPath>

          <linearGradient id={ref("ringGrad")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="55%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>

          <clipPath id={ref("faceClip")}>
            <path d="M87 92 C87 66 100 53 120 53 C140 53 153 66 153 92 C153 113 143 132 120 136 C97 132 87 113 87 92 Z" />
          </clipPath>
        </defs>

        {/* brilho ambiente e sombra de contato */}
        <ellipse cx="120" cy="240" rx="126" ry="56" fill={url("glow")} />
        <ellipse cx="120" cy="258" rx="86" ry="6" fill="#0d1526" opacity="0.07" />

        <g
          style={{
            transform: `translate(${bodySway}px, ${bodyDrift}px)`,
            transition: "transform 240ms ease-out",
          }}
        >
          {/* tronco + pescoço, respirando */}
          <g className="anim-breathe">
            <path d="M109 126 h22 v28 h-22 z" fill={C.skinShade} />
            <path
              d="M120 150 C 92 150, 74 166, 70 198 L 64 254 h112 l-6 -56 C 166 166, 148 150, 120 150 Z"
              fill={url("shirtGrad")}
            />
            {/* gola */}
            <path
              d="M103 153 C 110 166, 130 166, 137 153"
              fill="none"
              stroke={C.trim}
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* costura do ombro */}
            <path
              d="M92 158 C 86 176, 84 194, 86 212"
              fill="none"
              stroke={C.shirtLight}
              strokeWidth="1.4"
              opacity="0.7"
            />
          </g>

          {/* ---------- cabeça ---------- */}
          <g
            style={{
              transform: `rotate(${headTilt}deg) translateY(${headLift}px)`,
              transformOrigin: "120px 142px",
              transition: "transform 260ms ease-out",
            }}
          >
            <g className="anim-head">
              {photo ? (
                <PhotoHead
                  src={photo}
                  clip={url("headClip")}
                  ring={url("ringGrad")}
                />
              ) : (
                <>
              {/* orelhas */}
              <ellipse cx="86" cy="97" rx="5.5" ry="8.5" fill={C.skinShade} />
              <ellipse cx="154" cy="97" rx="5.5" ry="8.5" fill={C.skinShade} />

              {/* rosto */}
              <path
                d="M87 92 C87 66 100 53 120 53 C140 53 153 66 153 92 C153 113 143 132 120 136 C97 132 87 113 87 92 Z"
                fill={C.skin}
              />
              {/* sombra lateral, dá volume ao rosto */}
              <g clipPath={url("faceClip")}>
                <path
                  d="M139 53 C152 66 156 100 147 131 L160 140 L160 45 Z"
                  fill={C.skinShade}
                  opacity="0.3"
                />
                <ellipse cx="103" cy="110" rx="8" ry="4.5" fill={C.skinLight} opacity="0.28" />
                <ellipse cx="137" cy="110" rx="8" ry="4.5" fill={C.skinLight} opacity="0.28" />
              </g>

              {/* cabelo: touca de cachos, com a linha do cabelo em y≈71 */}
              <path
                d="M86 78 C82 55 98 43 120 43 C142 43 158 55 154 78 C152 69 148 65 143 63 C136 70 128 72 120 71 C111 72 103 70 97 63 C92 65 88 69 86 78 Z"
                fill={C.hair}
              />
              {CURLS.map(([cx, cy, r], i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={i % 4 === 0 ? C.hairLight : C.hair}
                />
              ))}
              <circle cx="110" cy="50" r="2.6" fill={C.hairLight} opacity="0.85" />
              <circle cx="133" cy="53" r="2.2" fill={C.hairLight} opacity="0.75" />

              {/* sobrancelhas marcadas */}
              <path
                d="M98 85 C104 80.5 112 80 117 82.5"
                stroke={C.brow}
                strokeWidth="4.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M123 82.5 C128 80 136 80.5 142 85"
                stroke={C.brow}
                strokeWidth="4.2"
                strokeLinecap="round"
                fill="none"
              />

              {/* olhos */}
              <g style={{ transform: `translate(${gazeX}px, ${gazeY}px)` }}>
                <ellipse cx="107" cy="94" rx="6.6" ry="4.3" fill="#ffffff" />
                <ellipse cx="133" cy="94" rx="6.6" ry="4.3" fill="#ffffff" />
                <circle cx="107" cy="94" r="3.4" fill={C.iris} />
                <circle cx="133" cy="94" r="3.4" fill={C.iris} />
                <circle cx="107" cy="94" r="1.6" fill={C.pupil} />
                <circle cx="133" cy="94" r="1.6" fill={C.pupil} />
                <circle cx="108.6" cy="92.4" r="1.1" fill="#ffffff" />
                <circle cx="134.6" cy="92.4" r="1.1" fill="#ffffff" />
              </g>
              {/* pálpebras: fechadas por um instante, de tempos em tempos */}
              <rect
                className="anim-blink"
                x="100"
                y="89.3"
                width="14"
                height="9.4"
                rx="4.5"
                fill={C.skin}
              />
              <rect
                className="anim-blink-2"
                x="126"
                y="89.3"
                width="14"
                height="9.4"
                rx="4.5"
                fill={C.skin}
              />

              {/* nariz */}
              <path
                d="M120 97 C118 103 116 107 119 109"
                stroke={C.skinShade}
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
              <ellipse cx="116" cy="110" rx="1.5" ry="1" fill={C.skinShade} />
              <ellipse cx="124" cy="110" rx="1.5" ry="1" fill={C.skinShade} />

              {/* bigode: dois lobos com uma falha no centro */}
              <path
                d="M107 114 C111 109 117 108.5 120 111 C123 108.5 129 109 133 114 C127 115.8 113 115.8 107 114 Z"
                fill={C.hair}
              />

              {/* sorriso aberto, com os dentes ocupando a maior parte */}
              <path d="M107 117 C113 128 127 128 133 117 Z" fill={C.mouth} />
              <path d="M108.8 117.6 C114 123.4 126 123.4 131.2 117.6 Z" fill={C.teeth} />

              {/* cavanhaque e barba rala acompanhando só o queixo */}
              <ellipse cx="120" cy="129.5" rx="4.2" ry="4.6" fill={C.hair} />
              <path
                d="M105 124 C108 132 113 136.5 120 137.5 C127 136.5 132 132 135 124"
                fill="none"
                stroke={C.hair}
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity="0.22"
              />
                </>
              )}

              {/* ---------- cérebro: origem das ideias ---------- */}
              <circle cx={BRAIN.x} cy={BRAIN.y} r="14" fill={url("brainGlow")} />
              <circle
                className="anim-brain-ring"
                cx={BRAIN.x}
                cy={BRAIN.y}
                r="9"
                fill="none"
                stroke={C.trim}
                strokeWidth="1.3"
              />
              <circle
                key={pulseKey}
                className="anim-brain-flash"
                cx={BRAIN.x}
                cy={BRAIN.y}
                r="8"
                fill="none"
                stroke={C.ink}
                strokeWidth="1.6"
              />
              <circle cx={BRAIN.x} cy={BRAIN.y} r="3.4" fill={C.ink} />
              {/* sinapses */}
              <path
                d={`M${BRAIN.x - 12} ${BRAIN.y + 6} L${BRAIN.x} ${BRAIN.y} L${BRAIN.x + 13} ${BRAIN.y + 4} M${BRAIN.x} ${BRAIN.y} L${BRAIN.x + 5} ${BRAIN.y - 10}`}
                stroke={C.trim}
                strokeWidth="1"
                fill="none"
                opacity="0.6"
              />
              <circle cx={BRAIN.x - 12} cy={BRAIN.y + 6} r="1.7" fill={C.trim} className="anim-spark" />
              <circle
                cx={BRAIN.x + 13}
                cy={BRAIN.y + 4}
                r="1.7"
                fill={C.ink}
                className="anim-spark"
                style={{ animationDelay: "0.5s" }}
              />
              <circle
                cx={BRAIN.x + 5}
                cy={BRAIN.y - 10}
                r="1.4"
                fill={C.trim}
                className="anim-spark"
                style={{ animationDelay: "1s" }}
              />
            </g>
          </g>

          {/* ---------- notebook ---------- */}
          {/* tampa vista por trás: cinza, para não virar um bloco branco no tronco */}
          <path
            d="M84 200 h72 l12 40 H72 Z"
            fill={C.device}
            stroke={C.deviceEdge}
            strokeWidth="1.4"
          />
          <path
            d="M91 206 h58 l8 28 H83 Z"
            fill={url("screenGrad")}
            stroke={C.deviceEdge}
            strokeWidth="0.8"
          />
          <g opacity="0.85" className="anim-screen">
            <rect x="95" y="212" width="26" height="2.4" rx="1.2" fill={C.ink} opacity="0.7" />
            <rect x="95" y="218" width="38" height="2.4" rx="1.2" fill={C.trim} opacity="0.5" />
            <rect x="95" y="224" width="20" height="2.4" rx="1.2" fill={C.ink} opacity="0.55" />
          </g>

          <path
            d="M72 240 h96 l14 11 H58 Z"
            fill={C.device}
            stroke={C.deviceEdge}
            strokeWidth="1.4"
          />
          <path d="M80 243.5 h80 l6 4.5 H74 Z" fill="#ffffff" opacity="0.65" />

          {/* mesa */}
          <rect x="0" y="251" width="240" height="2.5" rx="1.25" fill={C.deviceEdge} />

          {/* braços digitando — por último, para as mãos ficarem visíveis */}
          <g className="anim-type-l">
            <path
              d="M93 170 C 78 194, 80 220, 99 238"
              fill="none"
              stroke={C.shirtLight}
              strokeWidth="11"
              strokeLinecap="round"
            />
            <rect x="91" y="233" width="18" height="10" rx="5" fill={C.skin} />
          </g>
          <g className="anim-type-r">
            <path
              d="M147 170 C 162 194, 160 220, 141 238"
              fill="none"
              stroke={C.shirtLight}
              strokeWidth="11"
              strokeLinecap="round"
            />
            <rect x="131" y="233" width="18" height="10" rx="5" fill={C.skin} />
          </g>
        </g>
      </svg>

      {/* âncora do cérebro para o overlay de linhas — ver PhotoHead abaixo */}
      <span
        ref={brainRef}
        aria-hidden
        className="pointer-events-none absolute h-0 w-0"
        style={{ left: BRAIN_ANCHOR.left, top: BRAIN_ANCHOR.top }}
      />
    </div>
  );
}

/** Cabeça com a foto real recortada no círculo, com anel de contorno. */
function PhotoHead({
  src,
  clip,
  ring,
}: {
  src: string;
  clip: string;
  ring: string;
}) {
  return (
    <g>
      <g clipPath={clip}>
        <image
          href={src}
          x={faceX}
          y={faceY}
          width={faceSize}
          height={faceSize}
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
      <circle
        cx={FACE.cx}
        cy={FACE.cy}
        r={FACE.r}
        fill="none"
        stroke={ring}
        strokeWidth="2.4"
      />
      <circle
        cx={FACE.cx}
        cy={FACE.cy}
        r={FACE.r + 5}
        fill="none"
        stroke="#4f46e5"
        strokeOpacity="0.22"
        strokeWidth="1.2"
        strokeDasharray="3 7"
      />
    </g>
  );
}
