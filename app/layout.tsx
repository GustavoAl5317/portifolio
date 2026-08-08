import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} · ${site.role.pt}`,
  description:
    "Portfólio de Gustavo Alves Santana: agentes de IA para atendimento, integrações entre ERPs e CRMs, monitoramento de infraestrutura e gateways de pagamento.",
  keywords: [
    "integrações",
    "automação",
    "IA",
    "Bitrix24",
    "Omie",
    "Bling",
    "Zabbix",
    "WhatsApp API",
    "Next.js",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: "en_US",
    title: `${site.name} · ${site.role.pt}`,
    description:
      "Agentes de IA, integrações entre sistemas e automações que rodam sozinhas.",
    siteName: site.name,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
