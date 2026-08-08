// Genera las tarjetas de reseñas del bloque "Clientes" a partir de data/reviews.json
// y las inyecta entre los marcadores REVIEWS:START / REVIEWS:END en las páginas que
// muestran el bloque (home y sobre-nosotros). Fuente única de datos: data/reviews.json.
//
// Uso:  node scripts/build-reviews.mjs      (reescribe los HTML trackeados)
//       npm run reviews                      (idem)
//
// Es codegen que reescribe ficheros trackeados: al añadir/editar una reseña se ejecuta
// y se commitea el resultado. El formato (CSS/animación del marquee) vive en el propio
// HTML; aquí solo se genera la parte que depende de los datos (las tarjetas).
//
// El futuro workflow de sincronización con Google Business Profile hará justo esto:
// reescribir data/reviews.json con las reseñas reales, ejecutar este script y abrir un PR.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TARGETS = ["index.html", "sobre-nosotros/index.html"];
const START = "<!-- REVIEWS:START -->";
const END = "<!-- REVIEWS:END -->";

// Logo de Google (idéntico al que ya usaba el bloque) y estrellas, como constantes para
// no repetirlos en el JSON.
const GOOGLE_G =
  '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';

const STAR =
  "M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.6 7.7l5.8-.8z";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function initialOf(name) {
  const ch = (name || "").trim().charAt(0).toUpperCase();
  return /[A-ZÁÉÍÓÚÑ]/.test(ch) ? ch : "★";
}

function stars(rating) {
  const full = Math.max(0, Math.min(5, Math.round(rating || 0)));
  let out = '<svg class="sl-mq__stars" viewBox="0 0 104 20" role="img" aria-label="' + full + ' de 5 estrellas"><g fill="#FBBC04">';
  for (let i = 0; i < full; i++) {
    const x = i * 21;
    out += '<path transform="translate(' + x + ' 0)" d="' + STAR + '"/>';
  }
  out += "</g>";
  if (full < 5) {
    out += '<g fill="rgba(23,40,71,.18)">';
    for (let i = full; i < 5; i++) {
      const x = i * 21;
      out += '<path transform="translate(' + x + ' 0)" d="' + STAR + '"/>';
    }
    out += "</g>";
  }
  return out + "</svg>";
}

function card(r) {
  const lines = [
    '          <article class="sl-mq__card">',
    '            <div class="sl-mq__top">',
    '              <span class="sl-mq__avatar" aria-hidden="true">' + esc(initialOf(r.name)) + "</span>",
    '              <span class="sl-mq__who">',
    '                <span class="sl-mq__name">' + esc(r.name) + "</span>",
    '                <span class="sl-mq__src">Reseña de ' + GOOGLE_G + " Google</span>",
    "              </span>",
    "            </div>",
    '            <div class="sl-mq__meta">' + stars(r.rating) +
      (r.date && String(r.date).trim() ? '<span class="sl-mq__date">' + esc(r.date) + "</span>" : "") +
      "</div>",
    '            <blockquote class="sl-mq__text"><p>' + esc(r.text) + "</p></blockquote>",
  ];
  // El rol/sector ("Psicóloga · Sabadell") es contexto que NO viene de la API de Google:
  // se anota a mano en data/reviews.json. Si falta, la tarjeta se muestra sin esa línea.
  if (r.role && String(r.role).trim()) {
    lines.push('            <figcaption class="sl-mq__role">' + esc(r.role) + "</figcaption>");
  }
  lines.push("          </article>");
  return lines.join("\n");
}

function main() {
  const data = JSON.parse(readFileSync(resolve(ROOT, "data/reviews.json"), "utf8"));
  const reviews = Array.isArray(data.reviews) ? data.reviews : [];
  if (!reviews.length) {
    console.error("build-reviews: data/reviews.json no tiene reseñas; abortando.");
    process.exit(1);
  }
  const block = "\n" + reviews.map(card).join("\n") + "\n          ";

  let changed = 0;
  for (const rel of TARGETS) {
    const file = resolve(ROOT, rel);
    const html = readFileSync(file, "utf8");
    const s = html.indexOf(START);
    const e = html.indexOf(END);
    if (s === -1 || e === -1 || e < s) {
      console.error(`build-reviews: marcadores no encontrados en ${rel}; sáltalo.`);
      continue;
    }
    const next = html.slice(0, s + START.length) + block + html.slice(e);
    if (next !== html) {
      writeFileSync(file, next);
      changed++;
    }
  }
  console.log(`build-reviews: ${reviews.length} reseña(s) inyectada(s) en ${changed} fichero(s).`);
}

main();
