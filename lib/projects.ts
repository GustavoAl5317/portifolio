import type { L10n } from "./i18n";

/** Nomes de produto não traduzem; o resto vem como par PT/EN. */
export type Text = string | L10n;

/** Desenho do fluxo do projeto: origens -> sistema construído -> destinos. */
export type Diagram = {
  sources: Text[];
  hub: { title: Text; sub?: Text };
  targets: Text[];
  /** Substitui os destinos por um painel bloqueado, com este rótulo. */
  locked?: Text;
};

export type Project = {
  id: string;
  /** Rótulo curto que viaja na linha saindo do cérebro. */
  spark: L10n;
  title: L10n;
  category: L10n;
  year: string;
  summary: L10n;
  highlights: L10n[];
  stack: string[];
  /** Sempre presente: é o que aparece se não houver captura de tela. */
  diagram: Diagram;
  /** Captura real do sistema. Cai no diagrama se o arquivo não existir. */
  shot?: { src: string; alt: L10n };
  /** Sistema que dá para testar ligando — vira um cartão de chamada. */
  phone?: { dial: string; display: string; label: L10n };
  /** Substitui a arte por um aviso: não há imagem a mostrar. */
  unavailable?: L10n;
  /** Marca projetos que não podem ser detalhados/exibidos. */
  confidential?: boolean;
};

export const projects: Project[] = [
  {
    id: "juridico-ia",
    spark: { pt: "triagem jurídica", en: "legal triage" },
    title: {
      pt: "Assistente Jurídico com IA · 24/7",
      en: "AI Legal Assistant · 24/7",
    },
    category: { pt: "IA & Atendimento", en: "AI & Support" },
    year: "2025",
    summary: {
      pt: "Assistente que atende os clientes de escritórios de advocacia sozinho, todos os dias, a qualquer hora. Ele recebe o contato, entende o caso, faz a triagem por área do direito e só passa para o advogado o que realmente exige um humano.",
      en: "An assistant that handles a law firm's clients on its own, every day, at any hour. It takes the first contact, understands the case, triages it by practice area and only escalates what genuinely needs a lawyer.",
    },
    highlights: [
      {
        pt: "Triagem automática do caso e qualificação do cliente antes de chegar no advogado",
        en: "Automatic case triage and client qualification before it reaches the lawyer",
      },
      {
        pt: "Leitura de publicações e intimações no DJEN, com alerta de prazo",
        en: "Reads court publications and summons from DJEN, with deadline alerts",
      },
      {
        pt: "Integração com os sistemas jurídicos usados pelo escritório",
        en: "Integrated with the legal software the firm already uses",
      },
      {
        pt: "Cada atendimento vira card no CRM (Trello), com histórico e etapa do funil",
        en: "Every conversation becomes a CRM card (Trello) with history and pipeline stage",
      },
      {
        pt: "Handoff para atendimento humano sem perder o contexto da conversa",
        en: "Hand-off to a human without losing the conversation context",
      },
    ],
    stack: ["OpenAI", "DJEN", "Trello CRM", "WhatsApp API", "Node.js"],
    diagram: {
      sources: ["WhatsApp", { pt: "Site", en: "Website" }],
      hub: {
        title: { pt: "Assistente IA", en: "AI Assistant" },
        sub: "OpenAI · 24/7",
      },
      targets: ["DJEN", "Trello CRM", { pt: "Advogado", en: "Lawyer" }],
    },
    shot: {
      src: "/atendenteia.png",
      alt: {
        pt: "Painel de conversas do assistente jurídico, com triagem, CRM e consulta ao DJEN",
        en: "Legal assistant conversation panel, with triage, CRM and DJEN lookup",
      },
    },
  },
  {
    id: "bling-producao",
    spark: { pt: "ordem de produção", en: "production order" },
    title: {
      pt: "Gestão de Produção integrada ao Bling",
      en: "Production Management on top of Bling",
    },
    category: { pt: "ERP & Operação", en: "ERP & Operations" },
    year: "2025",
    summary: {
      pt: "Sistema que controla o chão de fábrica em cima do ERP Bling: calcula o que precisa ser comprado, quanto de cada insumo entra em cada produto e qual o custo real da ordem de produção.",
      en: "A system that runs the shop floor on top of the Bling ERP: it works out what needs to be bought, how much of each input goes into each product, and the real cost of every production order.",
    },
    highlights: [
      {
        pt: "Gerenciamento de compras de produtos e insumos com base na demanda",
        en: "Purchasing of products and raw materials driven by actual demand",
      },
      {
        pt: "Cálculo automático de composição, consumo e custo por ordem",
        en: "Automatic bill-of-materials, consumption and cost per order",
      },
      {
        pt: "Estoque e movimentações sincronizados com o Bling em tempo real",
        en: "Stock and movements kept in sync with Bling in real time",
      },
    ],
    stack: ["Bling API", "Node.js", "PostgreSQL", "REST"],
    diagram: {
      sources: [
        { pt: "Demanda", en: "Demand" },
        { pt: "Ficha técnica", en: "Bill of mat." },
      ],
      hub: {
        title: { pt: "Motor de produção", en: "Production engine" },
        sub: "Bling API",
      },
      targets: [
        { pt: "Compras", en: "Purchasing" },
        { pt: "Produção", en: "Production" },
        { pt: "Custo", en: "Costing" },
      ],
    },
    shot: {
      src: "/estoquebling.png",
      alt: {
        pt: "Relatório de reposição de estoque com sugestão de compra por produto, integrado ao Bling",
        en: "Stock replenishment report with per-product purchase suggestions, integrated with Bling",
      },
    },
  },
  {
    id: "propostas-bitrix",
    spark: { pt: "proposta gerada", en: "proposal generated" },
    title: {
      pt: "Gerador de Propostas Comerciais · Bitrix24",
      en: "Sales Proposal Generator · Bitrix24",
    },
    category: { pt: "CRM & Vendas", en: "CRM & Sales" },
    year: "2024",
    summary: {
      pt: "Aplicação conectada ao Bitrix24 pela API BX24 que transforma um negócio do funil em proposta comercial pronta: produtos, condições comerciais e documento final, sem o vendedor sair do CRM.",
      en: "An app wired into Bitrix24 through the BX24 API that turns a deal in the pipeline into a finished sales proposal: products, commercial terms and the final document, without the rep ever leaving the CRM.",
    },
    highlights: [
      {
        pt: "Puxa dados do negócio, do cliente e do catálogo direto do Bitrix24",
        en: "Pulls deal, client and catalog data straight from Bitrix24",
      },
      {
        pt: "Monta a proposta com regras de desconto e condições de pagamento",
        en: "Assembles the proposal with discount rules and payment terms",
      },
      {
        pt: "Documento anexado ao negócio e pronto para envio ao cliente",
        en: "Document attached to the deal and ready to send to the client",
      },
    ],
    stack: ["Bitrix24", "API BX24", "REST", "PDF"],
    diagram: {
      sources: [{ pt: "Negócio CRM", en: "CRM deal" }],
      hub: {
        title: { pt: "Gerador", en: "Generator" },
        sub: "API BX24",
      },
      targets: [
        { pt: "Proposta PDF", en: "PDF proposal" },
        { pt: "Anexo no CRM", en: "Back to CRM" },
      ],
    },
    shot: {
      src: "/proposta.png",
      alt: {
        pt: "Gerador de propostas com etapas do negócio, versões e exportação em PDF e Word",
        en: "Proposal generator with deal steps, versioning and PDF/Word export",
      },
    },
  },
  {
    id: "bitrix-omie",
    spark: { pt: "venda → financeiro", en: "sale → finance" },
    title: {
      pt: "Inside Sales Bitrix24 ↔ Omie",
      en: "Inside Sales Bitrix24 ↔ Omie",
    },
    category: { pt: "Integrações", en: "Integrations" },
    year: "2024",
    summary: {
      pt: "Integração que liga o funil de Inside Sales do Bitrix24 ao Omie, o sistema financeiro. Quando o negócio é ganho, o cliente, o pedido e as contas a receber nascem sozinhos do outro lado.",
      en: "An integration that ties the Bitrix24 Inside Sales pipeline to Omie, the finance system. When a deal is won, the customer, the order and the receivables are born on the other side by themselves.",
    },
    highlights: [
      {
        pt: "Negócio ganho vira cadastro de cliente e pedido no Omie",
        en: "A won deal becomes a customer record and an order in Omie",
      },
      {
        pt: "Contas a receber e faturamento gerados sem digitação manual",
        en: "Receivables and invoicing generated with zero manual typing",
      },
      {
        pt: "Sincronização bidirecional de status entre CRM e financeiro",
        en: "Two-way status sync between CRM and finance",
      },
    ],
    stack: ["Bitrix24", "API BX24", "Omie API", "Webhooks"],
    diagram: {
      sources: ["Bitrix24"],
      hub: {
        title: { pt: "Ponte", en: "Bridge" },
        sub: "Omie API",
      },
      targets: [
        { pt: "Cliente", en: "Customer" },
        { pt: "Pedido", en: "Order" },
        { pt: "A receber", en: "Receivable" },
      ],
    },
    shot: {
      src: "/interatell.png",
      alt: {
        pt: "Tela de processos puxando negócios fechados do Bitrix24 para envio ao Omie",
        en: "Process screen pulling closed Bitrix24 deals to send into Omie",
      },
    },
  },
  {
    id: "dashboards",
    spark: { pt: "dados em painel", en: "data on a panel" },
    title: {
      pt: "Dashboards corporativos · Yamaha e Ominet",
      en: "Corporate dashboards · Yamaha and Ominet",
    },
    category: { pt: "Dados & BI", en: "Data & BI" },
    year: "2024",
    summary: {
      pt: "Painéis operacionais e gerenciais construídos para grandes contas, consolidando dados de vendas, operação e indicadores em uma leitura única. As telas não podem ser exibidas por acordo de confidencialidade.",
      en: "Operational and management dashboards built for large accounts, consolidating sales, operations and KPI data into a single read. The screens can't be shown due to a confidentiality agreement.",
    },
    highlights: [
      {
        pt: "Consolidação de várias fontes de dados em um painel único",
        en: "Several data sources consolidated into a single panel",
      },
      {
        pt: "Indicadores operacionais e gerenciais atualizados automaticamente",
        en: "Operational and management KPIs refreshed automatically",
      },
      {
        pt: "Telas e números omitidos por NDA — detalhes sob conversa",
        en: "Screens and numbers withheld under NDA — details on request",
      },
    ],
    stack: ["BI", "SQL", "APIs internas"],
    diagram: {
      sources: ["ERP", "CRM", { pt: "Operação", en: "Operations" }],
      hub: {
        title: "ETL + BI",
        sub: { pt: "consolidação", en: "consolidation" },
      },
      targets: [],
      locked: { pt: "SOB NDA", en: "UNDER NDA" },
    },
    confidential: true,
  },
  {
    id: "ura-ia",
    spark: { pt: "voz que resolve", en: "a voice that solves" },
    title: {
      pt: "URA de Atendimento com IA",
      en: "AI-powered IVR Attendant",
    },
    category: { pt: "IA & Telecom", en: "AI & Telecom" },
    year: "2025",
    summary: {
      pt: "Atendente de voz para provedor de internet que resolve o chamado antes de virar fila. Ela identifica o cliente, consulta o cadastro, checa a infraestrutura e o estado do link — e só transfere para humano quando não dá para resolver sozinha.",
      en: "A voice attendant for an ISP that solves the ticket before it becomes a queue. It identifies the caller, checks their account, inspects the infrastructure and the link status — and only transfers to a human when it truly can't resolve it.",
    },
    highlights: [
      {
        pt: "Consulta de cliente, plano e faturas no SGP durante a ligação",
        en: "Looks up customer, plan and invoices in SGP during the call",
      },
      {
        pt: "Verificação de viabilidade e infraestrutura no Geosite",
        en: "Checks coverage and infrastructure in Geosite",
      },
      {
        pt: "Leitura de alarmes e status do link no Zabbix antes de abrir chamado",
        en: "Reads alarms and link status in Zabbix before opening a ticket",
      },
      {
        pt: "Resolução autônoma dos casos simples, escalada só do que precisa",
        en: "Simple cases resolved autonomously, escalation only when needed",
      },
    ],
    stack: ["OpenAI", "SGP", "Geosite", "Zabbix", "VoIP"],
    diagram: {
      sources: [{ pt: "Ligação", en: "Phone call" }],
      hub: {
        title: { pt: "URA com IA", en: "AI IVR" },
        sub: { pt: "OpenAI · voz", en: "OpenAI · voice" },
      },
      targets: ["SGP", "Geosite", "Zabbix"],
    },
    phone: {
      dial: "+558532211777",
      display: "+55 85 3221-1777",
      label: {
        pt: "Ligue e fale com a IA",
        en: "Call and talk to the AI",
      },
    },
  },
  {
    id: "rastreamento",
    spark: { pt: "carro fora da rota", en: "car off route" },
    title: {
      pt: "Monitoramento de Veículos em tempo real",
      en: "Real-time Vehicle Monitoring",
    },
    category: { pt: "Monitoramento", en: "Monitoring" },
    year: "2025",
    summary: {
      pt: "Sistema que acompanha a frota pela API do Rastreamento Popular, joga a telemetria dentro do Zabbix e avisa no WhatsApp quando alguma coisa foge do padrão — sem ninguém olhando o mapa o dia inteiro.",
      en: "A system that follows the fleet through the Rastreamento Popular API, pushes telemetry into Zabbix and pings WhatsApp whenever something goes off-pattern — with nobody staring at a map all day.",
    },
    highlights: [
      {
        pt: "Coleta contínua de posição e telemetria pela API de rastreamento",
        en: "Continuous position and telemetry collection via the tracking API",
      },
      {
        pt: "Telemetria virando métrica e trigger no Zabbix",
        en: "Telemetry turned into Zabbix metrics and triggers",
      },
      {
        pt: "Alertas no WhatsApp: veículo offline, parada indevida, desvio",
        en: "WhatsApp alerts: vehicle offline, unexpected stop, route deviation",
      },
    ],
    stack: ["Rastreamento Popular API", "Zabbix", "WhatsApp API", "Node.js"],
    diagram: {
      sources: [{ pt: "Rastreador", en: "GPS tracker" }],
      hub: {
        title: { pt: "Coletor", en: "Collector" },
        sub: { pt: "telemetria", en: "telemetry" },
      },
      targets: ["Zabbix", { pt: "Alerta WhatsApp", en: "WhatsApp alert" }],
    },
    unavailable: {
      pt: "Imagem indisponível por segurança do cliente",
      en: "Image withheld for client security",
    },
  },
  {
    id: "meta-bots",
    spark: { pt: "bot oficial no ar", en: "official bot live" },
    title: {
      pt: "Bots na API oficial da Meta",
      en: "Bots on Meta's official API",
    },
    category: { pt: "Mensageria", en: "Messaging" },
    year: "2024",
    summary: {
      pt: "Integração de chatbots com os canais oficiais da Meta — WhatsApp Cloud API, Messenger e Instagram — com aprovação de templates, webhooks e roteamento de conversa para o time certo.",
      en: "Chatbot integration with Meta's official channels — WhatsApp Cloud API, Messenger and Instagram — covering template approval, webhooks and routing conversations to the right team.",
    },
    highlights: [
      {
        pt: "Onboarding completo na Cloud API: número, template e verificação",
        en: "Full Cloud API onboarding: number, templates and verification",
      },
      {
        pt: "Webhooks tratando entrada, status de entrega e leitura",
        en: "Webhooks handling inbound, delivery and read receipts",
      },
      {
        pt: "Roteamento de conversas e fila de atendimento",
        en: "Conversation routing and support queueing",
      },
    ],
    stack: ["WhatsApp Cloud API", "Messenger", "Instagram", "Webhooks"],
    diagram: {
      sources: ["WhatsApp", "Instagram", "Messenger"],
      hub: {
        title: { pt: "Roteador", en: "Router" },
        sub: "Meta Cloud API",
      },
      targets: [
        { pt: "Fila", en: "Queue" },
        { pt: "Atendente", en: "Agent" },
      ],
    },
  },
  {
    id: "landing-pages",
    spark: { pt: "página que converte", en: "page that converts" },
    title: {
      pt: "Landing pages dinâmicas",
      en: "Dynamic landing pages",
    },
    category: { pt: "Web", en: "Web" },
    year: "2024",
    summary: {
      pt: "Páginas de conversão montadas por configuração, não por código novo a cada campanha: seções, ofertas e formulários mudam sozinhos e o lead cai direto no CRM.",
      en: "Conversion pages assembled by configuration instead of fresh code for every campaign: sections, offers and forms change on their own and the lead drops straight into the CRM.",
    },
    highlights: [
      {
        pt: "Conteúdo e seções controlados por configuração, sem redeploy",
        en: "Content and sections driven by config, no redeploy needed",
      },
      {
        pt: "Formulários dinâmicos com envio direto para o CRM",
        en: "Dynamic forms posting straight into the CRM",
      },
      {
        pt: "Rastreio de conversão e otimização de carregamento",
        en: "Conversion tracking and load-time optimization",
      },
    ],
    stack: ["Next.js", "React", "Tailwind", "CRM APIs"],
    diagram: {
      sources: [{ pt: "Campanha", en: "Campaign" }],
      hub: {
        title: { pt: "Landing page", en: "Landing page" },
        sub: { pt: "por configuração", en: "config-driven" },
      },
      targets: ["Lead", "CRM", { pt: "Conversão", en: "Conversion" }],
    },
  },
  {
    id: "gateway-pagamento",
    spark: { pt: "PIX confirmado", en: "PIX confirmed" },
    title: {
      pt: "Gateway de pagamento para plataforma de cassino",
      en: "Payment gateway for a casino platform",
    },
    category: { pt: "Pagamentos", en: "Payments" },
    year: "2025",
    summary: {
      pt: "Gateway construído para uma plataforma de cassino online, cuidando do dinheiro entrando e saindo: cobrança PIX, confirmação por webhook, saques, conciliação e um painel para acompanhar tudo.",
      en: "A gateway built for an online casino platform, handling money in and money out: PIX charges, webhook confirmation, withdrawals, reconciliation and a panel to watch it all.",
    },
    highlights: [
      {
        pt: "Cash-in via PIX com confirmação automática por webhook",
        en: "PIX cash-in with automatic webhook confirmation",
      },
      {
        pt: "Fluxo de saque com validação e controle de saldo",
        en: "Withdrawal flow with validation and balance control",
      },
      {
        pt: "Conciliação financeira e painel de transações",
        en: "Financial reconciliation and a transactions panel",
      },
    ],
    stack: ["PIX", "Webhooks", "Node.js", "PostgreSQL"],
    diagram: {
      sources: [{ pt: "Jogador", en: "Player" }],
      hub: {
        title: "Gateway",
        sub: "PIX · webhooks",
      },
      targets: [
        "Cash-in",
        { pt: "Saque", en: "Withdrawal" },
        { pt: "Conciliação", en: "Reconciliation" },
      ],
    },
  },
];

export const stackMarquee = [
  "OpenAI",
  "Node.js",
  "TypeScript",
  "Next.js",
  "React",
  "PostgreSQL",
  "Bitrix24 · BX24",
  "Omie",
  "Bling",
  "Zabbix",
  "SGP",
  "Geosite",
  "WhatsApp Cloud API",
  "Meta API",
  "DJEN",
  "Trello",
  "PIX",
  "Webhooks",
  "Docker",
  "REST",
];
