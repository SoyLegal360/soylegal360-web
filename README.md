# soylegal360-web

Web pública de SoyLegal360 (https://www.soylegal360.es). HTML estático en la raíz
(cabecera/menú/footer copiados en los 24 `*/index.html`) + blog en Astro (`src/`).
Vercel construye con `npm run build`: Astro genera el blog y `scripts/copy-static.mjs`
copia a `dist/` los ficheros trackeados en git (docs/, tools/, src/, scripts/ y este
README quedan fuera del deploy).

**Despliegue:** nunca directo a `main`. Rama → push → preview de Vercel → revisar →
merge (squash). El push exige la cuenta de empresa (`gh auth switch -u SoyLegal360`).

**Caché:** `/assets/*` se sirve con caché immutable de 1 año. Al editar
`assets/css/styles.css` o `assets/js/sl360-cookies.js` hay que subir el `?v=` con el
que se referencian en las 24 páginas y en `src/components/HeadCommon.astro`.

## Banner de cookies propio (`assets/js/sl360-cookies.js`)

Gestor de consentimiento de primera parte, sin CMP externo. Una sola categoría
opcional (estadística: GA4). Consent Mode v2 en modo básico: `gtag.js` no se carga
hasta que el usuario acepta. La elección se guarda 12 meses en la cookie
`sl360_consent` (JSON con versión y fecha). Retirada: enlace "Configurar cookies"
del footer (todas las páginas).

Reglas de mantenimiento:

- **Editar el JS** → subir el `?v=` en las 24 páginas + `HeadCommon.astro`.
- **Cambiar categorías o finalidades** → subir la constante `VERSION` del JS:
  invalida las elecciones guardadas y el banner vuelve a preguntar a todos.
  (Un cambio solo estético NO requiere subir `VERSION`.)
- **Integrar un tercero nuevo (o retirarlo), todo en el MISMO PR:**
  1. Clasificarlo (técnica / estadística / marketing...) y decidir si encaja en una
     categoría existente o exige toggle nuevo (+ `VERSION`).
  2. Condicionar su carga al consentimiento en `sl360-cookies.js` (como `loadGA`).
  3. Añadir sus dominios al CSP de `vercel.json` (sin esto el script ni se ejecuta:
     es la red de seguridad).
  4. Añadir sus cookies a la tabla de `/politica-de-cookies/` (+ fecha de revisión)
     y, si hay encargado nuevo, a `/politica-de-privacidad/`.
  5. Preview: probar aceptar / rechazar / retirar. Los textos legales los revisa
     una persona antes del merge.
- **Aceptar y Rechazar van siempre idénticos** (misma prominencia, guía AEPD).
  No es negociable por estética.
- **Vigilancia:** `.github/workflows/vigilancia-cookies.yml` compara cada mes las
  cookies reales de producción con las declaradas (`scripts/check-cookies.mjs`;
  también se lanza a mano desde Actions) y abre un issue si hay deriva.

## Reseñas (bloque "Clientes" en home y sobre-nosotros)

Fuente única: `data/reviews.json`. El bloque se genera desde ahí, no se edita a mano en
el HTML.

- **Añadir/editar una reseña:** edita `data/reviews.json` y ejecuta `npm run reviews`
  (reescribe entre los marcadores `REVIEWS:START/END` de `index.html` y
  `sobre-nosotros/index.html`). Commit del JSON + los dos HTML. El build también lo
  regenera (`build-reviews.mjs` va en `npm run build`), así que prod siempre refleja el JSON.
- **Formato:** tira continua (marquee) que se desliza sola y se pausa al pasar el ratón;
  respeta `prefers-reduced-motion`. El CSS/JS vive en la propia sección; el script solo
  genera las tarjetas.
- Campos: `name`, `role` (opcional), `rating` (1-5), `date` (texto), `text`.

### Sincronización automática con Google (pendiente de activar)

`.github/workflows/sync-resenas.yml` (día 4 de cada mes) lee las reseñas reales de la
ficha de Google, reescribe `data/reviews.json`, regenera los HTML y **abre un PR**. No
publica solo. Requiere, a cargo del titular de la cuenta:

1. Habilitar la **Google Business Profile API** (Google aprueba el proyecto) y crear
   credenciales OAuth con **refresh token** offline.
2. Secrets del repo: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`,
   `GBP_ACCOUNT_ID`, `GBP_LOCATION_ID`.
3. Settings → Actions → General → **"Allow GitHub Actions to create and approve pull
   requests"**.

Sin esos secrets el fetch es un **no-op** (el workflow no falla). Salvaguardas del
automático: no publica reseñas de <4 estrellas, minimiza el nombre ("Aroa Martín" →
"Aroa M.") y conserva el `role` anotado a mano emparejando por `reviewId`.

**Probar el pipeline sin Google** (respuesta simulada con la forma de la API):
```bash
GBP_FIXTURE=ruta/al/fixture.json node scripts/fetch-google-reviews.mjs && npm run reviews
```
Escribe `data/reviews.json` y regenera los HTML como lo haría la sincronización real.
Revierte los ficheros después (`git checkout`): el fixture son datos de prueba.
