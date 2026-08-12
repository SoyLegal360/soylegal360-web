// gen-rrss.mjs — Generador de IMÁGENES ILUSTRATIVAS para redes sociales (RRSS).
//
// OJO — no confundir con gen-og.mjs:
//   - gen-og.mjs  = tarjeta de marca PROGRAMÁTICA (satori/resvg): navy + logo real +
//                   título incrustado. Determinista, SIN IA. Es el OG del blog
//                   Nota: las tarjetas del blog PUEDEN llevar una ILUSTRACION de fondo (Codex)
//                   compuesta con el marco de marca via scripts/gen-blog-image.mjs; la tarjeta
//                   plana de gen-og es el fallback cuando el articulo no trae `imagen:`.
//   - gen-rrss.mjs (esto) = imagen ILUSTRATIVA generada por IA (OpenAI gpt-image) para
//                   posts de RRSS que necesitan un visual, no una tarjeta-título.
//
// Es una herramienta ON-DEMAND: NO forma parte del build de la web. Se lanza a mano
// cuando marketing prepara un lote de imágenes.
//
// Marcado legal: las imágenes de OpenAI salen marcadas C2PA + IPTC
// (digitalSourceType=trainedAlgorithmicMedia), lo que cubre el marcado del PROVEEDOR
// (AI Act art. 50.2). Ese marcado es FRÁGIL (muchas redes lo borran al subir) y NO
// sustituye una etiqueta visible. Para imágenes foto-realistas de PERSONAS aplica además
// el art. 50.4 (deepfake) + LO 1/1982 → dictamen de sl360-abogado-ia antes de usarlas.
// Las plantillas abstractas de marca son de bajo riesgo.
//
// Uso:
//   OPENAI_API_KEY=... node scripts/gen-rrss.mjs [ruta-config.json]
//   (por defecto lee rrss/posts.json; ejemplo en rrss/posts.example.json)
//
// Requiere Node 20+ (fetch nativo). Sin dependencias nuevas.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

// ---- Marca (misma paleta que gen-og.mjs y assets/css/styles.css) ----
const MARCA =
  'azul marino profundo #06142e / #06152c, acentos dorado/champán #c9a96e y #e2c684, ' +
  'acento cobre #c27b32, luz/blanco cálido #fffdf6';
const ESTILO =
  'estética corporativa, sobria, premium, editorial, limpia; render 3D suave o geometría ' +
  'abstracta elegante; iluminación cuidada; SIN NINGÚN TEXTO NI LETRAS dentro de la imagen; ' +
  'deja una amplia zona de espacio negativo para superponer un titular después';

// ---- API (verifica el id de modelo/params actuales en platform.openai.com/docs/guides/images) ----
const API_URL = process.env.OPENAI_IMAGE_URL || 'https://api.openai.com/v1/images/generations';
const MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';
const SIZE = process.env.OPENAI_IMAGE_SIZE || '1024x1024'; // cuadrado para IG/LinkedIn
const OUT_DIR = join(root, 'rrss', 'out');

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error('Falta OPENAI_API_KEY en el entorno. Aborto (no genero nada).');
  process.exit(1);
}

const configPath = process.argv[2] || join(root, 'rrss', 'posts.json');
if (!existsSync(configPath)) {
  console.error(
    `No encuentro la config: ${configPath}\n` +
      'Copia rrss/posts.example.json a rrss/posts.json y edítala.',
  );
  process.exit(1);
}

const posts = JSON.parse(readFileSync(configPath, 'utf8'));
if (!Array.isArray(posts) || posts.length === 0) {
  console.error('La config debe ser un array de posts no vacío.');
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

function buildPrompt(post) {
  return (
    'Imagen para una publicación de redes sociales de una consultoría legaltech española ' +
    `(protección de datos RGPD e IA). Concepto: ${post.concepto}. ` +
    `Paleta de marca (respétala): ${MARCA}. ${ESTILO}.`
  );
}

async function generar(post) {
  const body = { model: MODEL, prompt: buildPrompt(post), size: SIZE, n: 1 };
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error('Respuesta sin b64_json (revisa el modelo/formato de la API).');
  const out = join(OUT_DIR, `${post.slug}.png`);
  writeFileSync(out, Buffer.from(b64, 'base64'));
  return out;
}

let ok = 0;
for (const post of posts) {
  if (!post.slug || !post.concepto) {
    console.warn(`Saltado (falta slug/concepto): ${JSON.stringify(post)}`);
    continue;
  }
  try {
    const out = await generar(post);
    console.log(`✓ ${post.slug} → ${out}`);
    ok++;
  } catch (e) {
    console.error(`✗ ${post.slug}: ${e.message}`);
  }
}
console.log(`\nListo: ${ok}/${posts.length} imágenes en ${OUT_DIR}`);
