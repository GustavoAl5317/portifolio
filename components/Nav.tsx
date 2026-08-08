"use client";

import { useEffect, useState } from "react";
import { ui, useLang } from "@/lib/i18n";

const links = [
  { href: "#work", label: ui.navWork },
  { href: "#about", label: ui.navAbout },
  { href: "#stack", label: ui.navStack },
  { href: "#contact", label: ui.navContact },
];

export function Nav() {
  const { t, lang, setLang } = useLang();
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-borderline bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-borderline bg-surface font-mono text-xs text-accent">
            GS
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-accent anim-spark" />
          </span>
          <span className="hidden font-mono text-sm tracking-tight text-foreground sm:block">
            Gustavo Alves Santana
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
                >
                  {t(l.label)}
                </a>
              </li>
            ))}
          </ul>

          <div
            className="ml-1 flex items-center rounded-lg border border-borderline bg-surface p-0.5"
            role="group"
            aria-label="Idioma / Language"
          >
            {(["pt", "en"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`rounded-md px-2.5 py-1 font-mono text-[11px] uppercase transition-colors ${
                  lang === code
                    ? "bg-accent text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
