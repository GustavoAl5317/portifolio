"use client";

import { useId } from "react";
import { useLang } from "@/lib/i18n";
import type { Diagram, Text } from "@/lib/projects";

const P = {
  node: "#ffffff",
  edge: "#d9e0ee",
  ink: "#0d1526",
  muted: "#5a6880",
  accent: "#4f46e5",
  accent2: "#7c3aed",
  hubFill: "#eef0fe",
  wire: "#c3cde0",
};

const W = 420;
const H = 200;
const NODE_H = 30;
const HUB = { x: 148, y: 68, w: 124, h: 64 };

/** Distribui 1 a 3 caixas verticalmente, centradas na altura do diagrama. */
function rows(count: number): number[] {
  if (count <= 1) return [H / 2 - NODE_H / 2];
  if (count === 2) return [42, 128];
  return [16, H / 2 - NODE_H / 2, 154];
}

export function ProjectArt({ diagram }: { diagram: Diagram }) {
  const { t } = useLang();
  const uid = useId().replace(/:/g, "");
  const tx = (value: Text) => (typeof value === "string" ? value : t(value));

  const sourceRows = rows(diagram.sources.length);
  const targetRows = rows(diagram.targets.length);
  const hubMidY = HUB.y + HUB.h / 2;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      // min-width: abaixo disso os rótulos das caixas ficariam ilegíveis,
      // então o diagrama rola na horizontal dentro do card.
      className="h-auto w-full min-w-[400px]"
      role="img"
      aria-label={tx(diagram.hub.title)}
    >
      <defs>
        <linearGradient id={`hub-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f5ff" />
          <stop offset="100%" stopColor={P.hubFill} />
        </linearGradient>
      </defs>

      {/* fios: origem -> hub */}
      {sourceRows.map((y, i) => (
        <Wire
          key={`s${i}`}
          from={[98, y + NODE_H / 2]}
          to={[HUB.x, hubMidY]}
          delay={i * 0.25}
        />
      ))}

      {/* fios: hub -> destinos */}
      {!diagram.locked &&
        targetRows.map((y, i) => (
          <Wire
            key={`t${i}`}
            from={[HUB.x + HUB.w, hubMidY]}
            to={[316, y + NODE_H / 2]}
            delay={0.4 + i * 0.25}
            tone={P.accent2}
          />
        ))}
      {diagram.locked && (
        <Wire from={[HUB.x + HUB.w, hubMidY]} to={[316, hubMidY]} delay={0.4} tone={P.accent2} />
      )}

      {/* caixas de origem */}
      {diagram.sources.map((label, i) => (
        <Box key={`sb${i}`} x={6} y={sourceRows[i]} w={92} label={tx(label)} />
      ))}

      {/* o sistema construído */}
      <rect
        x={HUB.x}
        y={HUB.y}
        width={HUB.w}
        height={HUB.h}
        rx="12"
        fill={`url(#hub-${uid})`}
        stroke={P.accent}
        strokeWidth="1.6"
      />
      <text
        x={HUB.x + HUB.w / 2}
        y={diagram.hub.sub ? HUB.y + 27 : HUB.y + 36}
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill={P.ink}
      >
        {tx(diagram.hub.title)}
      </text>
      {diagram.hub.sub && (
        <text
          x={HUB.x + HUB.w / 2}
          y={HUB.y + 44}
          textAnchor="middle"
          fontSize="9"
          className="font-mono"
          fill={P.accent}
          letterSpacing="0.6"
        >
          {tx(diagram.hub.sub)}
        </text>
      )}

      {/* destinos */}
      {!diagram.locked &&
        diagram.targets.map((label, i) => (
          <Box
            key={`tb${i}`}
            x={316}
            y={targetRows[i]}
            w={98}
            label={tx(label)}
            tone={P.accent2}
          />
        ))}

      {/* painel sob NDA: existe, mas não se mostra */}
      {diagram.locked && (
        <g>
          <rect
            x={316}
            y={hubMidY - 40}
            width={98}
            height={80}
            rx="10"
            fill={P.node}
            stroke={P.edge}
            strokeWidth="1.2"
          />
          <g opacity="0.28">
            <rect x={328} y={hubMidY - 24} width={40} height={5} rx="2.5" fill={P.accent} />
            <rect x={328} y={hubMidY - 12} width={62} height={5} rx="2.5" fill={P.muted} />
            <rect x={328} y={hubMidY} width={30} height={5} rx="2.5" fill={P.accent2} />
            <rect x={328} y={hubMidY + 12} width={54} height={5} rx="2.5" fill={P.muted} />
          </g>
          <g transform={`translate(${365 - 8}, ${hubMidY + 20})`}>
            <rect x="0" y="5" width="16" height="12" rx="2.5" fill={P.muted} />
            <path
              d="M3 5 V3.5 A5 5 0 0 1 13 3.5 V5"
              fill="none"
              stroke={P.muted}
              strokeWidth="2"
            />
          </g>
          <text
            x={365}
            y={hubMidY - 30}
            textAnchor="middle"
            fontSize="8.5"
            className="font-mono"
            fill={P.muted}
            letterSpacing="1"
          >
            {tx(diagram.locked)}
          </text>
        </g>
      )}
    </svg>
  );
}

function Box({
  x,
  y,
  w,
  label,
  tone = P.accent,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  tone?: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={NODE_H}
        rx="9"
        fill={P.node}
        stroke={P.edge}
        strokeWidth="1.2"
      />
      <rect x={x} y={y + 8} width="3" height={NODE_H - 16} rx="1.5" fill={tone} />
      <text
        x={x + w / 2 + 2}
        y={y + NODE_H / 2 + 3.5}
        textAnchor="middle"
        fontSize="10"
        fill={P.ink}
      >
        {label}
      </text>
    </g>
  );
}

/** Curva entre duas caixas, com o tracejado correndo no sentido do fluxo. */
function Wire({
  from,
  to,
  delay = 0,
  tone = P.accent,
}: {
  from: [number, number];
  to: [number, number];
  delay?: number;
  tone?: string;
}) {
  const dx = (to[0] - from[0]) * 0.55;
  const d = `M${from[0]},${from[1]} C${from[0] + dx},${from[1]} ${to[0] - dx},${to[1]} ${to[0]},${to[1]}`;
  return (
    <g>
      <path d={d} fill="none" stroke={P.wire} strokeWidth="1.4" />
      <path
        className="anim-flow"
        d={d}
        fill="none"
        stroke={tone}
        strokeWidth="1.8"
        strokeLinecap="round"
        style={{ animationDelay: `${delay}s` }}
      />
      <circle cx={to[0]} cy={to[1]} r="2.6" fill={tone} />
    </g>
  );
}
