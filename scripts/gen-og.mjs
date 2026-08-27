// Genera la tarjeta de marca (imagen OG/social, 1200x630) de cada articulo del
// blog: fondo navy + logo blanco real + chip BLOG + titulo + barra dorada.
// Tamanos pensados para que la tarjeta se lea tambien como MINIATURA en el
// indice del blog (~450px): nada de textos por debajo de ~30px.
// PNG -> dist/blog/<slug>/og.png. Se ejecuta en el build, tras astro build.
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const blogDir = join(root, 'src/content/blog');
const fontBold = readFileSync(join(root, 'src/og/fonts/PTSerif-700.woff'));
const fontReg = readFileSync(join(root, 'src/og/fonts/PTSerif-400.woff'));

const NAVY = '#06142e';
const NAVY2 = '#102c53';
const GOLD = '#c9a96e';
const GOLD_SOFT = '#e2c684';

// Logo real de marca (blanco, para fondo navy): el SVG del footer rasterizado
// a PNG con resvg y embebido como data URI (satori no rasteriza SVG externos).
const LOGO_H = 150; // px en la tarjeta (legible tambien en miniatura)
const logoSvg = readFileSync(join(root, 'assets/img/soylegal360_logo_blanco_footer.svg'), 'utf8');
const logoPng = new Resvg(logoSvg, { fitTo: { mode: 'height', value: LOGO_H * 2 } }).render();
const logoUri = `data:image/png;base64,${logoPng.asPng().toString('base64')}`;
const LOGO_W = Math.round((logoPng.width / logoPng.height) * LOGO_H);

// mini-hiperscript para satori (sin JSX)
const h = (type, style, children) => ({ type, props: { style, children } });
const img = (src, width, height) => ({ type: 'img', props: { src, width, height } });

function titleOf(md) {
  const m = md.match(/^titulo:\s*(.*)$/m);
  if (!m) return 'SoyLegal360';
  return m[1].trim().replace(/^["']|["']$/g, '');
}

function card(title, chip = 'BLOG') {
  const size = title.length > 60 ? 56 : 66;
  return h(
    'div',
    {
      width: 1200,
      height: 630,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: NAVY,
      backgroundImage: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
      fontFamily: 'PT Serif',
    },
    [
      h(
        'div',
        { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '56px 72px 48px' },
        [
          h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, [
            img(logoUri, LOGO_W, LOGO_H),
            h(
              'div',
              {
                display: 'flex',
                border: `2px solid ${GOLD}`,
                borderRadius: 999,
                padding: '12px 28px',
                color: GOLD_SOFT,
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: 6,
              },
              chip,
            ),
          ]),
          h('div', { display: 'flex', color: '#ffffff', fontSize: size, fontWeight: 700, lineHeight: 1.12, maxWidth: 1050 }, title),
          h('div', { display: 'flex', color: '#e9eff8', fontSize: 34, fontWeight: 700 }, 'soylegal360.es'),
        ],
      ),
      h('div', { display: 'flex', height: 14, backgroundColor: GOLD }, ''),
    ],
  );
}

async function render(title, chip) {
  const svg = await satori(card(title, chip), {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'PT Serif', data: fontBold, weight: 700, style: 'normal' },
      { name: 'PT Serif', data: fontReg, weight: 400, style: 'normal' },
    ],
  });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'));
let n = 0;
for (const f of files) {
  const slug = f.replace(/\.md$/, '');
  const title = titleOf(readFileSync(join(blogDir, f), 'utf8'));
  const outDir = join(root, 'dist/blog', slug);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const png = await render(title);
  writeFileSync(join(outDir, 'og.png'), png);
  n++;
}

// Tarjeta de la portada del blog (/blog/), para compartir el indice en redes
writeFileSync(join(root, 'dist/blog/og.png'), await render('Protección de datos e inteligencia artificial'));

// ── Tarjetas OG de las páginas estáticas (dist/og/<slug>.png) ──
// Sistema aprobado ago-2026: cada card lleva el fondo visual de su página bajo
// el velo navy + marco de marca (logo grande, chip, titular sin precios, dominio,
// barra dorada). Sin foto -> card de marca con el logo protagonista.
const NAVY_SOLID = '#06152c';

function logoAt(hpx) {
  const png = new Resvg(logoSvg, { fitTo: { mode: 'height', value: hpx * 2 } }).render();
  return { uri: `data:image/png;base64,${png.asPng().toString('base64')}`, w: Math.round((png.width / png.height) * hpx), h: hpx };
}

async function renderFrame(frame) {
  const svg = await satori(frame, { width: 1200, height: 630, fonts: [
    { name: 'PT Serif', data: fontBold, weight: 700, style: 'normal' },
    { name: 'PT Serif', data: fontReg, weight: 400, style: 'normal' },
  ]});
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

// Marco para cards CON foto: logo en pastilla navy + chip + titular abajo + dominio
async function photoCard(bgPath, title, chip, gravity = 'centre') {
  const W = 1200, H = 630;
  const logo = logoAt(150);
  const size = title.length > 42 ? 56 : 66;
  const frame = h('div', { width: W, height: H, display: 'flex', flexDirection: 'column', fontFamily: 'PT Serif' }, [
    h('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '48px 64px 42px' }, [
      h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }, [
        h('div', { display: 'flex', backgroundColor: 'rgba(6,21,44,.8)', borderRadius: 18, padding: '14px 22px' }, [img(logo.uri, logo.w, logo.h)]),
        chip
          ? h('div', { display: 'flex', border: `2px solid ${GOLD}`, borderRadius: 999, padding: '10px 24px', color: GOLD_SOFT, fontSize: 25, fontWeight: 700, letterSpacing: 4, backgroundColor: 'rgba(6,21,44,.62)' }, chip)
          : h('div', { display: 'flex' }, ''),
      ]),
      h('div', { display: 'flex', flexDirection: 'column' }, [
        h('div', { display: 'flex', color: '#ffffff', fontSize: size, fontWeight: 700, lineHeight: 1.12, maxWidth: 1000 }, title),
        h('div', { display: 'flex', color: GOLD_SOFT, fontSize: 32, fontWeight: 700, marginTop: 18, letterSpacing: 1 }, 'soylegal360.es'),
      ]),
    ]),
    h('div', { display: 'flex', height: 18, backgroundColor: GOLD }, ''),
  ]);
  const framePng = await renderFrame(frame);
  const grad = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs>` +
    `<linearGradient id="b" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0.35" stop-color="${NAVY_SOLID}" stop-opacity="0"/>` +
    `<stop offset="0.65" stop-color="${NAVY_SOLID}" stop-opacity="0.4"/>` +
    `<stop offset="1" stop-color="${NAVY_SOLID}" stop-opacity="0.95"/></linearGradient></defs>` +
    `<rect width="${W}" height="${H}" fill="${NAVY_SOLID}" fill-opacity="0.2"/>` +
    `<rect width="${W}" height="${H}" fill="url(#b)"/></svg>`);
  const base = await sharp(join(root, bgPath)).resize(W, H, { fit: 'cover', position: gravity }).toBuffer();
  return sharp(base).composite([{ input: grad }, { input: framePng }]).png({ palette: true, quality: 92, compressionLevel: 9 }).toBuffer();
}

// Card de marca (sin foto): logo protagonista centrado sobre navy con viñeta
async function brandCard(sub) {
  const W = 1200, H = 630;
  const logo = logoAt(230);
  const frame = h('div', { width: W, height: H, display: 'flex', flexDirection: 'column', fontFamily: 'PT Serif' }, [
    h('div', { display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '40px 72px' }, [
      img(logo.uri, logo.w, logo.h),
      h('div', { display: 'flex', color: '#ffffff', fontSize: 30, fontWeight: 400, marginTop: 36, letterSpacing: 1.5, textAlign: 'center' }, sub),
      h('div', { display: 'flex', color: GOLD_SOFT, fontSize: 28, fontWeight: 700, marginTop: 14, letterSpacing: 2 }, 'soylegal360.es'),
    ]),
    h('div', { display: 'flex', height: 18, backgroundColor: GOLD }, ''),
  ]);
  const framePng = await renderFrame(frame);
  const bg = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs>` +
    `<radialGradient id="g" cx="0.5" cy="0.42" r="0.75">` +
    `<stop offset="0" stop-color="#12305e"/><stop offset="1" stop-color="${NAVY_SOLID}"/></radialGradient></defs>` +
    `<rect width="${W}" height="${H}" fill="url(#g)"/></svg>`);
  return sharp(bg).composite([{ input: framePng }]).png({ palette: true, quality: 92, compressionLevel: 9 }).toBuffer();
}

// Home: torre nocturna anclada a la derecha + normativas + titular dorado centrado
async function homeCard() {
  const W = 1200, H = 630;
  const logo = logoAt(150);
  const frame = h('div', { width: W, height: H, display: 'flex', flexDirection: 'column', fontFamily: 'PT Serif' }, [
    h('div', { display: 'flex', flexDirection: 'column', flex: 1, padding: '48px 64px 42px' }, [
      img(logo.uri, logo.w, logo.h),
      h('div', { display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -30 }, [
        h('div', { display: 'flex', color: GOLD_SOFT, fontSize: 26, fontWeight: 700, letterSpacing: 7 }, 'RGPD · LOPDGDD · LSSICE · AI ACT'),
        h('div', { display: 'flex', color: GOLD_SOFT, fontSize: 92, fontWeight: 700, marginTop: 14, textShadow: '0 4px 26px rgba(2,10,23,.85)' }, 'Servicios jurídicos'),
        h('div', { display: 'flex', width: 560, height: 2, backgroundColor: GOLD, marginTop: 22, opacity: .85 }, ''),
        h('div', { display: 'flex', color: '#ffffff', fontSize: 30, fontWeight: 400, marginTop: 20, letterSpacing: 2 }, 'soylegal360.es'),
      ]),
    ]),
    h('div', { display: 'flex', height: 18, backgroundColor: GOLD }, ''),
  ]);
  const framePng = await renderFrame(frame);
  const grad = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">` +
    `<rect width="${W}" height="${H}" fill="${NAVY_SOLID}" fill-opacity="0.38"/></svg>`);
  const src = join(root, 'assets/img/torre-nocturna-banner.webp');
  const meta = await sharp(src).metadata();
  const scale = H / meta.height;
  const scaledW = Math.round(meta.width * scale);
  const base = await sharp(src).resize(scaledW, H)
    .extract({ left: Math.max(0, scaledW - W - 60), top: 0, width: W, height: H })
    .toBuffer();
  return sharp(base).composite([{ input: grad }, { input: framePng }]).png({ palette: true, quality: 92, compressionLevel: 9 }).toBuffer();
}

const SUB_MARCA = 'Protección de datos e IA para empresas, pymes, autónomos y profesionales';

// slug: [titulo (sin precios), chip, fondo (null = card de marca), gravity]
const STATIC_PAGES = {
  'servicios-proteccion-de-datos': ['Todos los servicios de cumplimiento', 'SERVICIOS', 'assets/img/hero-datos.webp'],
  'auditoria-web-gratuita': ['Auditoría web gratuita: informe en 48 horas', 'GRATIS', 'assets/img/hero-web.webp'],
  'auditoria-rgpd': ['Auditoría RGPD a fondo para tu negocio', 'AUDITORÍA', 'assets/img/hero-datos.webp'],
  'evaluacion-de-impacto-proteccion-de-datos': ['Evaluación de Impacto antes de tratar datos de alto riesgo', 'EIPD · ART. 35', 'assets/img/hero-datos.webp'],
  'auditoria-ia': ['Auditoría de IA y AI Act', 'AUDITORÍA', 'assets/img/hero-ia.webp'],
  'adaptacion-web-rgpd': ['Adaptación Web RGPD', 'ADAPTACIÓN', 'assets/img/hero-despacho-torre.webp'],
  'adaptacion-empresa-rgpd': ['Adaptación RGPD de empresa completa', 'ADAPTACIÓN', 'assets/img/hero-datos.webp'],
  'adaptacion-ia': ['Adapta tu negocio al AI Act', 'ADAPTACIÓN', 'assets/img/hero-ia.webp'],
  'proteccion-legal-continua': ['Protección Legal Continua', 'PACKS', 'assets/img/plc-hero-anillo.webp', 'east'],
  'area-de-clientes': ['Tu departamento legal, siempre encendido', 'ÁREA CLIENTES', 'assets/img/sl-app-dashboard.webp'],
  'delegado-de-proteccion-de-datos-externalizado': ['Delegado de Protección de Datos externalizado', 'DPD', 'assets/img/despacho/oficina-principal.webp'],
  'responsable-ia-externalizado': ['Responsable de IA externalizado', 'IA', 'assets/img/hero-ia.webp'],
  'delegado-de-ia-publico': ['Delegado de IA para el sector público', 'IA', 'assets/img/hero-ia.webp'],
  'web-legal-lista-en-7-dias': ['Web legal lista en 7 días', 'WEB LEGAL', 'assets/img/hero-web.webp'],
  'legal-para-saas-y-apps': ['Legal y RGPD para SaaS y apps', 'SAAS · APPS', 'assets/img/hero-saas.webp', 'east'],
  'consultoria-proteccion-de-datos': ['Consultoría de protección de datos', 'CONSULTORÍA', 'assets/img/hero-datos.webp'],
  'consultoria-legal': ['Consultoría legal', 'CONSULTORÍA', 'assets/img/despacho/oficina-sala-reunion.webp'],
  'revision-de-contratos': ['Revisión de contratos', 'CONTRATOS', 'assets/img/despacho/oficina-consulta.webp'],
  'ejercicio-de-derechos': ['Ejerce tus derechos RGPD: te representamos', 'PARTICULARES', 'assets/img/despacho/oficina-consulta.webp'],
  'como-funciona': ['Cómo trabajamos contigo, paso a paso', 'MÉTODO', 'assets/video/cf-abogado-poster.webp'],
  'sobre-nosotros': ['Quiénes somos y cómo trabajamos', 'NOSOTROS', 'assets/img/despacho/oficina-principal.webp'],
  'contacto': ['Habla con SoyLegal360', 'CONTACTO', 'assets/img/torre-nocturna-banner.webp', 'east'],
  'marcas': ['Registro y defensa de marcas', 'MARCAS', 'assets/img/hero-marcas.webp'],
  'faqs': ['Preguntas frecuentes sobre RGPD e IA', 'FAQS', null],
  'necesito-dpo': ['¿Necesito un DPO? Test orientativo en 1 minuto', 'HERRAMIENTA', null],
};
const ogDir = join(root, 'dist/og');
if (!existsSync(ogDir)) mkdirSync(ogDir, { recursive: true });
let m = 0;
writeFileSync(join(ogDir, 'home.png'), await homeCard()); m++;
writeFileSync(join(ogDir, 'marca.png'), await brandCard(SUB_MARCA)); m++; // legales y cualquier URL sin card propia
for (const [slug, [title, chip, bg, gravity]] of Object.entries(STATIC_PAGES)) {
  const png = bg ? await photoCard(bg, title, chip, gravity) : await brandCard(title);
  writeFileSync(join(ogDir, `${slug}.png`), png);
  m++;
}

console.log(`gen-og: ${n} tarjeta(s) de articulo + portada + ${m} páginas estáticas`);
