// Pone en sitemap.xml el <lastmod> REAL de cada pagina estatica, leyendo la
// fecha del ultimo commit que toco su fichero. Antes estaban escritas a mano y
// se quedaron congeladas en 2026-06-12 mientras las paginas se editaban en
// agosto: el sitemap le decia a Google que no habia cambiado nada.
//
// Se ejecuta en `npm run build` (sobre dist/) y tambien a mano con
// `npm run sitemap` (sobre el sitemap.xml fuente, para dejarlo commiteado).
//
// Las URLs de /blog/ NO se tocan aqui: las pone inject-blog-sitemap.mjs a
// partir del frontmatter (`actualizado` o `fecha`), que es una decision
// editorial y no un retoque de fichero.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const root = process.cwd();
const BASE = 'https://www.soylegal360.es';
const target = process.argv.includes('--src')
  ? join(root, 'sitemap.xml')
  : join(root, 'dist/sitemap.xml');

const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

// En un clon superficial (Vercel clona con poca profundidad) `git log` devolveria
// la fecha del deploy para todo, que seria mentir en la direccion contraria.
// En ese caso se respetan los valores ya commiteados.
let shallow = true;
try {
  shallow = git(['rev-parse', '--is-shallow-repository']) === 'true';
} catch {
  console.log('sitemap-lastmod: sin git disponible, se mantienen los lastmod actuales.');
  process.exit(0);
}
if (shallow) {
  console.log('sitemap-lastmod: repo superficial, se mantienen los lastmod commiteados.');
  process.exit(0);
}

// URL -> fichero fuente que la genera.
const sourceFor = (loc) => {
  const path = loc.replace(BASE, '');
  if (path === '/') return 'index.html';
  return `${path.replace(/^\/|\/$/g, '')}/index.html`;
};

const fechaGit = (file) => {
  if (!existsSync(join(root, file))) return null;
  // %cs = fecha del commit en YYYY-MM-DD.
  const commit = git(['log', '-1', '--format=%cs', '--', file]);
  if (!commit) return null;
  // Si el fichero tiene cambios sin commitear, lo modificado es HOY.
  const sucio = git(['status', '--porcelain', '--', file]) !== '';
  return sucio ? new Date().toISOString().slice(0, 10) : commit;
};

let xml = readFileSync(target, 'utf8');
let tocados = 0;
const sinFuente = [];

// La sangria no es de fiar: alguna entrada se escribio a mano sin los dos espacios.
xml = xml.replace(/^([ \t]*)<url><loc>(.*?)<\/loc>(.*?)<\/url>/gm, (linea, sangria, loc, resto) => {
  if (loc.includes('/blog/')) return linea;
  const file = sourceFor(loc);
  const fecha = fechaGit(file);
  if (!fecha) {
    sinFuente.push(loc);
    return linea;
  }
  tocados += 1;
  const nuevo = resto.includes('<lastmod>')
    ? resto.replace(/<lastmod>.*?<\/lastmod>/, `<lastmod>${fecha}</lastmod>`)
    : `<lastmod>${fecha}</lastmod>${resto}`;
  return `${sangria || '  '}<url><loc>${loc}</loc>${nuevo}</url>`;
});

writeFileSync(target, xml);
console.log(`sitemap-lastmod: ${tocados} URL(s) con lastmod real de git.`);
if (sinFuente.length) {
  console.log(`sitemap-lastmod: SIN fichero fuente (revisar): ${sinFuente.join(', ')}`);
}
