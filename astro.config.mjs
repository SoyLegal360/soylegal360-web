import { defineConfig } from 'astro/config';

// La web actual (HTML estático hecho a mano) NO se toca: vive en sus carpetas y
// se ensambla en dist/ con scripts/copy-static.mjs tras el build de Astro.
// Astro solo construye la sección /blog/.
export default defineConfig({
  site: 'https://www.soylegal360.es',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
