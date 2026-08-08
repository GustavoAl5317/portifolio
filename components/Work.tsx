"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Character } from "./Character";
import { ProjectMedia } from "./ProjectMedia";
import { Reveal } from "./Reveal";
import { projects } from "@/lib/projects";
import { ui, useLang } from "@/lib/i18n";

type Line = {
  id: string;
  d: string;
  /** ponto onde a linha encosta no card */
  tx: number;
  ty: number;
  /** ponto para o rótulo da ideia */
  lx: number;
  ly: number;
  strength: number;
  active: boolean;
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** Ponto de uma bézier cúbica em t — usado para posicionar o rótulo na curva. */
function bezierAt(
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
): [number, number] {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ];
}

export function Work() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const brainRef = useRef<HTMLSpanElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const frame = useRef(0);

  const [box, setBox] = useState({ w: 0, h: 0 });
  const [lines, setLines] = useState<Line[]>([]);
  const [active, setActive] = useState(0);

  const measure = useCallback(() => {
    const section = sectionRef.current;
    const brain = brainRef.current;
    if (!section || !brain) return;

    // Abaixo de lg o personagem sai da coluna lateral: sem linhas para desenhar.
    if (window.innerWidth < 1024) {
      setLines((prev) => (prev.length ? [] : prev));
      return;
    }

    const s = section.getBoundingClientRect();
    const b = brain.getBoundingClientRect();
    setBox((prev) =>
      Math.abs(prev.w - s.width) > 1 || Math.abs(prev.h - s.height) > 1
        ? { w: s.width, h: s.height }
        : prev,
    );

    const bx = b.left - s.left;
    const by = b.top - s.top;
    const viewCenter = window.innerHeight / 2;

    let bestIdx = 0;
    let bestDist = Number.POSITIVE_INFINITY;

    const next: Line[] = [];
    projects.forEach((p, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const r = el.getBoundingClientRect();

      // Ignora cards muito longe da tela — nem calcula a curva.
      if (r.bottom < -window.innerHeight || r.top > window.innerHeight * 2) return;

      const tx = r.left - s.left;
      const ty = r.top + Math.min(r.height / 2, 74) - s.top;
      const cardCenter = r.top + r.height / 2;
      const dist = Math.abs(cardCenter - viewCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }

      const strength = clamp(1 - dist / (window.innerHeight * 0.85), 0.06, 1);
      const span = tx - bx;
      const p0: [number, number] = [bx, by];
      const p1: [number, number] = [bx + span * 0.42, by + (ty - by) * 0.06];
      const p2: [number, number] = [bx + span * 0.55, ty - (ty - by) * 0.1];
      const p3: [number, number] = [tx, ty];
      const [lx, ly] = bezierAt(0.52, p0, p1, p2, p3);

      next.push({
        id: p.id,
        d: `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} C${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)} ${p3[0].toFixed(1)},${p3[1].toFixed(1)}`,
        tx,
        ty,
        lx,
        ly,
        strength,
        active: false,
      });
    });

    const activeId = projects[bestIdx]?.id;
    for (const line of next) line.active = line.id === activeId;

    setActive(bestIdx);
    setLines(next);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // O rAF só agrupa as rajadas de scroll; resize e volta de aba medem direto,
    // porque rAF não roda enquanto a aba está em segundo plano.
    const schedule = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(measure);
    };

    // O ResizeObserver dispara já na primeira observação — é a medida inicial —
    // e cobre a seção mudando de altura (trocar de idioma muda o texto).
    const ro = new ResizeObserver(measure);
    ro.observe(section);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", measure);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", measure);
    };
  }, [measure]);

  const activeProject = projects[active];

  return (
    <section id="work" ref={sectionRef} className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
            {t(ui.workKicker)}
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            {t(ui.workTitle)}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {t(ui.workSub)}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)] lg:gap-16">
          {/* coluna do personagem — acompanha a rolagem */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <Character brainRef={brainRef} pulseKey={active} />
              <div className="mt-4 rounded-xl border border-borderline bg-surface px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {activeProject ? t(activeProject.spark) : ""}
                  <span className="caret ml-0.5 text-accent">_</span>
                </p>
              </div>
            </div>
          </div>

          {/* cards */}
          <div className="space-y-8">
            {projects.map((p, i) => (
              <article
                key={p.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                data-active={i === active}
                className="card relative overflow-hidden rounded-2xl border border-borderline bg-background p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-full border border-borderline px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    {t(p.category)}
                  </span>
                  <span className="font-mono text-[10px] text-muted">
                    {p.year}
                  </span>
                  {p.confidential && (
                    <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-700">
                      {t(ui.confidential)}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                  {t(p.title)}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">
                  {t(p.summary)}
                </p>

                {/* captura real, telefone, aviso ou diagrama do fluxo */}
                <ProjectMedia project={p} />

                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                  {t(ui.highlightsLabel)}
                </p>
                <ul className="mt-3 space-y-2">
                  {p.highlights.map((h, hi) => (
                    <li key={hi} className="flex gap-3 text-sm leading-relaxed">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span className="text-foreground/85">{t(h)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-borderline bg-surface px-2.5 py-1 font-mono text-[11px] text-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* overlay: as ideias saindo do cérebro até cada projeto */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 hidden lg:block"
        width={box.w}
        height={box.h}
        viewBox={`0 0 ${box.w || 1} ${box.h || 1}`}
      >
        <defs>
          <linearGradient id="ideaGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#4f46e5" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {lines.map((line, i) => {
          const project = projects.find((p) => p.id === line.id);
          return (
            <g key={line.id} style={{ opacity: line.strength }}>
              <path
                className="idea-base"
                d={line.d}
                style={{ opacity: line.active ? 1 : 0.3 }}
              />
              {line.active && (
                <path
                  className="idea-comet"
                  pathLength={100}
                  d={line.d}
                  style={{ animationDelay: `${(i % 3) * 0.25}s` }}
                />
              )}
              <circle
                className="idea-node"
                cx={line.tx}
                cy={line.ty}
                r={line.active ? 4.5 : 2.4}
                fill={line.active ? "#4f46e5" : "#7c3aed"}
                opacity={line.active ? 1 : 0.45}
              />
              {line.active && project && (
                <text
                  x={line.lx}
                  y={line.ly - 9}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize="10"
                  letterSpacing="1.4"
                  fill="#4f46e5"
                  stroke="#ffffff"
                  strokeWidth="4"
                  paintOrder="stroke"
                >
                  {t(project.spark).toUpperCase()}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </section>
  );
}
