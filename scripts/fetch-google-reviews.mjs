// Sincroniza data/reviews.json con las reseñas reales de la ficha de Google Business
// Profile. Pensado para correr en GitHub Actions (.github/workflows/sync-resenas.yml),
// que luego ejecuta build-reviews.mjs y abre un PR. Nunca publica solo: un humano aprueba
// el merge.
//
// ⚠️ ESTADO: el acceso a la API de Google Business Profile (habilitación + aprobación del
// proyecto por Google) es un trámite que hace el titular de la cuenta. Sin las variables de
// entorno de abajo, este script NO hace nada (sale 0) para no romper el workflow. El mapeo
// de la respuesta sigue la forma documentada de la API v4; queda por verificar contra la
// API real cuando existan credenciales.
//
// Variables de entorno (secrets del repo):
//   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN  (OAuth, acceso offline)
//   GBP_ACCOUNT_ID, GBP_LOCATION_ID                               (IDs de la ficha)
//
// Salvaguardas de negocio (no técnicas):
//   - MIN_RATING: no se publican en la home reseñas por debajo de 4 estrellas.
//   - MAX_REVIEWS: tope de reseñas mostradas.
//   - El "rol/sector" (p. ej. "Psicóloga · Sabadell") NO lo da Google: se anota a mano en
//     data/reviews.json y se PRESERVA entre sincronizaciones emparejando por reviewId.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = resolve(ROOT, "data/reviews.json");

const MIN_RATING = 4;
const MAX_REVIEWS = 12;
const STAR_NUM = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  GBP_ACCOUNT_ID,
  GBP_LOCATION_ID,
} = process.env;

function missingCreds() {
  return [
    ["GOOGLE_CLIENT_ID", GOOGLE_CLIENT_ID],
    ["GOOGLE_CLIENT_SECRET", GOOGLE_CLIENT_SECRET],
    ["GOOGLE_REFRESH_TOKEN", GOOGLE_REFRESH_TOKEN],
    ["GBP_ACCOUNT_ID", GBP_ACCOUNT_ID],
    ["GBP_LOCATION_ID", GBP_LOCATION_ID],
  ].filter(([, v]) => !v).map(([k]) => k);
}

// "Aroa Martín" -> "Aroa M." | "Pablo" -> "Pablo" (minimización: solo inicial de apellidos).
function shortenName(displayName) {
  const parts = String(displayName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return parts[0] || "Cliente";
  const rest = parts.slice(1).map((w) => w.charAt(0).toUpperCase() + ".").join(" ");
  return parts[0] + " " + rest;
}

function esMonthYear(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(d);
}

async function accessToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error("OAuth token: " + res.status + " " + (await res.text()));
  return (await res.json()).access_token;
}

async function fetchReviews(token) {
  const parent = `accounts/${GBP_ACCOUNT_ID}/locations/${GBP_LOCATION_ID}`;
  const url = `https://mybusiness.googleapis.com/v4/${parent}/reviews?pageSize=50`;
  const res = await fetch(url, { headers: { Authorization: "Bearer " + token } });
  if (!res.ok) throw new Error("Reviews API: " + res.status + " " + (await res.text()));
  return (await res.json()).reviews || [];
}

async function main() {
  const missing = missingCreds();
  if (missing.length) {
    console.log("fetch-google-reviews: sin credenciales (" + missing.join(", ") + "). No-op.");
    return; // salida 0: el workflow no falla antes de que exista el acceso a la API
  }

  const current = JSON.parse(readFileSync(DATA, "utf8"));
  const rolesById = new Map();
  for (const r of current.reviews || []) {
    if (r.reviewId && r.role) rolesById.set(r.reviewId, r.role);
  }

  const token = await accessToken();
  const raw = await fetchReviews(token);

  const mapped = raw
    .map((r) => ({
      reviewId: r.reviewId,
      name: shortenName(r.reviewer?.displayName),
      role: rolesById.get(r.reviewId) || "", // preserva el rol anotado a mano
      rating: STAR_NUM[r.starRating] || 0,
      date: esMonthYear(r.updateTime || r.createTime),
      text: (r.comment || "").trim(),
    }))
    .filter((r) => r.rating >= MIN_RATING && r.text)
    .slice(0, MAX_REVIEWS);

  if (!mapped.length) {
    console.log("fetch-google-reviews: 0 reseñas publicables (>=" + MIN_RATING + "★). No se toca el fichero.");
    return;
  }

  const next = { ...current, reviews: mapped };
  const before = JSON.stringify(current);
  const after = JSON.stringify(next);
  if (before === after) {
    console.log("fetch-google-reviews: sin cambios.");
    return;
  }
  writeFileSync(DATA, JSON.stringify(next, null, 2) + "\n");
  console.log("fetch-google-reviews: " + mapped.length + " reseña(s) escritas en data/reviews.json.");
}

main().catch((e) => {
  console.error("fetch-google-reviews:", e.message);
  process.exit(1);
});
