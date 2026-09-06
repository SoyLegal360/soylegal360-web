// Sincroniza el megamenu de "Servicios" en todas las paginas a mano y en el
// componente Astro. La fuente de verdad es el bloque <details class="services-menu">
// de index.html. Existe porque el menu se duplicaba a mano en 30 ficheros y ya
// habia divergido (404 sin Especialidades, Formacion sin EIPD, Astro sin EIPD ni SaaS).
//
//   node scripts/sync-header.mjs          -> reescribe los que difieran
//   node scripts/sync-header.mjs --check  -> solo lista los que difieren (exit 1)
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const RE = /<details class="services-menu">[\s\S]*?<\/details>/;
const norm = (s) => s.replace(/^[ \t]+/gm, '').replace(/\s+\n/g, '\n').trim();

const src = readFileSync(join(root, 'index.html'), 'utf8').match(RE)?.[0];
if (!src) { console.error('sync-header: index.html no tiene el megamenu'); process.exit(2); }

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
    const bloque = src.split('\n').map((l, i) => (i === 0 ? l : indent + l.replace(/^ {8}/, ''))).join('\n');
    writeFileSync(join(root, f), t.replace(RE, bloque));
  }
}
export const desfasadosHeader = desfasados;
if (check) {
  if (desfasados.length) { console.error(`sync-header: ${desfasados.length} fichero(s) con el megamenu distinto a index.html:\n  ${desfasados.join('\n  ')}`); process.exit(1); }
  console.log('sync-header: megamenu coherente en todas las paginas.');
} else {
  console.log(desfasados.length ? `sync-header: megamenu reescrito en ${desfasados.length} fichero(s):\n  ${desfasados.join('\n  ')}` : 'sync-header: nada que sincronizar.');
}
