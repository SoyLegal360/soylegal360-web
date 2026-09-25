// Sincroniza el menu principal COMPLETO (<nav id="site-nav">: enlaces, megamenu de
// Servicios, submenus, acceso de clientes y CTA) en todas las paginas a mano y en el
// componente Astro. La fuente de verdad es el <nav id="site-nav"> de index.html.
// Existe porque el menu se duplicaba a mano en 30+ ficheros y ya habia divergido
// (404 sin Especialidades, Formacion sin EIPD, Astro sin EIPD ni SaaS). Hasta sep-2026
// solo cubria el megamenu de Servicios; ahora cubre el menu entero.
//
//   node scripts/sync-header.mjs          -> reescribe los que difieran
//   node scripts/sync-header.mjs --check  -> solo lista los que difieren (exit 1)
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const RE = /<nav id="site-nav"[\s\S]*?<\/nav>/;
const norm = (s) => s.replace(/^[ \t]+/gm, '').replace(/\s+\n/g, '\n').trim();

const index = readFileSync(join(root, 'index.html'), 'utf8');
const srcMatch = index.match(RE);
const src = srcMatch?.[0];
// sangria del bloque en index.html, para re-sangrarlo con la del destino
const srcIndent = srcMatch ? (index.slice(0, srcMatch.index).match(/[ \t]*$/) || [''])[0] : '';
if (!src) { console.error('sync-header: index.html no tiene el menu principal'); process.exit(2); }

const targets = [
  ...readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !['node_modules', 'dist', '.git', 'src', 'scripts', 'tools', 'assets', 'data', 'marca'].includes(d.name))
    .map((d) => join(d.name, 'index.html')),
  '404.html',
  'src/components/SiteHeader.astro',
].filter((f) => f !== 'index.html' && existsSync(join(root, f)));

const check = process.argv.includes('--check');
const desfasados = [];
for (const f of targets) {
  const t = readFileSync(join(root, f), 'utf8');
  const m = t.match(RE);
  if (!m) continue;
  if (norm(m[0]) === norm(src)) continue;
  desfasados.push(f);
  if (!check) {
    // conserva la sangria de la primera linea del bloque destino
    const indent = (t.slice(0, m.index).match(/[ \t]*$/) || [''])[0];
    const bloque = src.split('\n').map((l, i) => (i === 0 ? l : indent + (l.startsWith(srcIndent) ? l.slice(srcIndent.length) : l))).join('\n');
    writeFileSync(join(root, f), t.replace(RE, bloque));
  }
}
export const desfasadosHeader = desfasados;
if (check) {
  if (desfasados.length) { console.error(`sync-header: ${desfasados.length} fichero(s) con el menu principal distinto a index.html:\n  ${desfasados.join('\n  ')}`); process.exit(1); }
  console.log('sync-header: menu principal coherente en todas las paginas.');
} else {
  console.log(desfasados.length ? `sync-header: menu principal reescrito en ${desfasados.length} fichero(s):\n  ${desfasados.join('\n  ')}` : 'sync-header: nada que sincronizar.');
}
