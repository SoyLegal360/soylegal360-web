// Comprobaciones que deben pasar ANTES de publicar. Existen porque las dos
// cosas que ya se rompieron en produccion fallan en silencio: nadie ve un error,
// simplemente se sirve algo viejo.
//
//  1. Cache-busting: el mismo asset con dos `?v=` distintos. Paso el 22-ago con
//     styles.css (28 paginas en v=42 y el blog en v=40) y con site.js.
//  3. Megamenu coherente: el menu de Servicios se duplica a mano en 30 paginas y
//     el componente Astro; divergio en silencio (404, Formacion, SiteHeader).
//     Fuente de verdad: index.html. Arreglo: node scripts/sync-header.mjs
//  2. Frescura del sitemap: `lastmod` que ya no coincide con la fecha real de
//     git. Paso durante dos meses, con 24 URLs congeladas en 2026-06-12.
//
// Se ejecuta con `npm run check` y desde el hook de pre-push.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const root = process.cwd();
const BASE = 'https://www.soylegal360.es';
const problemas = [];

const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

// --- Ficheros que declaran assets: las paginas a mano y los componentes Astro.
const htmls = [
  ...readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !['node_modules', 'dist', '.git', 'src', 'scripts', 'tools', 'assets', 'data'].includes(d.name))
    .map((d) => join(d.name, 'index.html'))
    .filter((f) => existsSync(join(root, f))),
  'index.html',
  '404.html',
].filter((f) => existsSync(join(root, f)));

const astros = existsSync(join(root, 'src/components'))
  ? readdirSync(join(root, 'src/components')).filter((f) => f.endsWith('.astro')).map((f) => join('src/components', f))
  : [];

// --- 1. Cache-busting coherente
const versiones = new Map(); // asset -> Map(version -> [ficheros])
for (const f of [...htmls, ...astros]) {
  const s = readFileSync(join(root, f), 'utf8');
  for (const [, asset, v] of s.matchAll(/\/assets\/(?:css|js)\/([\w.-]+)\?v=(\d+)/g)) {
    if (!versiones.has(asset)) versiones.set(asset, new Map());
    const m = versiones.get(asset);
    if (!m.has(v)) m.set(v, []);
    m.get(v).push(f);
  }
}
for (const [asset, m] of versiones) {
  if (m.size > 1) {
    const detalle = [...m.entries()]
      .map(([v, fs]) => `v=${v} en ${fs.length} (${fs.slice(0, 3).join(', ')}${fs.length > 3 ? '…' : ''})`)
      .join('  |  ');
    problemas.push(`Cache-busting: ${asset} se sirve con ${m.size} versiones distintas.\n     ${detalle}`);
  }
}

// --- 2. Sitemap al dia (solo si el repo tiene historia completa)
let shallow = true;
try {
  shallow = git(['rev-parse', '--is-shallow-repository']) === 'true';
} catch {
  shallow = true;
}
if (!shallow && existsSync(join(root, 'sitemap.xml'))) {
  const xml = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  const desfasadas = [];
  for (const [, loc, lastmod] of xml.matchAll(/<loc>(.*?)<\/loc><lastmod>(.*?)<\/lastmod>/g)) {
    if (loc.includes('/blog/')) continue; // esas las manda el frontmatter
    const path = loc.replace(BASE, '');
    const file = path === '/' ? 'index.html' : `${path.replace(/^\/|\/$/g, '')}/index.html`;
    if (!existsSync(join(root, file))) continue;
    const real = git(['status', '--porcelain', '--', file]) !== ''
      ? new Date().toISOString().slice(0, 10)
      : git(['log', '-1', '--format=%cs', '--', file]);
    if (real && real !== lastmod) desfasadas.push(`${path} (sitemap ${lastmod}, real ${real})`);
  }
  if (desfasadas.length) {
    problemas.push(
      `Sitemap desfasado en ${desfasadas.length} URL(s). Ejecuta: npm run sitemap\n     ${desfasadas.slice(0, 5).join('\n     ')}${desfasadas.length > 5 ? `\n     …y ${desfasadas.length - 5} mas` : ''}`,
    );
  }
}

// --- 3. Megamenu coherente con index.html
try {
  execFileSync('node', ['scripts/sync-header.mjs', '--check'], { cwd: root, stdio: 'pipe' });
} catch (e) {
  problemas.push(`Megamenu de Servicios distinto en alguna pagina. Ejecuta: node scripts/sync-header.mjs\n     ${String(e.stderr || '').trim().split('\n').slice(1).join('\n     ')}`);
}

if (problemas.length) {
  console.error(`\n  Publicacion bloqueada — ${problemas.length} problema(s):\n`);
  problemas.forEach((p, i) => console.error(`  ${i + 1}. ${p}\n`));
  process.exit(1);
}
console.log(`check-publicacion: OK (${versiones.size} assets coherentes en ${htmls.length + astros.length} ficheros).`);
