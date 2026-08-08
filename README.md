# Portfólio — Gustavo Alves Santana

Next.js 16 (App Router) + Tailwind v4. Bilíngue PT/EN com toggle no topo.

```bash
npm run dev
```

---

## 1. O personagem

É um retrato vetorial desenhado à mão em `components/Character.tsx` — nenhuma
foto envolvida. Ele respira, digita, pisca, inclina a cabeça atrás do cursor e
balança com a rolagem da página.

Para ajustar os traços, tudo está em constantes no topo do arquivo:

| O quê | Onde |
| --- | --- |
| Tom de pele, cabelo, camisa, aparelhos | `C` |
| Volume e formato dos cachos | `CURLS` (cx, cy, raio) |
| Ponto de onde saem as linhas de ideia | `BRAIN` |

O rosto em si — sobrancelhas, olhos, nariz, bigode, sorriso, cavanhaque — são
paths dentro do grupo `cabeça`, cada um comentado.

> `public/me.jpeg` não é mais usado pelo site. Se você não for precisar dele,
> apague — senão ele vai junto no deploy e fica público.

---

## 2. O hero com sequência de scroll

O hero reproduz uma sequência de imagens **amarrada ao scroll** — é o efeito de
página da Apple, em que o objeto se desmonta conforme você rola. Enquanto não
houver sequência publicada, o hero cai no layout estático com o personagem.

### Passo a passo

1. **Gere o vídeo** a partir da sua foto (Higgsfield ou equivalente).
   Vídeo curto — 3 a 5 segundos —, câmera fixa, fundo escuro para casar com o
   site. O movimento pode ser o que você quiser: desmontar, orbitar, revelar.

2. **Extraia os frames:**

```bash
npm run sequence -- caminho/do/video.mp4
```

   Isso escreve `public/sequence/frame-0001.jpg…` e o `manifest.json` que o site
   procura. Opções: `--fps 24 --width 1600 --quality 4`.

3. **Recarregue a página.** O hero passa a usar a sequência automaticamente.

Para voltar ao hero estático, apague `public/sequence`.

### Requisito: ffmpeg

O script precisa de `ffmpeg` no PATH. No Windows:

```bash
winget install Gyan.FFmpeg
```

Abra um terminal novo depois de instalar.

### Peso

24fps × 4s ≈ 96 frames. A 1600px de largura e qualidade 4, dá ~10–15 MB no
total. Se ficar pesado, baixe `--fps` para 16 ou `--width` para 1280. O
componente desenha o último frame já carregado enquanto o resto chega, então a
página nunca fica travada esperando.

Ajuste a duração do scrub em `components/Hero.tsx` → prop `screens` do
`ScrollSequence` (padrão `3.5` telas).

---

## 3. As imagens dos projetos

Cada card traz o diagrama do fluxo real da integração, desenhado em SVG
(`components/ProjectArt.tsx`): as origens à esquerda, o sistema que eu
construí no centro, os destinos à direita, com o tracejado correndo no sentido
do fluxo. O projeto sob NDA mostra o painel bloqueado com cadeado, sem expor
nada.

Cada diagrama vem do campo `diagram` do projeto em `lib/projects.ts`:

```ts
diagram: {
  sources: ["WhatsApp", { pt: "Site", en: "Website" }],
  hub: { title: { pt: "Assistente IA", en: "AI Assistant" }, sub: "OpenAI · 24/7" },
  targets: ["DJEN", "Trello CRM", { pt: "Advogado", en: "Lawyer" }],
}
```

Nome de produto vai como string simples; o que traduz vai como par PT/EN. São
até 3 origens e 3 destinos, e os rótulos devem caber em ~14 caracteres.

---

## 4. Linhas de ideia cérebro → projeto

Na seção de projetos, o personagem fica fixo na coluna esquerda e dispara uma
curva até cada card visível — a mais próxima do centro da tela fica acesa, com
o rótulo da ideia e um cometa percorrendo a linha.

A geometria é calculada a partir das posições reais dos elementos
(`components/Work.tsx`), então o traçado se ajusta sozinho a qualquer tamanho de
tela. Abaixo de 1024px as linhas são desligadas e os cards empilham.

---

## 5. Onde editar o conteúdo

| O quê | Arquivo |
| --- | --- |
| Projetos (título, resumo, destaques, stack, diagrama) | `lib/projects.ts` |
| Textos de interface PT/EN | `lib/i18n.tsx` → `ui` |
| E-mail, GitHub, LinkedIn, WhatsApp | `lib/site.ts` |
| Cores e animações | `app/globals.css` |

Links vazios em `lib/site.ts` simplesmente não aparecem na página — preencha
`github`, `linkedin` e `whatsapp` quando quiser exibi-los.

---

## Deploy

```bash
npm run build
```

Saída estática pura, sem backend. Vercel, Netlify ou qualquer host servem.
Lembre de commitar `public/me.jpg` e `public/sequence/` — são assets do site.
