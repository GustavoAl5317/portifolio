"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Lang = "pt" | "en";

/** Texto que muda de idioma: `{ pt: "...", en: "..." }` */
export type L10n = Record<Lang, string>;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** Resolve um par PT/EN para o idioma ativo. */
  t: (value: L10n) => string;
};

const LangContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "portfolio-lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");
  // Preferência salva (ou idioma do navegador) só pode ser lida depois da
  // hidratação; o servidor sempre renderiza em pt para não haver mismatch.
  const [hydrated, setHydrated] = useState(false);

  if (!hydrated && typeof window !== "undefined") {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const preferred: Lang =
      saved === "pt" || saved === "en"
        ? saved
        : navigator.language.toLowerCase().startsWith("pt")
          ? "pt"
          : "en";
    setHydrated(true);
    if (preferred !== lang) setLangState(preferred);
  }

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(
    () => setLangState((l) => (l === "pt" ? "en" : "pt")),
    [],
  );
  const t = useCallback((value: L10n) => value[lang], [lang]);

  const value = useMemo(
    () => ({ lang, setLang, toggle, t }),
    [lang, setLang, toggle, t],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang precisa estar dentro de <LangProvider>");
  return ctx;
}

/** Strings de interface (tudo que não é conteúdo de projeto). */
export const ui = {
  navWork: { pt: "Projetos", en: "Work" },
  navAbout: { pt: "Sobre", en: "About" },
  navStack: { pt: "Stack", en: "Stack" },
  navContact: { pt: "Contato", en: "Contact" },

  heroKicker: { pt: "Desenvolvedor de integrações & IA", en: "Integrations & AI developer" },
  heroLine1: { pt: "Eu conecto", en: "I connect" },
  heroLine2: { pt: "sistemas que", en: "systems that" },
  heroLine3: { pt: "não se falavam.", en: "never talked." },
  heroSub: {
    pt: "APIs, ERPs, CRMs e agentes de IA costurados em automações que rodam sozinhas — 24 horas por dia, sem ninguém segurando a mão.",
    en: "APIs, ERPs, CRMs and AI agents stitched into automations that run on their own — 24/7, with nobody holding their hand.",
  },
  heroCtaWork: { pt: "Ver projetos", en: "See the work" },
  heroCtaTalk: { pt: "Falar comigo", en: "Get in touch" },
  scrollHint: { pt: "role para ver as ideias saindo", en: "scroll to watch the ideas fire" },

  // Textos que aparecem em fases, conforme a sequência do hero é rolada.
  heroPhase2: {
    pt: "Tudo é peça encaixando em peça.",
    en: "Everything is one part fitting into another.",
  },
  heroPhase2Sub: {
    pt: "ERP, CRM, telefonia, rastreador, financeiro. Separados não valem nada; conectados viram operação.",
    en: "ERP, CRM, telephony, GPS, finance. Apart they're worth nothing; wired together they become an operation.",
  },
  heroPhase3: {
    pt: "E eu monto de volta, funcionando.",
    en: "And I put it back together, working.",
  },

  workKicker: { pt: "O que eu construí", en: "What I've built" },
  workTitle: { pt: "Projetos", en: "Projects" },
  workSub: {
    pt: "Cada linha abaixo sai da minha cabeça e chega em um sistema em produção.",
    en: "Every line below leaves my head and lands on a system running in production.",
  },
  stackLabel: { pt: "Stack", en: "Stack" },
  highlightsLabel: { pt: "O que faz", en: "What it does" },
  confidential: { pt: "NDA · Confidencial", en: "NDA · Confidential" },
  shotCaption: {
    pt: "Tela do sistema em produção",
    en: "The system running in production",
  },
  callNow: { pt: "Ligar agora", en: "Call now" },

  aboutTitle: { pt: "Sobre mim", en: "About me" },
  aboutP1: {
    pt: "Sou o Gustavo. Passo o dia fazendo sistemas que não foram feitos para conversar trocarem informação sem intervenção humana: ERP com CRM, CRM com financeiro, telefonia com IA, rastreador com WhatsApp.",
    en: "I'm Gustavo. I spend my days making systems that were never meant to talk exchange data without a human in the middle: ERP to CRM, CRM to finance, telephony to AI, GPS tracker to WhatsApp.",
  },
  aboutP2: {
    pt: "Meu terreno favorito é o ponto onde a API acaba e o problema real começa — regra de negócio torta, dado sujo, cliente esperando resposta às 3 da manhã. É aí que a automação precisa aguentar o tranco.",
    en: "My favorite ground is where the API ends and the real problem starts — crooked business rules, dirty data, a customer waiting for an answer at 3am. That's where automation has to hold up.",
  },
  aboutP3: {
    pt: "Hoje trabalho principalmente com agentes de IA aplicados a atendimento, integrações entre ERPs e CRMs, e monitoramento de infraestrutura.",
    en: "Today I work mostly with AI agents for customer service, ERP/CRM integrations, and infrastructure monitoring.",
  },
  robotCaption: {
    pt: "e uma versão minha que não dorme",
    en: "and a version of me that never sleeps",
  },
  statProjects: { pt: "projetos entregues", en: "projects shipped" },
  statIntegrations: { pt: "sistemas integrados", en: "systems integrated" },
  statUptime: { pt: "atendimento sem pausa", en: "always-on service" },

  stackTitle: { pt: "Ferramentas do dia a dia", en: "Daily driver tools" },

  contactKicker: { pt: "Próximo passo", en: "Next step" },
  contactTitle: {
    pt: "Tem um sistema que precisa conversar com outro?",
    en: "Got a system that needs to talk to another one?",
  },
  contactSub: {
    pt: "Me manda o cenário. Se der para automatizar, eu te digo como — e quanto tempo leva.",
    en: "Send me the scenario. If it can be automated, I'll tell you how — and how long it takes.",
  },
  contactEmail: { pt: "Enviar e-mail", en: "Send an email" },
  copyEmail: { pt: "Copiar e-mail", en: "Copy email" },
  copied: { pt: "Copiado!", en: "Copied!" },
  rights: { pt: "Feito com Next.js, SVG e cafeína.", en: "Built with Next.js, SVG and caffeine." },
} satisfies Record<string, L10n>;
