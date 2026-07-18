// Genera la tarjeta de marca (imagen OG/social, 1200x630) de cada articulo del
// blog: fondo navy + logo blanco real + chip BLOG + titulo + barra dorada.
// Tamanos pensados para que la tarjeta se lea tambien como MINIATURA en el
// indice del blog (~450px): nada de textos por debajo de ~30px.
// PNG -> dist/blog/<slug>/og.png. Se ejecuta en el build, tras astro build.
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
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
const STATIC_PAGES = {
  'home': ['Protección de datos e IA para pymes y autónomos', 'SOYLEGAL360'],
  'servicios-proteccion-de-datos': ['Todos los servicios de cumplimiento', 'SERVICIOS'],
  'auditoria-web-gratuita': ['Auditoría web gratuita: informe en 48 horas', 'GRATIS'],
  'auditoria-rgpd': ['Auditoría RGPD a fondo para tu negocio', 'AUDITORÍA'],
  'auditoria-ia': ['Auditoría de IA y AI Act', 'AUDITORÍA'],
  'adaptacion-web-rgpd': ['Adaptación Web RGPD desde 390€', 'ADAPTACIÓN'],
  'adaptacion-empresa-rgpd': ['Adaptación RGPD de empresa completa', 'ADAPTACIÓN'],
  'adaptacion-ia': ['Adapta tu negocio al AI Act', 'ADAPTACIÓN'],
  'proteccion-legal-continua': ['Protección Legal Continua desde 49€/mes', 'PACKS'],
  'area-de-clientes': ['Tu departamento legal, siempre encendido', 'ÁREA CLIENTES'],
  'delegado-de-proteccion-de-datos-externalizado': ['Delegado de Protección de Datos externalizado', 'DPD'],
  'responsable-ia-externalizado': ['Responsable de IA externalizado', 'IA'],
  'delegado-de-ia-publico': ['Delegado de IA para el sector público', 'IA'],
  'web-legal-lista-en-7-dias': ['Web legal lista en 7 días', 'WEB LEGAL'],
  'consultoria-proteccion-de-datos': ['Consultoría de protección de datos desde 90€', 'CONSULTORÍA'],
  'consultoria-legal': ['Consultoría legal desde 120€/sesión', 'CONSULTORÍA'],
  'revision-de-contratos': ['Revisión de contratos desde 150€', 'CONTRATOS'],
  'ejercicio-de-derechos': ['Ejerce tus derechos RGPD: te representamos', 'PARTICULARES'],
  'como-funciona': ['Cómo trabajamos contigo, paso a paso', 'MÉTODO'],
  'sobre-nosotros': ['Quiénes somos y cómo trabajamos', 'NOSOTROS'],
  'contacto': ['Habla con SoyLegal360', 'CONTACTO'],
  'faqs': ['Preguntas frecuentes sobre RGPD e IA', 'FAQS'],
  'necesito-dpo': ['¿Necesito un DPO? Test orientativo en 1 minuto', 'HERRAMIENTA'],
};
const ogDir = join(root, 'dist/og');
if (!existsSync(ogDir)) mkdirSync(ogDir, { recursive: true });
let m = 0;
for (const [slug, [title, chip]] of Object.entries(STATIC_PAGES)) {
  writeFileSync(join(ogDir, `${slug}.png`), await render(title, chip));
  m++;
}

console.log(`gen-og: ${n} tarjeta(s) de articulo + portada + ${m} páginas estáticas`);
