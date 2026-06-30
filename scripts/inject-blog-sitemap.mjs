// Inyecta las URLs del blog en dist/sitemap.xml (el desplegado), leyendo los
// articulos de src/content/blog/. Asi el sitemap se actualiza SOLO cuando el
// cron anade un articulo: no hay que tocar el sitemap.xml fuente a mano.
// Se ejecuta DESPUES de copy-static.mjs (que ya copio el sitemap a dist/).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const blogDir = join(root, 'src/content/blog');
const sitemapPath = join(root, 'dist/sitemap.xml');
const BASE = 'https://www.soylegal360.es';

const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'));

const entries = [
  `  <url><loc>${BASE}/blog/</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
];
for (const f of files) {
  const slug = f.replace(/\.md$/, '');
  const src = readFileSync(join(blogDir, f), 'utf8');
  const m = src.match(/^fecha:\s*(\d{4}-\d{2}-\d{2})/m);
  const lastmod = m ? m[1] : new Date().toISOString().slice(0, 10);
  entries.push(
    `  <url><loc>${BASE}/blog/${slug}/</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
  );
}

let xml = readFileSync(sitemapPath, 'utf8');
xml = xml.replace('</urlset>', entries.join('\n') + '\n</urlset>');
writeFileSync(sitemapPath, xml);

console.log(`inject-blog-sitemap: ${entries.length} URL(s) de blog inyectadas en dist/sitemap.xml`);
