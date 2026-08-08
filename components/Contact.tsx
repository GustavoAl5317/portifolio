"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { ui, useLang } from "@/lib/i18n";
import { site, socialLinks } from "@/lib/site";

export function Contact() {
  const { t, lang } = useLang();
  const [copied, setCopied] = useState(false);
  const links = socialLinks();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Sem permissão de clipboard: o link mailto ao lado continua funcionando.
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-borderline bg-surface p-8 sm:p-14">
            <div className="pointer-events-none absolute inset-0 -z-10 wash opacity-60" />

            <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
              {t(ui.contactKicker)}
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {t(ui.contactTitle)}
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted">{t(ui.contactSub)}</p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${site.email}`}
                className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
              >
                {t(ui.contactEmail)}
              </a>
              <button
                type="button"
                onClick={copy}
                className="rounded-xl border border-borderline bg-background/60 px-5 py-3 font-mono text-sm text-muted transition-colors hover:border-accent/50 hover:text-foreground"
              >
                {copied ? t(ui.copied) : site.email}
              </button>
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-xl border border-borderline bg-background/60 px-5 py-3 text-sm text-muted transition-colors hover:border-accent/50 hover:text-foreground"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <footer className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-borderline pt-8 text-sm text-muted sm:flex-row">
          <p className="font-mono text-xs">
            © {new Date().getFullYear()} {site.name} ·{" "}
            {lang === "pt" ? site.location.pt : site.location.en}
          </p>
          <p className="font-mono text-xs">{t(ui.rights)}</p>
        </footer>
      </div>
    </section>
  );
}
