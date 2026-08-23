// Hook PreToolUse: se dispara con cada Bash, pero solo hace algo si el comando
// es un `git push`. En ese caso corre check-publicacion.mjs y, si falla, corta
// la publicacion explicando que hay que arreglar.
//
// Sale con codigo 2 (bloquea y devuelve stderr al modelo) solo cuando hay
// problemas reales. Cualquier fallo del propio hook sale con 0: un guardian
// roto no puede impedir trabajar.
import { execFileSync } from 'node:child_process';

const leerStdin = async () => {
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  return data;
};

let payload;
try {
  payload = JSON.parse(await leerStdin());
} catch {
  process.exit(0);
}

if (payload?.tool_name !== 'Bash') process.exit(0);
const cmd = payload?.tool_input?.command ?? '';

// `git push` en cualquier forma (con -C, con flags, encadenado con && o ;).
if (!/(^|[;&|]\s*)git\s+(-C\s+\S+\s+)?push\b/.test(cmd)) process.exit(0);
// `--dry-run` no publica nada.
if (/--dry-run\b/.test(cmd)) process.exit(0);

try {
  execFileSync('node', ['scripts/check-publicacion.mjs'], {
    cwd: process.env.CLAUDE_PROJECT_DIR ?? process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
} catch (err) {
  const salida = `${err.stdout ?? ''}${err.stderr ?? ''}`.trim();
  if (!salida) process.exit(0); // el script no llego a correr: no bloqueamos
  console.error(
    `Antes de publicar hay que arreglar esto (guardian de pre-push):\n\n${salida}\n\n` +
      'Estos fallos no dan error en el build ni se ven en el navegador: la web ' +
      'simplemente sirve algo viejo. Arreglalo y vuelve a intentar el push.',
  );
  process.exit(2);
}
process.exit(0);
