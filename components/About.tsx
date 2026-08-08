"use client";

import { Reveal } from "./Reveal";
import { RobotMe } from "./RobotMe";
import { ui, useLang } from "@/lib/i18n";
import { projects, stackMarquee } from "@/lib/projects";

export function About() {
  const { t } = useLang();

  const stats = [
    { value: `${projects.length}+`, label: ui.statProjects },
    { value: "15+", label: ui.statIntegrations },
    { value: "24/7", label: ui.statUptime },
  ];

  return (
    <>
      <section id="about" className="relative py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
            <Reveal className="text-center sm:text-left">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
                {t(ui.aboutTitle)}
              </p>
              <div className="mx-auto mt-6 max-w-2xl space-y-5 text-center text-lg leading-relaxed text-muted sm:mx-0 sm:text-left">
                <p className="text-foreground/90">{t(ui.aboutP1)}</p>
                <p>{t(ui.aboutP2)}</p>
                <p>{t(ui.aboutP3)}</p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="mb-6 rounded-2xl border border-borderline bg-surface px-6 py-5">
                <RobotMe className="mx-auto max-w-[220px]" />
                <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {t(ui.robotCaption)}
                </p>
              </div>

              <dl className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {stats.map((s) => (
                  <div
                    key={s.value}
                    className="rounded-2xl border border-borderline bg-surface/60 p-5"
                  >
                    <dt className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-3xl font-semibold text-transparent">
                      {s.value}
                    </dt>
                    <dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                      {t(s.label)}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="stack" className="relative overflow-hidden border-y border-borderline py-14">
        <p className="mb-8 text-center font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
          {t(ui.stackTitle)}
        </p>
        <div className="relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="marquee-track flex w-max shrink-0 gap-3 pr-3">
            {[...stackMarquee, ...stackMarquee].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="whitespace-nowrap rounded-lg border border-borderline bg-surface px-4 py-2 font-mono text-sm text-muted"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
