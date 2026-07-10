// Vigilancia de cookies: comprueba con navegador real que las cookies que la web
// instala coinciden con las DECLARADAS en la politica de cookies, en los tres
// escenarios (sin elegir / rechazar / aceptar). Sale con codigo 1 si hay deriva,
// para que el workflow mensual abra un issue. No toca produccion: solo navega.
// Uso: node scripts/check-cookies.mjs  (SITE_URL para apuntar a un preview)
import { chromium } from 'playwright';

const BASE = process.env.SITE_URL || 'https://www.soylegal360.es';

// Fuente de verdad: la tabla de /politica-de-cookies/. Si cambia una, cambia la otra.
const DECLARADAS = new Set(['sl360_consent', '_ga', '_ga_5WPZXV6ZKC']);
// Con consentimiento aceptado, estas deben existir (si faltan, la analitica esta rota).
const ESPERADAS_TRAS_ACEPTAR = ['sl360_consent', '_ga', '_ga_5WPZXV6ZKC'];
const PAGINAS_EXTRA = ['/politica-de-cookies/', '/blog/'];

const problemas = [];

async function escenario(nombre, accion) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  if (accion) {
    await page.waitForSelector(`.sl360c [data-a="${accion}"]`, { timeout: 10000 });
    await page.click(`.sl360c [data-a="${accion}"]`);
    // Navegar mas paginas para que cualquier script consentido llegue a disparar.
    for (const ruta of PAGINAS_EXTRA) {
      await page.goto(BASE + ruta, { waitUntil: 'networkidle' });
    }
  }
  await page.waitForTimeout(3000);

  const cookies = await ctx.cookies();
  await browser.close();
  const nombres = [...new Set(cookies.map((c) => c.name))].sort();
  console.log(`[${nombre}] cookies: ${nombres.length ? nombres.join(', ') : '(ninguna)'}`);
  return nombres;
}

// 1) Sin interaccion: no puede instalarse NADA antes de que el usuario elija.
const previas = await escenario('sin elegir', null);
if (previas.length > 0) {
  problemas.push(`Se instalan cookies ANTES de la eleccion del usuario: ${previas.join(', ')}`);
}

// 2) Rechazar: solo puede quedar la cookie tecnica de la eleccion.
const rechazadas = await escenario('rechazar', 'reject');
const sobranRechazo = rechazadas.filter((n) => n !== 'sl360_consent');
if (sobranRechazo.length > 0) {
  problemas.push(`Tras RECHAZAR quedan cookies no tecnicas: ${sobranRechazo.join(', ')}`);
}
if (!rechazadas.includes('sl360_consent')) {
  problemas.push('Tras RECHAZAR no se guarda sl360_consent (la eleccion no persiste).');
}

// 3) Aceptar: todas las cookies reales deben estar declaradas en la politica,
//    y las esperadas deben aparecer (GA funcionando).
const aceptadas = await escenario('aceptar', 'accept');
const noDeclaradas = aceptadas.filter((n) => !DECLARADAS.has(n));
if (noDeclaradas.length > 0) {
  problemas.push(
    `Cookies NO declaradas en la politica: ${noDeclaradas.join(', ')}. ` +
    'Anadirlas a la tabla de /politica-de-cookies/ (y al banner si requieren categoria nueva) o retirar el servicio que las instala.'
  );
}
const ausentes = ESPERADAS_TRAS_ACEPTAR.filter((n) => !aceptadas.includes(n));
if (ausentes.length > 0) {
  problemas.push(`Tras ACEPTAR faltan cookies esperadas: ${ausentes.join(', ')} (¿analitica rota o cambio de nombres de Google?).`);
}

console.log('');
if (problemas.length > 0) {
  console.log('RESULTADO: DERIVA DETECTADA entre la web y la politica de cookies');
  for (const p of problemas) console.log(`- ${p}`);
  console.log('\nRevisar: tabla de /politica-de-cookies/, banner (assets/js/sl360-cookies.js) y CSP (vercel.json).');
  process.exit(1);
}
console.log(`RESULTADO: OK. Las cookies reales de ${BASE} coinciden con las declaradas.`);
