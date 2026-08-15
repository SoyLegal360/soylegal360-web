// gen-rrss-frame.mjs — compone una TARJETA DE MARCA para redes sociales:
// fondo (ilustracion Codex o foto de marca) + marco de marca (logo + titular + chip +
// degradado + barra dorada) -> WebP. Cuadrada por defecto (1080x1080, feed IG/LinkedIn);
// admite otros tamanos via --size (p. ej. 1200x627 para un hero apaisado de LinkedIn).
//
// Hermano de gen-blog-image.mjs (ese es el OG del blog, 1200x630 con chip "BLOG").
// NO forma parte del build de la web: herramienta on-demand de marketing.
//
// Requiere `sharp`, `satori` y `@resvg/resvg-js` (ya instalados para gen-blog-image /
// gen-og). Se ejecuta con el cwd en la raiz del repo (usa sus fuentes y su logo).
//
// Uso:
//   node scripts/gen-rrss-frame.mjs <fondo> <salida.webp> "<Titular>" ["CHIP"] [opciones]
//   Opciones (flags):
//     --size=WxH     tamano de salida (def. 1080x1080). Ej.: --size=1200x627
//     --gravity=g    recorte del fondo: centre|east|west|north|south (def. centre)
//     --sub="texto"  linea inferior bajo el titular (def. soylegal360.es; "" la quita)
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const args = process.argv.slice(2);
const flags = {};
const pos = [];
for (const a of args) {
  const m = a.match(/^--([a-z]+)=([\s\S]*)$/);
  if (m) flags[m[1]] = m[2];
  else pos.push(a);
}
const [ilus, outPath, tituloArg, chipArg] = pos;
if (!ilus || !outPath || !tituloArg) {
  console.error('Uso: node scripts/gen-rrss-frame.mjs <fondo> <salida.webp> "<Titular>" ["CHIP"] [--size=WxH] [--gravity=g] [--sub="texto"]');
  process.exit(1);
}

const root = process.cwd();
const [W, H] = (flags.size || '1080x1080').split('x').map(Number);
if (!W || !H) { console.error(`--size invalido: ${flags.size}`); process.exit(1); }
const gravity = flags.gravity || 'centre';
const sub = flags.sub !== undefined ? flags.sub : 'soylegal360.es';

const NAVY = '#06152c', GOLD = '#c9a96e', GOLD_SOFT = '#e2c684';
const clean = (s) => (s || '').trim().replace(/^["']|["']$/g, '').trim();
const title = clean(tituloArg);
const chip = clean(chipArg).toUpperCase();

const fontBold = readFileSync(join(root, 'src/og/fonts/PTSerif-700.woff'));
const fontReg = readFileSync(join(root, 'src/og/fonts/PTSerif-400.woff'));

// Logo blanco -> data uri (satori no rasteriza SVG externo)
const LOGO_H = 104;
const logoSvg = readFileSync(join(root, 'assets/img/soylegal360_logo_blanco_footer.svg'), 'utf8');
const logoPng = new Resvg(logoSvg, { fitTo: { mode: 'height', value: LOGO_H * 2 } }).render();
const logoUri = `data:image/png;base64,${logoPng.asPng().toString('base64')}`;
const LOGO_W = Math.round((logoPng.width / logoPng.height) * LOGO_H);

const h = (type, style, children) => ({ type, props: { style, children } });
const img = (src, width, height) => ({ type: 'img', props: { src, width, height } });

// Titular: cuanto mas largo, menor cuerpo (para que quepa)
const size = title.length > 58 ? 52 : title.length > 38 ? 60 : 70;

const topRow = h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }, [
  img(logoUri, LOGO_W, LOGO_H),
  chip
    ? h('div', { display: 'flex', border: `2px solid ${GOLD}`, borderRadius: 999, padding: '10px 24px', color: GOLD_SOFT, fontSize: 25, fontWeight: 700, letterSpacing: 4 }, chip)
    : h('div', { display: 'flex' }, ''),
]);

const bottomChildren = [
  h('div', { display: 'flex', color: '#ffffff', fontSize: size, fontWeight: 700, lineHeight: 1.12, maxWidth: Math.round(W * 0.82) }, title),
];
if (sub) bottomChildren.push(h('div', { display: 'flex', color: GOLD_SOFT, fontSize: 32, fontWeight: 700, marginTop: 20, letterSpacing: 1 }, sub));
const bottomBlock = h('div', { display: 'flex', flexDirection: 'column' }, bottomChildren);

const frame = h('div', { width: W, height: H, display: 'flex', flexDirection: 'column', fontFamily: 'PT Serif' }, [
  h('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '62px 72px 52px' }, [topRow, bottomBlock]),
  h('div', { display: 'flex', height: 18, backgroundColor: GOLD }, ''),
]);

const svg = await satori(frame, {
  width: W, height: H,
  fonts: [
    { name: 'PT Serif', data: fontBold, weight: 700, style: 'normal' },
    { name: 'PT Serif', data: fontReg, weight: 400, style: 'normal' },
  ],
});
const framePng = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();

// Doble degradado navy: velo suave arriba (logo legible) + fuerte abajo (titular legible)
const grad = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs>` +
    `<linearGradient id="b" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0.30" stop-color="${NAVY}" stop-opacity="0"/>` +
    `<stop offset="0.60" stop-color="${NAVY}" stop-opacity="0.38"/>` +
    `<stop offset="0.80" stop-color="${NAVY}" stop-opacity="0.82"/>` +
    `<stop offset="1" stop-color="${NAVY}" stop-opacity="0.97"/></linearGradient>` +
    `<linearGradient id="t" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${NAVY}" stop-opacity="0.55"/>` +
    `<stop offset="0.18" stop-color="${NAVY}" stop-opacity="0"/></linearGradient>` +
    `</defs>` +
    `<rect width="${W}" height="${H}" fill="url(#t)"/>` +
    `<rect width="${W}" height="${H}" fill="url(#b)"/></svg>`,
);

const baseImg = await sharp(ilus).resize(W, H, { fit: 'cover', position: gravity }).toBuffer();
const out = await sharp(baseImg).composite([{ input: grad }, { input: framePng }]).webp({ quality: 82 }).toBuffer();

const outDir = dirname(outPath);
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, out);
console.log(`gen-rrss-frame: ${W}x${H} ${Math.round(out.length / 1024)} KB -> ${outPath} | "${title}"${chip ? ` [${chip}]` : ''} (gravity:${gravity})`);
