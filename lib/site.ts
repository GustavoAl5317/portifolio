/**
 * Dados pessoais do site. Preencha os campos vazios — links em branco
 * simplesmente não aparecem na página, então nada quebra se ficarem assim.
 */
export const site = {
  name: "Gustavo Alves Santana",
  role: {
    pt: "Desenvolvedor de integrações & IA",
    en: "Integrations & AI developer",
  },
  email: "gsantana.dev@hotmail.com",
  /** Ex.: "https://github.com/seu-usuario" */
  github: "",
  /** Ex.: "https://linkedin.com/in/seu-perfil" */
  linkedin: "",
  /** Só os dígitos com DDI. */
  whatsapp: "5511939146680",
  whatsappDisplay: "+55 11 93914-6680",
  /** Ex.: "https://gustavo.dev" — usado nas metatags */
  url: "https://gustavosantana.dev",
  location: { pt: "Brasil · Remoto", en: "Brazil · Remote" },
};

export type SocialLink = { label: string; href: string };

export function socialLinks(): SocialLink[] {
  return [
    { label: "GitHub", href: site.github },
    { label: "LinkedIn", href: site.linkedin },
    {
      label: site.whatsappDisplay || "WhatsApp",
      href: site.whatsapp ? `https://wa.me/${site.whatsapp}` : "",
    },
  ].filter((l) => l.href.length > 0);
}
