// Genera la tarjeta de marca (imagen OG/social, 1200x630) de cada articulo del
// blog: fondo navy + barra dorada + titulo + wordmark "SoyLegal360". On-brand,
// sin IA, determinista. PNG -> dist/blog/<slug>/og.png.
// Se ejecuta en el build, despues de que Astro haya creado dist/blog/<slug>/.
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

// mini-hiperscript para satori (sin JSX)
const h = (type, style, children) => ({ type, props: { style, children } });

function titleOf(md) {
  const m = md.match(/^titulo:\s*(.*)$/m);
  if (!m) return 'SoyLegal360';
  return m[1].trim().replace(/^["']|["']$/g, '');
}

function card(title) {
  const size = title.length > 55 ? 50 : 62;
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
        { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '70px 80px' },
        [
          h('div', { display: 'flex', color: GOLD, fontSize: 24, fontWeight: 400, letterSpacing: 4 }, 'BLOG  ·  SOYLEGAL360'),
          h('div', { display: 'flex', color: '#ffffff', fontSize: size, fontWeight: 700, lineHeight: 1.12, maxWidth: 1000 }, title),
          h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }, [
            h('div', { display: 'flex', fontSize: 32, fontWeight: 700 }, [
              h('div', { display: 'flex', color: '#ffffff' }, 'SoyLegal'),
              h('div', { display: 'flex', color: GOLD }, '360'),
            ]),
            h('div', { display: 'flex', color: '#cdd9ec', fontSize: 26, fontWeight: 400 }, 'soylegal360.es'),
          ]),
        ],
      ),
      h('div', { display: 'flex', height: 14, backgroundColor: GOLD }, ''),
    ],
  );
}

async function render(title) {
  const svg = await satori(card(title), {
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
console.log(`gen-og: ${n} tarjeta(s) OG generada(s) en dist/blog/<slug>/og.png`);
