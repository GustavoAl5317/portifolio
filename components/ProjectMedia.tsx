"use client";

import { useEffect, useState } from "react";
import { ProjectArt } from "./ProjectArt";
import { ui, useLang } from "@/lib/i18n";
import type { Project } from "@/lib/projects";

/**
 * A arte do card, em ordem de prioridade: aviso de indisponibilidade,
 * cartão de chamada, captura real da tela e, por fim, o diagrama do fluxo.
 */
export function ProjectMedia({ project }: { project: Project }) {
  const { t } = useLang();

  if (project.unavailable) {
    return <Unavailable reason={t(project.unavailable)} />;
  }

  if (project.phone) {
    return (
      <PhoneCard
        dial={project.phone.dial}
        display={project.phone.display}
        label={t(project.phone.label)}
        cta={t(ui.callNow)}
      />
    );
  }

  if (project.shot) {
    return (
      <Shot
        src={project.shot.src}
        alt={t(project.shot.alt)}
        caption={t(ui.shotCaption)}
        fallback={<Frame><ProjectArt diagram={project.diagram} /></Frame>}
      />
    );
  }

  return (
    <Frame>
      <ProjectArt diagram={project.diagram} />
    </Frame>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-borderline bg-surface p-3 sm:p-4">
      {children}
    </div>
  );
}

/** Captura de tela; enquanto o arquivo não existir, mostra o diagrama. */
function Shot({
  src,
  alt,
  caption,
  fallback,
}: {
  src: string;
  alt: string;
  caption: string;
  fallback: React.ReactNode;
}) {
  // undefined = ainda verificando, true = existe, false = ainda não foi salva.
  const [exists, setExists] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const probe = new window.Image();
    probe.onload = () => !cancelled && setExists(true);
    probe.onerror = () => !cancelled && setExists(false);
    probe.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (exists === false) return <>{fallback}</>;

  return (
    <figure className="mt-6">
      <div className="overflow-hidden rounded-xl border border-borderline bg-surface2">
        {/* barra de janela, para a captura parecer um app e não um print solto */}
        <div className="flex items-center gap-1.5 border-b border-borderline bg-surface px-3.5 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        {exists === undefined ? (
          <div className="aspect-[16/9] w-full animate-pulse bg-surface2" />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element -- captura estática */
          <img
            src={src}
            alt={alt}
            className="block h-auto w-full max-w-full"
            loading="lazy"
          />
        )}
      </div>
      <figcaption className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}

/** Sistema que dá para testar ligando: número em destaque e botão de chamada. */
function PhoneCard({
  dial,
  display,
  label,
  cta,
}: {
  dial: string;
  display: string;
  label: string;
  cta: string;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-borderline bg-surface p-6">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
        <RingingPhone />
        <div className="min-w-0 text-center sm:text-left">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            {label}
          </p>
          <a
            href={`tel:${dial}`}
            className="mt-1.5 block text-2xl font-semibold tracking-tight text-foreground transition-colors hover:text-accent sm:text-3xl"
          >
            {display}
          </a>
          <a
            href={`tel:${dial}`}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M3.4 1.3 5 1a1 1 0 0 1 1.1.6l.9 2a1 1 0 0 1-.25 1.15l-.9.8a9.5 9.5 0 0 0 4.6 4.6l.8-.9a1 1 0 0 1 1.15-.25l2 .9A1 1 0 0 1 15 11l-.3 1.6a1.4 1.4 0 0 1-1.5 1.1A12.2 12.2 0 0 1 2.3 2.8a1.4 1.4 0 0 1 1.1-1.5Z" />
            </svg>
            {cta}
          </a>
        </div>
      </div>
    </div>
  );
}

/** Telefone tocando: ondas saindo do aparelho, em loop. */
function RingingPhone() {
  return (
    <svg viewBox="0 0 140 140" className="h-32 w-32 shrink-0" aria-hidden>
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          className="anim-ring"
          cx="70"
          cy="70"
          r="26"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="1.6"
          style={{ animationDelay: `${i * 0.6}s` }}
        />
      ))}
      <rect x="49" y="30" width="42" height="80" rx="9" fill="#2b3242" />
      <rect x="52.5" y="36" width="35" height="66" rx="5" fill="#f7f9fc" />
      <circle cx="70" cy="106" r="2.4" fill="#5a6880" />

      {/* onda de voz na tela */}
      <g className="anim-wave">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={58 + i * 5.5}
            y={62 - (i % 2 ? 9 : 5)}
            width="3"
            height={i % 2 ? 18 : 10}
            rx="1.5"
            fill={i % 2 ? "#4f46e5" : "#7c3aed"}
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </g>
      <text
        x="70"
        y="92"
        textAnchor="middle"
        fontSize="7"
        className="font-mono"
        fill="#5a6880"
        letterSpacing="0.6"
      >
        IA
      </text>
    </svg>
  );
}

/** Não há imagem a mostrar — e o motivo fica explícito. */
function Unavailable({ reason }: { reason: string }) {
  return (
    <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-borderline bg-surface px-6 py-12 text-center">
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-muted" fill="none" aria-hidden>
        <path
          d="M12 2.5 4.5 5.5v6c0 4.6 3.1 8.6 7.5 10 4.4-1.4 7.5-5.4 7.5-10v-6L12 2.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 11.5v-1.8a2.5 2.5 0 0 1 5 0v1.8"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect x="8.5" y="11.5" width="7" height="5.5" rx="1.5" fill="currentColor" />
      </svg>
      <p className="max-w-xs text-sm text-muted">{reason}</p>
    </div>
  );
}
