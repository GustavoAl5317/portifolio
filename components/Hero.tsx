"use client";

import { Character } from "./Character";
import { ScrollSequence } from "./ScrollSequence";
import { ui, useLang } from "@/lib/i18n";
import { projects } from "@/lib/projects";

/**
 * Opacidade de um bloco de texto dentro da faixa [a, b] do scroll,
 * com uma rampa de entrada e saída de `ramp`.
 */
function band(p: number, a: number, b: number, ramp = 0.09) {
  if (p <= a - ramp || p >= b + ramp) return 0;
  if (p < a) return (p - (a - ramp)) / ramp;
  if (p > b) return 1 - (p - b) / ramp;
  return 1;
}

export function Hero() {
  return (
    <section id="top" className="relative">
      <ScrollSequence fallback={<StaticHero />}>
        {(progress) => <SequenceCopy progress={progress} />}
      </ScrollSequence>
    </section>
  );
}

/** Camadas de texto que entram e saem enquanto a sequência é rolada. */
function SequenceCopy({ progress }: { progress: number }) {
  const { t } = useLang();

  const first = band(progress, 0, 0.24);
  const second = band(progress, 0.38, 0.6);
  const third = band(progress, 0.74, 1);

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
        <div
          className="absolute inset-x-6 top-1/2 mx-auto max-w-3xl -translate-y-1/2 sm:inset-x-10"
          style={{ opacity: first, visibility: first ? "visible" : "hidden" }}
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-borderline bg-surface px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent backdrop-blur">
            <span className="anim-spark h-1.5 w-1.5 rounded-full bg-accent" />
            {t(ui.heroKicker)}
          </p>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block">{t(ui.heroLine1)}</span>
            <span className="block">{t(ui.heroLine2)}</span>
            <span className="block bg-gradient-to-r from-accent via-accent2 to-cyan-600 bg-clip-text text-transparent">
              {t(ui.heroLine3)}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted sm:mx-0">
            {t(ui.heroSub)}
          </p>
          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
            ↓ {t(ui.scrollHint)}
          </p>
        </div>

        <div
          className="absolute inset-x-6 top-1/2 mx-auto max-w-2xl -translate-y-1/2 text-center sm:inset-x-10"
          style={{ opacity: second, visibility: second ? "visible" : "hidden" }}
        >
          <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {t(ui.heroPhase2)}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg text-muted">
            {t(ui.heroPhase2Sub)}
          </p>
        </div>

        <div
          className="pointer-events-auto absolute inset-x-6 top-1/2 mx-auto max-w-2xl -translate-y-1/2 text-center sm:inset-x-10"
          style={{ opacity: third, visibility: third ? "visible" : "hidden" }}
        >
          <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {t(ui.heroPhase3)}
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#work"
              className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
            >
              {t(ui.heroCtaWork)}
            </a>
            <a
              href="#contact"
              className="rounded-xl border border-borderline bg-surface px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/50"
            >
              {t(ui.heroCtaTalk)}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Hero usado enquanto não existir sequência em public/sequence. */
function StaticHero() {
  const { t } = useLang();

  return (
    <div className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10 wash" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        {/* no mobile tudo vem centralizado; a partir de sm volta a alinhar à esquerda */}
        <div className="text-center sm:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-borderline bg-surface px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            <span className="anim-spark h-1.5 w-1.5 rounded-full bg-accent" />
            {t(ui.heroKicker)}
          </p>

          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block">{t(ui.heroLine1)}</span>
            <span className="block">{t(ui.heroLine2)}</span>
            <span className="block bg-gradient-to-r from-accent via-accent2 to-cyan-600 bg-clip-text text-transparent">
              {t(ui.heroLine3)}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted sm:mx-0">
            {t(ui.heroSub)}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <a
              href="#work"
              className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
            >
              {t(ui.heroCtaWork)}
            </a>
            <a
              href="#contact"
              className="rounded-xl border border-borderline bg-surface px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/50"
            >
              {t(ui.heroCtaTalk)}
            </a>
          </div>

          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
            ↓ {t(ui.scrollHint)}
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-accent/5 blur-3xl" />
          <Character pulseKey={projects.length} />
        </div>
      </div>
    </div>
  );
}
