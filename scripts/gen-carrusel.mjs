// gen-carrusel.mjs — genera las DIAPOSITIVAS de un carrusel para Instagram a partir de
// un JSON de contenido. Formato 4:5 (1080x1350), el que mas superficie ocupa en el feed.
//
// Hermano de gen-rrss-frame.mjs (tarjeta suelta con foto de fondo) y de gen-blog-image.mjs
// (OG del blog). NO forma parte del build de la web: herramienta on-demand de marketing.
//
// Sale PNG, no WebP: Instagram no acepta WebP al subir.
//
// Uso:
//   node scripts/gen-carrusel.mjs <config.json> <carpeta-salida>
//
// Config: { "slug": "...", "slides": [ { tipo, eyebrow, titulo, destacado, cuerpo, fondo } ] }
//   tipo:      "navy" (def.) | "crema" | "portada" (navy + fondo bajo velo)
//   destacado: linea del titular que va en dorado (opcional)
//   fondo:     ruta a ilustracion, solo para tipo "portada"
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const [configPath, outDir] = process.argv.slice(2);
if (!configPath || !outDir) {
  console.error('Uso: node scripts/gen-carrusel.mjs <config.json> <carpeta-salida>');
  process.exit(1);
}

const root = process.cwd();
const W = 1080, H = 1350;
const NAVY = '#06152c', GOLD = '#c9a96e', GOLD_SOFT = '#e2c684';
const CREMA = '#f6f2ea', TINTA = '#1c2433', TINTA_SUAVE = '#46506a', GOLD_OSCURO = '#9c7c3c';

const fontBold = readFileSync(join(root, 'src/og/fonts/PTSerif-700.woff'));
const fontReg = readFileSync(join(root, 'src/og/fonts/PTSerif-400.woff'));

// Logos -> data uri (satori no rasteriza SVG externo)
const LOGO_H = 88;
const logoUri = (file) => {
  const png = new Resvg(readFileSync(join(root, file), 'utf8'), {
    fitTo: { mode: 'height', value: LOGO_H * 3 },
  }).render();
  return {
    uri: `data:image/png;base64,${png.asPng().toString('base64')}`,
    w: Math.round((png.width / png.height) * LOGO_H),
  };
};
const logoBlanco = logoUri('assets/img/soylegal360_logo_blanco_footer.svg');
const logoColor = logoUri('assets/img/soylegal360_logo_color_header.svg');

const h = (type, style, children) => ({ type, props: { style, children } });
const img = (src, width, height) => ({ type: 'img', props: { src, width, height } });

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const slides = config.slides || [];
const total = String(slides.length).padStart(2, '0');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

// Cuerpo tipografico: el titular encoge cuanto mas largo, para que nunca desborde
const cuerpoTitular = (t = '', portada = false) => {
  const n = t.length;
  if (portada) return n > 70 ? 78 : n > 48 ? 88 : 96;
  return n > 96 ? 56 : n > 64 ? 64 : n > 40 ? 72 : 78;
};

for (const [i, s] of slides.entries()) {
  const n = String(i + 1).padStart(2, '0');
  const portada = s.tipo === 'portada';
  const crema = s.tipo === 'crema';
  const fg = crema ? TINTA : '#ffffff';
  const fgSuave = crema ? TINTA_SUAVE : '#d3ddef';
  const acento = crema ? GOLD_OSCURO : GOLD_SOFT;
  const logo = crema ? logoColor : logoBlanco;

  const titulo = s.titulo || '';
  const size = cuerpoTitular(titulo + (s.destacado || ''), portada);

  const topRow = h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, [
    img(logo.uri, logo.w, LOGO_H),
    h('div', { display: 'flex', color: acento, fontSize: 26, fontWeight: 700, letterSpacing: 3 }, `${n}/${total}`),
  ]);

  const centro = [];
  if (s.eyebrow) {
    centro.push(
      h('div', { display: 'flex', color: acento, fontSize: 25, fontWeight: 700, letterSpacing: 6, marginBottom: 26 }, s.eyebrow.toUpperCase()),
    );
  }
  if (titulo) {
    centro.push(h('div', { display: 'flex', color: fg, fontSize: size, fontWeight: 700, lineHeight: 1.1 }, titulo));
  }
  if (s.destacado) {
    centro.push(h('div', { display: 'flex', color: crema ? GOLD_OSCURO : GOLD, fontSize: size, fontWeight: 700, lineHeight: 1.1 }, s.destacado));
  }
  if (s.cuerpo) {
    centro.push(
      h('div', { display: 'flex', width: W - 176, marginTop: 38, color: fgSuave, fontSize: 37, fontWeight: 400, lineHeight: 1.45 }, s.cuerpo),
    );
  }

  const pie = h('div', { display: 'flex', width: W - 176, justifyContent: 'space-between', alignItems: 'center' }, [
    h('div', { display: 'flex', color: acento, fontSize: 27, fontWeight: 700, letterSpacing: 1 }, s.pie || 'soylegal360.es'),
    h('div', { display: 'flex', color: acento, fontSize: 27, fontWeight: 700 }, i + 1 < slides.length ? 'Desliza' : ''),
  ]);

  const marco = h(
    'div',
    {
      width: W, height: H, display: 'flex', flexDirection: 'column', fontFamily: 'PT Serif',
      backgroundColor: portada ? 'transparent' : crema ? CREMA : NAVY,
    },
    [
      h('div', { display: 'flex', flexDirection: 'column', flex: 1, padding: '74px 88px 58px' }, [
        topRow,
        h('div', { display: 'flex', flex: 1 }, ''),
        h('div', { display: 'flex', flexDirection: 'column' }, centro),
        h('div', { display: 'flex', marginTop: 56 }, [pie]),
      ]),
      h('div', { display: 'flex', height: 16, backgroundColor: crema ? GOLD_OSCURO : GOLD }, ''),
    ],
  );

  const svg = await satori(marco, {
    width: W, height: H,
    fonts: [
      { name: 'PT Serif', data: fontBold, weight: 700, style: 'normal' },
      { name: 'PT Serif', data: fontReg, weight: 400, style: 'normal' },
    ],
  });
  const capa = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();

  let out;
  if (portada && s.fondo) {
    // Velo navy fuerte: la ilustracion se intuye, el titular manda
    const velo = Buffer.from(
      `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs>` +
        `<linearGradient id="v" x1="0" y1="0" x2="0" y2="1">` +
        `<stop offset="0" stop-color="${NAVY}" stop-opacity="0.88"/>` +
        `<stop offset="0.45" stop-color="${NAVY}" stop-opacity="0.60"/>` +
        `<stop offset="1" stop-color="${NAVY}" stop-opacity="0.93"/></linearGradient></defs>` +
        `<rect width="${W}" height="${H}" fill="url(#v)"/></svg>`,
    );
    const base = await sharp(s.fondo).resize(W, H, { fit: 'cover', position: 'centre' }).toBuffer();
    out = await sharp(base).composite([{ input: velo }, { input: capa }]).png({ compressionLevel: 9 }).toBuffer();
  } else {
    out = await sharp(capa).png({ compressionLevel: 9 }).toBuffer();
  }

  const file = join(outDir, `${config.slug}-${n}.png`);
  writeFileSync(file, out);
  console.log(`  ${n}/${total}  ${String(Math.round(out.length / 1024)).padStart(4)} KB  ${file}`);
}
console.log(`\ngen-carrusel: ${slides.length} diapositivas ${W}x${H} en ${outDir}`);
