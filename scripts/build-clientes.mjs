// Genera las tarjetas de cliente del bloque "Clientes" a partir de data/clientes.json
// y las inyecta entre los marcadores CLIENTES:START / CLIENTES:END en las páginas que
// muestran el bloque (home y sobre-nosotros). Fuente única de datos: data/clientes.json.
//
// Uso:  node scripts/build-clientes.mjs      (reescribe los HTML trackeados)
//       npm run clientes                      (idem)
//
// Mismo patrón que scripts/build-reviews.mjs: es codegen que reescribe ficheros
// trackeados, así que al añadir o editar un cliente se ejecuta y se commitea el
// resultado. El formato (CSS, animación de la banda de marcas) vive en el propio
// HTML; aquí solo se genera la parte que depende de los datos.
//
// Aviso de datos: cada socio que sale aquí es una persona identificada (nombre, cargo,
// foto, enlace a su perfil). Solo se publica con su autorización por escrito. Si alguien
// la retira, se borra su objeto de data/clientes.json y se vuelve a ejecutar esto.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TARGETS = [
  "index.html",
  "sobre-nosotros/index.html",
  "revision-de-contratos/index.html",
  "consultoria-legal/index.html",
  "consultoria-proteccion-de-datos/index.html",
  "proteccion-legal-continua/index.html",
];
const START = "<!-- CLIENTES:START -->";
const END = "<!-- CLIENTES:END -->";

// Logotipo "in" de LinkedIn, como constante para no repetirlo en el JSON.
const LINKEDIN =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>';

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// En lead y bio, **texto** sale destacado. Se escapa antes, así que el ** no puede
// colar etiquetas: solo marca los tramos que ya son texto plano.
const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

// Onda de audio: motivo de los clientes del mundo audiovisual. Determinista, para que
// dos ejecuciones seguidas den el mismo HTML y el diff quede limpio.
function onda() {
  let bars = "";
  const N = 110;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const env = Math.sin(Math.PI * t) ** 0.55;
    const g = Math.abs(Math.sin(i * 1.7) * 0.5 + Math.sin(i * 0.43) * 0.32 + Math.sin(i * 3.1) * 0.18);
    const h = Math.max(2, Math.round(env * g * 46));
    bars += `<rect x="${i * 4}" y="${(24 - h / 2).toFixed(1)}" width="2" height="${h}" rx="1"/>`;
  }
  return `<svg class="sl-cl__wave" viewBox="0 0 440 48" preserveAspectRatio="none" aria-hidden="true">${bars}</svg>`;
}

// Filete neutro para los clientes que no son del mundo audiovisual.
const FILETE =
  '<svg class="sl-cl__wave" viewBox="0 0 440 48" preserveAspectRatio="none" aria-hidden="true"><path d="M0 24H440" stroke="rgba(201,170,111,.45)" stroke-width="2" stroke-dasharray="2 6" fill="none"/></svg>';

function socio(p) {
  const foto = p.foto
    ? `<img src="${esc(p.foto.src)}" alt="${esc(p.nombre)}" width="${p.foto.lado}" height="${p.foto.lado}" loading="lazy" decoding="async">`
    : "";
  return [
    '            <div class="sl-cl__p">',
    '              <span class="sl-cl__face">' + foto + "</span>",
    "              <span>",
    '                <span class="sl-cl__role">' + esc(p.rol) + "</span>",
    '                <span class="sl-cl__name">' + esc(p.nombre) + "</span>",
    '                <span class="sl-cl__bio">' + rich(p.bio) + "</span>",
    '                <a class="sl-cl__li" href="' + esc(p.linkedin) + '" target="_blank" rel="noopener">' +
      LINKEDIN + " LinkedIn</a>",
    "              </span>",
    "            </div>",
  ].join("\n");
}

// La banda se desliza en bucle: se pinta el grupo dos veces y la animación desplaza
// media pista, así que el salto cae justo donde el segundo grupo repite al primero.
function marcas(m) {
  if (!m || !Array.isArray(m.items) || !m.items.length) return "";
  const grupo =
    '<div class="sl-cl__mq-group">' +
    m.items.map((x) => '<span class="sl-cl__wm">' + esc(x) + "</span>").join("") +
    "</div>";
  return [
    '        <div class="sl-cl__strip">',
    '          <span class="sl-cl__strip-lab">' + esc(m.etiqueta) + "</span>",
    '          <div class="sl-cl__mq"><div class="sl-cl__mq-track" style="--sl-cl-dur:' +
      esc(m.duracion || "46s") + '">' + grupo + grupo + "</div></div>",
    "        </div>",
  ].join("\n");
}

function tarjeta(c) {
  const l = c.logo;
  const enlaces = [];
  if (c.enlaces?.web) {
    enlaces.push(
      '          <a href="' + esc(c.enlaces.web.url) + '" target="_blank" rel="noopener">' +
        esc(c.enlaces.web.texto) + " &#8594;</a>"
    );
  }
  if (c.enlaces?.linkedin) {
    enlaces.push(
      '          <a href="' + esc(c.enlaces.linkedin.url) + '" target="_blank" rel="noopener">' +
        LINKEDIN + " " + esc(c.enlaces.linkedin.texto) + "</a>"
    );
  }
  return [
    '      <article class="sl-cl sl-proof__reveal">',
    '        <div class="sl-cl__in">',
    '          <header class="sl-cl__top">',
    '            <p class="sl-cl__logo"><img src="' + esc(l.src) + '" alt="' + esc(c.nombre) +
      '" width="' + l.ancho + '" height="' + l.alto + '" loading="lazy" decoding="async"></p>',
    '            <p class="sl-cl__tag">' + esc(c.etiqueta) + "<span>" + esc(c.meta) + "</span></p>",
    "          </header>",
    '          <p class="sl-cl__lead">' + rich(c.lead) + "</p>",
    "          " + (c.motivo === "onda" ? onda() : FILETE),
    '          <div class="sl-cl__crew">',
    (c.socios || []).map(socio).join("\n"),
    "          </div>",
    "        </div>",
    marcas(c.marcas),
    '        <div class="sl-cl__foot">',
    enlaces.join("\n"),
    "        </div>",
    "      </article>",
  ]
    .filter((x) => x !== "")
    .join("\n");
}

function main() {
  const data = JSON.parse(readFileSync(resolve(ROOT, "data/clientes.json"), "utf8"));
  const clientes = Array.isArray(data.clientes) ? data.clientes : [];
  if (!clientes.length) {
    console.error("build-clientes: data/clientes.json no tiene clientes; abortando.");
    process.exit(1);
  }
  // A partir de cuatro clientes la lista pasa a rejilla de dos columnas: apiladas
  // ocuparían media página de scroll.
  const modo = clientes.length >= 4 ? " sl-cl__list--grid" : "";
  const block =
    '\n    <div class="sl-cl__list' + modo + '">\n' +
    clientes.map(tarjeta).join("\n") +
    "\n    </div>\n    ";

  let changed = 0;
  for (const rel of TARGETS) {
    const file = resolve(ROOT, rel);
    const html = readFileSync(file, "utf8");
    const s = html.indexOf(START);
    const e = html.indexOf(END);
    if (s === -1 || e === -1 || e < s) {
      console.error(`build-clientes: marcadores no encontrados en ${rel}; sáltalo.`);
      continue;
    }
    const next = html.slice(0, s + START.length) + block + html.slice(e);
    if (next !== html) {
      writeFileSync(file, next);
      changed++;
    }
  }
  console.log(`build-clientes: ${clientes.length} cliente(s) inyectado(s) en ${changed} fichero(s).`);
}

main();
