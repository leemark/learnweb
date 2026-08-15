// generate.mjs — emits static lesson/path/hub pages, sitemap, feed, and OG images
// from the shared curriculum module. Run via `npm run generate` (pre-step of dev/build).

import { mkdir, writeFile } from "node:fs/promises";
import { deflateSync } from "node:zlib";
import path from "node:path";
import {
  siteUrl,
  pathOrder,
  pathData,
  lessonGuides,
  studioMissions,
  changelog,
  slugify,
  lessonSlug,
  lessonUrl,
  pathUrl
} from "./curriculum.js";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public");
const IMG_W = 1200;
const IMG_H = 630;
const BG = [11, 11, 14];
const CREAM = [244, 241, 232];
const MUTED = [151, 151, 159];
const accentOf = (pathId) => pathData[pathId].accent;

// ————— minimal PNG encoder —————

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) c = CRC_TABLE[(c ^ buffer[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

function encodePNG(width, height, rgba) {
  const bpp = 4;
  const stride = width * bpp;
  const raw = Buffer.alloc((stride + 1) * height);
  const pixels = Buffer.from(rgba.buffer, rgba.byteOffset, rgba.byteLength);
  const line = Buffer.alloc(stride);
  const filtered = Buffer.alloc(stride);
  let prevRow = Buffer.alloc(stride);
  let offset = 0;

  for (let y = 0; y < height; y += 1) {
    pixels.copy(line, 0, y * stride, (y + 1) * stride);

    let best = 0;
    let bestCost = Infinity;
    const bestRow = Buffer.alloc(stride);
    for (let filter = 0; filter <= 4; filter += 1) {
      let cost = 0;
      for (let x = 0; x < stride; x += 1) {
        const current = line[x];
        const left = x >= bpp ? line[x - bpp] : 0;
        const up = prevRow[x];
        const upLeft = x >= bpp ? prevRow[x - bpp] : 0;
        let value = current;
        if (filter === 1) value = current - left;
        else if (filter === 2) value = current - up;
        else if (filter === 3) value = current - ((left + up) >> 1);
        else if (filter === 4) value = current - paeth(left, up, upLeft);
        filtered[x] = value & 0xff;
        cost += Math.abs(value);
      }
      if (cost < bestCost) {
        bestCost = cost;
        best = filter;
        filtered.copy(bestRow);
      }
    }

    raw[offset++] = best;
    bestRow.copy(raw, offset);
    offset += stride;
    line.copy(prevRow);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

// ————— drawing primitives —————

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCanvas() {
  const buf = new Uint8ClampedArray(IMG_W * IMG_H * 4);
  for (let i = 0; i < IMG_W * IMG_H; i += 1) {
    buf[i * 4] = BG[0];
    buf[i * 4 + 1] = BG[1];
    buf[i * 4 + 2] = BG[2];
    buf[i * 4 + 3] = 255;
  }
  return buf;
}

function paint(canvas, x, y, rgb, alpha) {
  if (x < 0 || y < 0 || x >= IMG_W || y >= IMG_H || alpha <= 0) return;
  const i = (y * IMG_W + x) * 4;
  canvas[i] = canvas[i] * (1 - alpha) + rgb[0] * alpha;
  canvas[i + 1] = canvas[i + 1] * (1 - alpha) + rgb[1] * alpha;
  canvas[i + 2] = canvas[i + 2] * (1 - alpha) + rgb[2] * alpha;
  canvas[i + 3] = 255;
}

function withSupersampling(canvas, rgb, alpha, inside, minX, minY, maxX, maxY) {
  const x0 = Math.max(0, Math.floor(minX));
  const y0 = Math.max(0, Math.floor(minY));
  const x1 = Math.min(IMG_W - 1, Math.ceil(maxX));
  const y1 = Math.min(IMG_H - 1, Math.ceil(maxY));
  const half = 0.25;
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      let coverage = 0;
      for (const [sx, sy] of [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]]) {
        if (inside(x + sx, y + sy)) coverage += half;
      }
      if (coverage > 0) paint(canvas, x, y, rgb, alpha * coverage);
    }
  }
}

function drawRect(canvas, x, y, w, h, rgb, alpha = 1) {
  withSupersampling(canvas, rgb, alpha, (px, py) => px >= x && px < x + w && py >= y && py < y + h, x, y, x + w, y + h);
}

function drawCircle(canvas, cx, cy, r, rgb, alpha = 1) {
  withSupersampling(canvas, rgb, alpha, (px, py) => Math.hypot(px - cx, py - cy) <= r, cx - r, cy - r, cx + r, cy + r);
}

function drawRing(canvas, cx, cy, r, thickness, rgb, alpha = 1) {
  const outer = r + thickness / 2;
  withSupersampling(canvas, rgb, alpha, (px, py) => {
    const d = Math.hypot(px - cx, py - cy);
    return Math.abs(d - r) <= thickness / 2;
  }, cx - outer, cy - outer, cx + outer, cy + outer);
}

function drawSegment(canvas, ax, ay, bx, by, thickness, rgb, alpha = 1) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  const pad = thickness / 2 + 1;
  withSupersampling(canvas, rgb, alpha, (px, py) => {
    let t = lengthSq ? ((px - ax) * dx + (py - ay) * dy) / lengthSq : 0;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy)) <= thickness / 2;
  }, Math.min(ax, bx) - pad, Math.min(ay, by) - pad, Math.max(ax, bx) + pad, Math.max(ay, by) + pad);
}

function drawStar4(canvas, cx, cy, r, rgb, alpha = 1) {
  withSupersampling(canvas, rgb, alpha, (px, py) => {
    const dx = Math.abs(px - cx);
    const dy = Math.abs(py - cy);
    return Math.sqrt(dx) + Math.sqrt(dy) <= Math.sqrt(r);
  }, cx - r, cy - r, cx + r, cy + r);
}

function drawNoise(canvas, seed) {
  const rand = mulberry32(seed);
  for (let i = 0; i < 2600; i += 1) {
    const x = Math.floor(rand() * IMG_W);
    const y = Math.floor(rand() * IMG_H);
    const a = 0.04 + rand() * 0.05;
    paint(canvas, x, y, [255, 255, 255], a);
  }
}

function drawVignette(canvas) {
  for (let y = 0; y < IMG_H; y += 1) {
    for (let x = 0; x < IMG_W; x += 1) {
      const nx = (x / IMG_W) * 2 - 1;
      const ny = (y / IMG_H) * 2 - 1;
      const d = Math.hypot(nx, ny);
      if (d < 0.12) continue;
      paint(canvas, x, y, [0, 0, 0], d * d * 0.38);
    }
  }
}

// ————— 5x7 bitmap font —————

const FONT = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["01110", "00100", "00100", "00100", "00100", "00100", "01110"],
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "10001", "11001", "10101", "10011", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  "&": ["01100", "10010", "10100", "01000", "10101", "10010", "01101"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"]
};

function drawText(canvas, text, centerX, top, scale, rgb, alpha = 1) {
  const glyphs = [...text.toUpperCase()];
  const width = glyphs.length * 6 - 1;
  let x = Math.round(centerX - (width * scale) / 2);
  for (const char of glyphs) {
    const glyph = FONT[char] || FONT[" "];
    for (let row = 0; row < 7; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        if (glyph[row][col] === "1") {
          drawRect(canvas, x + col * scale, top + row * scale, scale, scale, rgb, alpha);
        }
      }
    }
    x += 6 * scale;
  }
}

// ————— path symbols —————

function drawPathSymbol(canvas, pathId, accent) {
  const cx = IMG_W / 2;
  switch (pathId) {
    case "foundations": {
      const size = 260;
      drawRect(canvas, cx - size / 2, 100, size, size, accent);
      drawRect(canvas, cx - size / 2 + 46, 146, size - 92, size - 92, BG);
      break;
    }
    case "platform": {
      const thickness = 34;
      const width = 96;
      const height = 250;
      const top = 110;
      const gap = 140;
      for (const [sign, inset] of [[-1, 0], [1, 0]]) {
        const x0 = cx + sign * (gap / 2) - (sign > 0 ? width : 0);
        drawRect(canvas, x0, top, width, thickness, accent);
        drawRect(canvas, x0, top + height - thickness, width, thickness, accent);
        drawRect(canvas, x0, top, thickness, height, accent);
      }
      break;
    }
    case "ux":
      drawRing(canvas, cx, 245, 130, 46, accent);
      break;
    case "accessibility":
      drawCircle(canvas, cx, 245, 130, accent);
      drawCircle(canvas, cx, 245, 52, BG);
      break;
    case "search": {
      drawRing(canvas, cx - 50, 225, 115, 44, accent);
      drawSegment(canvas, cx + 35, 300, cx + 180, 410, 44, accent);
      break;
    }
    case "ai":
      drawStar4(canvas, cx, 255, 235, accent);
      break;
    default:
      drawCircle(canvas, cx, 245, 120, accent);
  }
}

function makeOGImage(pathId) {
  const canvas = makeCanvas();
  drawNoise(canvas, 20260814);
  drawVignette(canvas);
  const accent = parseHex(accentOf(pathId));
  drawPathSymbol(canvas, pathId, accent);
  drawText(canvas, "LEARN.WEB", IMG_W / 2, 452, 12, CREAM);
  const label = pathId === "ux" ? "UX & PRODUCT DESIGN" : pathData[pathId].title.toUpperCase();
  drawText(canvas, label, IMG_W / 2, 556, 6, accent);
  return encodePNG(IMG_W, IMG_H, canvas);
}

function makeHomeOG() {
  const canvas = makeCanvas();
  drawNoise(canvas, 20260814);
  drawVignette(canvas);
  const accent = parseHex("#d9ff43");
  const coral = parseHex("#ff5c39");
  // the site's icon: polyline + dot, scaled up
  const scale = 5;
  const ox = IMG_W / 2 - 90;
  const oy = 90;
  drawSegment(canvas, ox + 10, oy + 20, ox + 10, oy + 170, 34, accent);
  drawSegment(canvas, ox + 10, oy + 170, ox + 190, oy + 170, 34, accent);
  drawCircle(canvas, ox + 170, oy + 22, 34, coral);
  drawText(canvas, "LEARN.WEB", IMG_W / 2, 420, 14, CREAM);
  drawText(canvas, "BUILD WHAT THE WEB CAN BE", IMG_W / 2, 540, 7, accent);
  return encodePNG(IMG_W, IMG_H, canvas);
}

function parseHex(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

// ————— HTML page templates —————

function esc(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function pageShell({ title, description, url, accent, ogImage, body, jsonLd }) {
  return `<!doctype html>
<html lang="en" data-theme="ink">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#0b0b0e">
    <meta name="color-scheme" content="dark light">
    <meta name="description" content="${esc(description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${siteUrl}${url}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:image" content="${siteUrl}${ogImage}">
    <meta property="og:image:width" content="${IMG_W}">
    <meta property="og:image:height" content="${IMG_H}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="canonical" href="${siteUrl}${url}">
    <link rel="alternate" type="application/atom+xml" title="learn.web updates" href="/feed.xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/static.css">
    <style>:root { --accent: ${accent}; }</style>
    <title>${esc(title)}</title>
    <script type="application/ld+json">${jsonLd}</script>
    <script>
      if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
    </script>
  </head>
  <body>
    <a class="skip-link" href="#content">Skip to content</a>
    <header class="static-header">
      <a class="wordmark" href="/">learn<span>.</span>web</a>
      <a href="/#paths">Back to the curriculum ↗</a>
    </header>
    <main id="content" class="static-main">${body}</main>
    <footer class="static-footer">
      <span>Content © 2026 Mark Lee · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a></span>
      <span><a href="/">Home</a> · <a href="/learn/">All lessons</a> · <a href="/feed.xml">Updates feed</a></span>
    </footer>
  </body>
</html>`;
}

function timeToISO(minutes) {
  return `PT${Math.round(minutes)}M`;
}

function parseMinutes(time) {
  const match = time.match(/(\d+)/);
  return match ? Number(match[1]) : 60;
}

const educationLevel = {
  foundations: "beginner",
  platform: "intermediate",
  ux: "intermediate",
  accessibility: "intermediate",
  search: "intermediate",
  ai: "advanced"
};

function lessonPage(pathId, index) {
  const path = pathData[pathId];
  const guide = lessonGuides[pathId][index];
  const [title, detail, time] = path.modules[index];
  const slug = lessonSlug(pathId, index);
  const url = lessonUrl(pathId, index);
  const lessonId = `${pathId}-${index + 1}`;
  const [mission, proof] = studioMissions[pathId][index];
  const minutes = parseMinutes(time);
  const accent = path.accent;

  const objectives = guide.objectives.map((text) => `<li>${esc(text)}</li>`).join("");
  const understand = guide.understand[1].map((text) => `<p>${esc(text)}</p>`).join("");
  const apply = guide.apply[1].map((text) => `<p>${esc(text)}</p>`).join("");
  const steps = guide.steps.map((text) => `<li>${esc(text)}</li>`).join("");
  const quiz = guide.quiz.map(([question, options, , explanation], qIndex) => {
    const optionList = options.map((text) => `<li>${esc(text)}</li>`).join("");
    const correct = String.fromCharCode(65 + guide.quiz[qIndex][2]);
    return `<fieldset>
  <legend>${esc(question)}</legend>
  <ol>${optionList}</ol>
  <details><summary>Reveal answer</summary><p>The correct answer is ${correct}. ${esc(explanation)}</p></details>
</fieldset>`;
  }).join("");

  const previous = index > 0
    ? `<a class="prev" href="${lessonUrl(pathId, index - 1)}"><small>← Previous</small><strong>${esc(path.modules[index - 1][0])}</strong></a>`
    : `<a class="prev" href="${pathUrl(pathId)}"><small>← Path</small><strong>${esc(path.title)}</strong></a>`;
  const next = index < path.modules.length - 1
    ? `<a class="next" href="${lessonUrl(pathId, index + 1)}"><small>Next →</small><strong>${esc(path.modules[index + 1][0])}</strong></a>`
    : `<a class="next" href="${pathUrl(pathId)}"><small>Path →</small><strong>${esc(path.title)}</strong></a>`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: title,
    description: detail,
    url: `${siteUrl}${url}`,
    image: `${siteUrl}/og-${pathId}.png`,
    learningResourceType: "lesson",
    educationalLevel: educationLevel[pathId],
    timeRequired: timeToISO(minutes),
    teaches: guide.objectives,
    isPartOf: {
      "@type": "Course",
      name: path.title,
      url: `${siteUrl}${pathUrl(pathId)}`
    }
  });

  const body = `
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">learn.web</a><span>/</span>
      <a href="/learn/">Lessons</a><span>/</span>
      <a href="${pathUrl(pathId)}">${esc(path.title)}</a><span>/</span>
      <span>${esc(title)}</span>
    </nav>

    <p class="lesson-kicker">${esc(path.label)} / ${String(index + 1).padStart(2, "0")}</p>
    <h1>${esc(title)}</h1>
    <p class="lesson-dek">${esc(detail)}</p>
    <dl class="lesson-meta">
      <div><dt>Time</dt><dd>${esc(time)}</dd></div>
      <div><dt>Mode</dt><dd>Learn → Make → Check</dd></div>
      <div><dt>Path</dt><dd>${esc(path.title)}</dd></div>
    </dl>

    <section class="static-section" aria-labelledby="objectives-${lessonId}">
      <p class="static-section-label">Before you begin</p>
      <h2 id="objectives-${lessonId}">By the end, you can…</h2>
      <ul class="static-objectives">${objectives}</ul>
    </section>

    <section class="static-section" aria-labelledby="understand-${lessonId}">
      <p class="static-section-label">01 / Understand</p>
      <h2 id="understand-${lessonId}">${esc(guide.understand[0])}</h2>
      ${understand}
    </section>

    <aside class="static-principle">
      <p class="static-section-label">Keep this</p>
      <strong>${esc(guide.principle)}</strong>
    </aside>

    <section class="static-section" aria-labelledby="apply-${lessonId}">
      <p class="static-section-label">02 / Apply</p>
      <h2 id="apply-${lessonId}">${esc(guide.apply[0])}</h2>
      ${apply}
      ${guide.example ? `
      <div class="static-example">
        <div class="static-example-bar"><span>Working example</span></div>
        <pre><code>${esc(guide.example)}</code></pre>
      </div>` : ""}
    </section>

    <section class="static-section" aria-labelledby="make-${lessonId}">
      <p class="static-section-label">03 / Make</p>
      <h2 id="make-${lessonId}">Your studio task</h2>
      <p class="static-make"><strong>Make — </strong>${esc(mission)}</p>
      <ol class="static-steps">${steps}</ol>
      <div class="static-done">
        <strong>Definition of done</strong>
        <p>${esc(proof)}</p>
      </div>
      <a class="static-lab-link" href="/#lesson-${lessonId}">Open the interactive lesson with its workspace ↗</a>
    </section>

    <section class="static-section" aria-labelledby="check-${lessonId}">
      <p class="static-section-label">04 / Check</p>
      <h2 id="check-${lessonId}">Knowledge check</h2>
      <div class="static-quiz">${quiz}</div>
    </section>

    <nav class="static-pager" aria-label="Lesson navigation">
      ${previous}
      ${next}
    </nav>`;

  return pageShell({
    title: `${title} — learn.web`,
    description: `${detail} A free, project-based lesson from the ${path.title} path.`,
    url,
    accent,
    ogImage: `/og-${pathId}.png`,
    body,
    jsonLd
  });
}

function pathPage(pathId) {
  const path = pathData[pathId];
  const url = pathUrl(pathId);
  const lessons = path.modules.map(([title, detail, time], index) => {
    const [mission] = studioMissions[pathId][index];
    return `<li>
  <a href="${lessonUrl(pathId, index)}">
    <span class="num">${String(index + 1).padStart(2, "0")}</span>
    <span><strong>${esc(title)}</strong><br><small>${esc(detail)}</small></span>
    <span class="time">${esc(time)}</span>
  </a>
</li>`;
  }).join("");

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Course",
    name: path.title,
    description: path.description,
    url: `${siteUrl}${url}`,
    image: `${siteUrl}/og-${pathId}.png`,
    provider: { "@type": "Person", "name": "Mark Lee" },
    isAccessibleForFree: true,
    learningResourceType: "course",
    educationalLevel: educationLevel[pathId],
    hasPart: path.modules.map(([title], index) => ({
      "@type": "LearningResource",
      name: title,
      url: `${siteUrl}${lessonUrl(pathId, index)}`
    }))
  });

  const body = `
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">learn.web</a><span>/</span>
      <a href="/learn/">Lessons</a><span>/</span>
      <span>${esc(path.title)}</span>
    </nav>
    <p class="lesson-kicker">${esc(path.label)}</p>
    <h1>${esc(path.title)}</h1>
    <p>${esc(path.description)}</p>
    <div class="path-outcome"><strong>By the end of this path</strong><p>${esc(path.outcome)}</p></div>
    <section class="static-section" aria-labelledby="modules-${pathId}">
      <p class="static-section-label">Lessons</p>
      <h2 id="modules-${pathId}">Six studio lessons</h2>
      <ul class="learn-lessons">${lessons}</ul>
    </section>`;

  return pageShell({
    title: `${path.title} path — learn.web`,
    description: `${path.description} Six project-based lessons.`,
    url,
    accent: path.accent,
    ogImage: `/og-${pathId}.png`,
    body,
    jsonLd
  });
}

function hubPage() {
  const pathSections = pathOrder.map((pathId) => {
    const path = pathData[pathId];
    const lessons = path.modules.map(([title, detail, time], index) =>
      `<li><a href="${lessonUrl(pathId, index)}"><span class="num">${String(index + 1).padStart(2, "0")}</span><span>${esc(title)}</span><span class="time">${esc(time)}</span></a></li>`
    ).join("");
    return `<section class="learn-path">
  <div class="learn-path-head">
    <span class="symbol" aria-hidden="true">${path.symbol}</span>
    <h2>${esc(path.title)}</h2>
    <a href="${pathUrl(pathId)}">Path overview ↗</a>
  </div>
  <p>${esc(path.description)}</p>
  <ul class="learn-lessons">${lessons}</ul>
</section>`;
  }).join("");

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "learn.web — all lessons",
    description: "Thirty-six project-based lessons across six paths: Web Foundations, Modern Web Platform, UX & Product Design, Accessibility, Search & AI Discovery, and AI Product Engineering.",
    url: `${siteUrl}/learn/`,
    learningResourceType: "course",
    educationalLevel: ["beginner", "intermediate", "advanced"],
    hasPart: pathOrder.map((pathId) => ({
      "@type": "Course",
      name: pathData[pathId].title,
      url: `${siteUrl}${pathUrl(pathId)}`
    }))
  });

  const body = `
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">learn.web</a><span>/</span>
      <span>Lessons</span>
    </nav>
    <div class="learn-hub">
      <p class="lesson-kicker">The full curriculum</p>
      <h1>All lessons</h1>
      <p>Thirty-six project-based lessons across six paths. Each lesson stands alone, and every one ends in an artifact you can point to. Prefer the interactive version? <a href="/#paths" style="color:var(--accent)">Open the studio</a>.</p>
      <div class="learn-path-list">${pathSections}</div>
    </div>`;

  return pageShell({
    title: "All lessons — learn.web",
    description: "Thirty-six project-based lessons across six paths: Web Foundations, Modern Web Platform, UX & Product Design, Accessibility, Search & AI Discovery, and AI Product Engineering.",
    url: "/learn/",
    accent: "#d9ff43",
    ogImage: "/og.png",
    body,
    jsonLd
  });
}

// ————— sitemap + feed —————

function sitemap() {
  const latest = changelog[0]?.date || "2026-08-14";
  const urls = ["/", "/learn/", ...pathOrder.flatMap((pathId) => [
    pathUrl(pathId),
    ...pathData[pathId].modules.map((_, index) => lessonUrl(pathId, index))
  ])];
  const body = urls.map((url) => {
    const lastmod = url === "/" ? latest : latest;
    return `  <url>\n    <loc>${siteUrl}${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${url === "/" ? "1.0" : url === "/learn/" ? "0.9" : url.endsWith("/learn/") ? "0.8" : "0.7"}</priority>\n  </url>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function feed() {
  const entries = changelog.map((entry) => {
    const iso = new Date(`${entry.date}T00:00:00Z`);
    return `  <entry>
    <title>${esc(entry.title)}</title>
    <link href="${siteUrl}/#now"/>
    <id>tag:learnweb.cc,${entry.date}:${esc(entry.title.split(" ")[0].toLowerCase())}</id>
    <updated>${iso.toISOString()}</updated>
    <published>${iso.toISOString()}</published>
    <summary>${esc(entry.body)}</summary>
  </entry>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>learn.web — updates</title>
  <subtitle>A free, project-based field guide to the modern web. What changed, when, and why.</subtitle>
  <link href="${siteUrl}/feed.xml" rel="self"/>
  <link href="${siteUrl}/"/>
  <id>tag:learnweb.cc,2026:feed</id>
  <updated>${new Date(`${changelog[0].date}T00:00:00Z`).toISOString()}</updated>
  <author><name>Mark Lee</name><uri>https://themarklee.com/</uri></author>
${entries}
</feed>
`;
}

// ————— main —————

async function main() {
  // GitHub Pages serves the repo root; the OpenAI-style dist build consumes public/.
  // Write deployable assets to both so either pipeline works.
  const targets = [ROOT, OUT];

  for (const target of targets) {
    const learnDir = path.join(target, "learn");
    for (const pathId of pathOrder) {
      const pathDir = path.join(learnDir, pathId);
      await mkdir(pathDir, { recursive: true });
      await writeFile(path.join(pathDir, "index.html"), pathPage(pathId));
      for (let index = 0; index < pathData[pathId].modules.length; index += 1) {
        const lessonDir = path.join(pathDir, lessonSlug(pathId, index));
        await mkdir(lessonDir, { recursive: true });
        await writeFile(path.join(lessonDir, "index.html"), lessonPage(pathId, index));
      }
    }
    await writeFile(path.join(learnDir, "index.html"), hubPage());
    await writeFile(path.join(target, "og.png"), makeHomeOG());
    for (const pathId of pathOrder) {
      await writeFile(path.join(target, `og-${pathId}.png`), makeOGImage(pathId));
    }
  }

  await writeFile(path.join(ROOT, "sitemap.xml"), sitemap());
  await writeFile(path.join(ROOT, "feed.xml"), feed());

  const lessonCount = Object.values(pathData).reduce((sum, path) => sum + path.modules.length, 0);
  const { stat } = await import("node:fs/promises");
  const sizes = [];
  for (const file of ["og.png", ...pathOrder.map((id) => `og-${id}.png`)]) {
    sizes.push(`${file}: ${(await stat(path.join(ROOT, file))).size} B`);
  }
  console.log(`Generated ${lessonCount} lesson pages, ${pathOrder.length} path pages, hub, sitemap, feed, and ${sizes.length} OG images (root + public).`);
  console.log(sizes.join("\n"));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
