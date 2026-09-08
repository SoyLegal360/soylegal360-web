// Ensambla dist/ = web actual (intacta) + /blog/ (que ya construyó Astro).
// Copia EXACTAMENTE los ficheros versionados en git que no son tooling de Astro,
// así dist/ replica byte a byte lo que hoy se despliega + añade el blog.
// Se ejecuta DESPUÉS de `astro build` (que ya ha escrito dist/blog/...).
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');

// No copiar el tooling de Astro, los ficheros de configuración del repo,
// ni docs/tools internos (trackeados en git pero que NO deben publicarse).
const skipPrefixes = [
  'src/', 'scripts/', '.claude/', 'docs/', 'tools/', 'data/',
  '.git/', '.vercel/', '.astro/', 'dist/', 'node_modules/',
  'published-embeds/', 'files-mentioned-by-the-user-brief/',
  'https-www-soylegal360-es-analiza-en/',
];
const skipExact = new Set([
  'package.json',
  'package-lock.json',
  'astro.config.mjs',
  'tsconfig.json',
  'vercel.json', // config: la lee Vercel desde la raíz, no va en el output
  '.gitignore',
  '.vercelignore',
  '.mcp.json',
  '.soylegal360-deploy.env',
  '.htaccess', // legacy Apache, irrelevante en Vercel
  'serve.py',
  'deploy.sh',
  'README.md',
]);

const shouldSkip = (file) =>
  skipExact.has(file) ||
  skipPrefixes.some((prefix) => file.startsWith(prefix)) ||
  /(^|\/)\.DS_Store$/.test(file) ||
  /(^|\/)\.env[^/]*$/.test(file) ||
  /(^|\/)[^/]+\.env$/.test(file);

// Vercel ejecuta `vercel build` desde el paquete subido por la CLI, que no
// contiene `.git`. Conservamos Git como fuente de verdad en local, pero el
// recorrido seguro permite construir el mismo sitio en previews sin copiar
// documentación, herramientas ni credenciales al resultado público.
function filesWithoutGit(dir, prefix = '') {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (shouldSkip(entry.isDirectory() ? `${relative}/` : relative)) continue;
    if (entry.isDirectory()) files.push(...filesWithoutGit(join(dir, entry.name), relative));
    else if (entry.isFile()) files.push(relative);
  }
  return files;
}

let tracked;
try {
  // Lo desplegado en local = lo trackeado en git (lo gitignored no se sirve).
  tracked = execSync('git ls-files', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
} catch {
  tracked = filesWithoutGit(root);
  console.log('copy-static: sin git disponible; se usa el inventario seguro del paquete de despliegue.');
}

let n = 0;
for (const file of tracked) {
  if (shouldSkip(file)) continue;
  const from = join(root, file);
  if (!existsSync(from)) continue; // trackeado pero borrado en el árbol de trabajo
  const to = join(dist, file);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to);
  n++;
}

console.log(`copy-static: ${n} ficheros de la web actual copiados a dist/`);
