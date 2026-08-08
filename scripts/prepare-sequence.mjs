#!/usr/bin/env node
/**
 * Converte um vídeo (o clipe gerado no Higgsfield a partir da sua foto) na
 * sequência de frames que o site reproduz amarrada ao scroll.
 *
 *   npm run sequence -- caminho/do/video.mp4
 *   npm run sequence -- video.mp4 --fps 24 --width 1600 --quality 4
 *
 * Escreve public/sequence/frame-0001.jpg... e o manifest.json que o
 * componente ScrollSequence procura. Precisa de ffmpeg/ffprobe no PATH.
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const OUT_DIR = resolve("public", "sequence");
const PATTERN = "frame-%04d.jpg";

function fail(message) {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
}

function flag(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

function has(bin) {
  const probe = spawnSync(bin, ["-version"], { stdio: "ignore", shell: true });
  return probe.status === 0;
}

const input = process.argv[2];
if (!input || input.startsWith("--")) {
  fail("informe o vídeo: npm run sequence -- caminho/do/video.mp4");
}
if (!existsSync(input)) fail(`arquivo não encontrado: ${input}`);
if (!has("ffmpeg")) {
  fail(
    "ffmpeg não encontrado no PATH.\n    Instale com:  winget install Gyan.FFmpeg\n    e abra um terminal novo.",
  );
}

const fps = flag("fps", "24");
const width = flag("width", "1600");
const quality = flag("quality", "4");

// Começa do zero: sobra de uma sequência antiga desalinha a contagem.
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

console.log(`\n  ▸ extraindo frames de ${basename(input)} (${fps}fps, ${width}px)`);

const extract = spawnSync(
  "ffmpeg",
  [
    "-hide_banner",
    "-loglevel",
    "error",
    "-i",
    input,
    "-vf",
    `fps=${fps},scale=${width}:-2`,
    "-q:v",
    quality,
    join(OUT_DIR, PATTERN),
  ],
  { stdio: "inherit", shell: true },
);
if (extract.status !== 0) fail("ffmpeg falhou ao extrair os frames");

const files = readdirSync(OUT_DIR).filter((f) => f.endsWith(".jpg")).sort();
if (files.length === 0) fail("nenhum frame foi gerado — confira o vídeo de entrada");

let dimensions = { width: Number(width), height: 0 };
if (has("ffprobe")) {
  const probe = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height",
      "-of",
      "csv=p=0",
      join(OUT_DIR, files[0]),
    ],
    { encoding: "utf8", shell: true },
  );
  const [w, h] = String(probe.stdout).trim().split(",").map(Number);
  if (w && h) dimensions = { width: w, height: h };
}

writeFileSync(
  join(OUT_DIR, "manifest.json"),
  `${JSON.stringify({ count: files.length, pattern: PATTERN, ...dimensions }, null, 2)}\n`,
);

console.log(
  `  ✓ ${files.length} frames em public/sequence (${dimensions.width}x${dimensions.height})`,
);
console.log("    recarregue a página — o hero já usa a sequência.\n");
