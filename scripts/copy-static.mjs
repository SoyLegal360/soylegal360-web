// Ensambla dist/ = web actual (intacta) + /blog/ (que ya construyó Astro).
// Copia EXACTAMENTE los ficheros versionados en git que no son tooling de Astro,
// así dist/ replica byte a byte lo que hoy se despliega + añade el blog.
// Se ejecuta DESPUÉS de `astro build` (que ya ha escrito dist/blog/...).
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');

// Lo desplegado hoy = lo trackeado en git (lo gitignored no se sirve).
const tracked = execSync('git ls-files', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

// No copiar el tooling de Astro ni los ficheros de configuración del repo.
const skipPrefixes = ['src/', 'scripts/', '.claude/'];
const skipExact = new Set([
  'package.json',
  'package-lock.json',
  'astro.config.mjs',
  'tsconfig.json',
  'vercel.json', // config: la lee Vercel desde la raíz, no va en el output
  '.gitignore',
  '.htaccess', // legacy Apache, irrelevante en Vercel
  'serve.py',
  'deploy.sh',
  'README.md',
]);

let n = 0;
for (const file of tracked) {
  if (skipPrefixes.some((p) => file.startsWith(p))) continue;
  if (skipExact.has(file)) continue;
  const from = join(root, file);
  if (!existsSync(from)) continue; // trackeado pero borrado en el árbol de trabajo
  const to = join(dist, file);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to);
  n++;
}

console.log(`copy-static: ${n} ficheros de la web actual copiados a dist/`);
