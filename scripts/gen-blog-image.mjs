// gen-blog-image.mjs — compone la imagen de marca de un articulo del blog:
// ilustracion (la genera Codex por MCP, es un paso de AUTORIA, no de build) +
// marco de marca (logo + titulo + chip + barra dorada + degradado) -> WebP.
//
// NO se ejecuta en `npm run build`. Es una herramienta de autoria: la dispara
// el asistente en el pipeline /publicar despues de que Codex haya generado la
// ilustracion. Reutiliza el layout de gen-og.mjs para maxima consistencia.
//
// Requiere `sharp` instalado en el entorno que lo ejecuta (npm i sharp). NO es
// dependencia del build de Vercel (ese solo usa satori/resvg via gen-og).
//
// Uso:
//   node scripts/gen-blog-image.mjs <slug> <ruta-ilustracion.png> ["Titulo tarjeta opcional"]
// Salida: assets/img/blog/<slug>.webp  (recuerda anadir `imagen:` al frontmatter).
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const [, , slug, ilus, tituloArg] = process.argv;
if (!slug || !ilus) {
  console.error('Uso: node scripts/gen-blog-image.mjs <slug> <ruta-ilustracion.png> ["Titulo tarjeta"]');
  process.exit(1);
}

const root = process.cwd();
const NAVY = '#06152c', GOLD = '#c9a96e', GOLD_SOFT = '#e2c684';
const fontBold = readFileSync(join(root, 'src/og/fonts/PTSerif-700.woff'));
const fontReg = readFileSync(join(root, 'src/og/fonts/PTSerif-400.woff'));

// Titulo de la tarjeta: argumento > `titulo_tarjeta:` del .md > `titulo:` cortado
// en el primer ':' (o hasta el primer '?' incluido) para un titular corto.
const clean = (s) => s.trim().replace(/^["']|["']$/g, '').trim();
function cardTitle() {
  if (tituloArg) return clean(tituloArg);
  const md = readFileSync(join(root, `src/content/blog/${slug}.md`), 'utf8');
  const tt = md.match(/^titulo_tarjeta:\s*(.*)$/m);
  if (tt) return clean(tt[1]);
  const t = md.match(/^titulo:\s*(.*)$/m);
  if (!t) return 'SoyLegal360';
  const s = clean(t[1]);
  const ci = s.indexOf(':');
  if (ci >= 0) return s.slice(0, ci).trim();
  const qi = s.indexOf('?');
  if (qi >= 0) return s.slice(0, qi + 1).trim();
  return s;
}
const title = cardTitle();

// Logo blanco -> data uri (satori no rasteriza SVG externo)
const LOGO_H = 108;
const logoSvg = readFileSync(join(root, 'assets/img/soylegal360_logo_blanco_footer.svg'), 'utf8');
const logoPng = new Resvg(logoSvg, { fitTo: { mode: 'height', value: LOGO_H * 2 } }).render();
const logoUri = `data:image/png;base64,${logoPng.asPng().toString('base64')}`;
const LOGO_W = Math.round((logoPng.width / logoPng.height) * LOGO_H);

const h = (type, style, children) => ({ type, props: { style, children } });
const img = (src, width, height) => ({ type: 'img', props: { src, width, height } });

const size = title.length > 60 ? 48 : 60;
const frame = h('div', { width: 1200, height: 630, display: 'flex', flexDirection: 'column', fontFamily: 'PT Serif' }, [
  h('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '52px 64px 44px' }, [
    h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }, [
      img(logoUri, LOGO_W, LOGO_H),
      h('div', { display: 'flex', border: `2px solid ${GOLD}`, borderRadius: 999, padding: '10px 24px', color: GOLD_SOFT, fontSize: 26, fontWeight: 700, letterSpacing: 5 }, 'BLOG'),
    ]),
    h('div', { display: 'flex', color: '#ffffff', fontSize: size, fontWeight: 700, lineHeight: 1.14, maxWidth: 620 }, title),
    h('div', { display: 'flex', color: '#e9eff8', fontSize: 30, fontWeight: 700 }, 'soylegal360.es'),
  ]),
  h('div', { display: 'flex', height: 14, backgroundColor: GOLD }, ''),
]);

const svg = await satori(frame, {
  width: 1200, height: 630,
  fonts: [
    { name: 'PT Serif', data: fontBold, weight: 700, style: 'normal' },
    { name: 'PT Serif', data: fontReg, weight: 400, style: 'normal' },
  ],
});
const framePng = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

const grad = Buffer.from(
  `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${NAVY}" stop-opacity="0.95"/><stop offset="0.42" stop-color="${NAVY}" stop-opacity="0.76"/><stop offset="0.72" stop-color="${NAVY}" stop-opacity="0.2"/><stop offset="1" stop-color="${NAVY}" stop-opacity="0"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`
);

const base = await sharp(ilus).resize(1200, 630, { fit: 'cover' }).toBuffer();
const out = await sharp(base).composite([{ input: grad }, { input: framePng }]).webp({ quality: 78 }).toBuffer();

const outDir = join(root, 'assets/img/blog');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, `${slug}.webp`), out);
console.log(`gen-blog-image: ${Math.round(out.length / 1024)} KB -> assets/img/blog/${slug}.webp | titulo: "${title}"`);
