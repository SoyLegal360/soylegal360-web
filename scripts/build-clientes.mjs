// Genera las tarjetas de cliente del bloque "Clientes" a partir de data/clientes.json
// y las inyecta entre los marcadores CLIENTES:START / CLIENTES:END en las páginas que
// muestran el bloque (home y sobre-nosotros). Fuente única de datos: data/clientes.json.
//
// Uso:  node scripts/build-clientes.mjs      (reescribe los HTML trackeados)
//       npm run clientes                      (idem)
//
// Mismo patrón que scripts/build-reviews.mjs: es codegen que reescribe ficheros
// trackeados, así que al añadir o editar un cliente se ejecuta y se commitea el
// resultado. El formato (CSS, animación de la banda de marcas) vive en el propio
// HTML; aquí solo se genera la parte que depende de los datos.
//
// Aviso de datos: cada socio que sale aquí es una persona identificada (nombre, cargo,
// foto, enlace a su perfil). Solo se publica con su autorización por escrito. Si alguien
// la retira, se borra su objeto de data/clientes.json y se vuelve a ejecutar esto.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TARGETS = [
  "index.html",
  "sobre-nosotros/index.html",
  "clientes/index.html",
  "revision-de-contratos/index.html",
  "consultoria-legal/index.html",
  "consultoria-proteccion-de-datos/index.html",
  "proteccion-legal-continua/index.html",
];
const START = "<!-- CLIENTES:START -->";
const END = "<!-- CLIENTES:END -->";

// Logotipo "in" de LinkedIn, como constante para no repetirlo en el JSON.
const LINKEDIN =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>';

// Glifo de Instagram, para los clientes que enlazan ahí en vez de a LinkedIn.
const INSTAGRAM =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>';

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// En lead y bio, **texto** sale destacado. Se escapa antes, así que el ** no puede
// colar etiquetas: solo marca los tramos que ya son texto plano.
const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

// Onda de audio: motivo de los clientes del mundo audiovisual. Determinista, para que
// dos ejecuciones seguidas den el mismo HTML y el diff quede limpio.
function onda() {
  let bars = "";
  const N = 110;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const env = Math.sin(Math.PI * t) ** 0.55;
    const g = Math.abs(Math.sin(i * 1.7) * 0.5 + Math.sin(i * 0.43) * 0.32 + Math.sin(i * 3.1) * 0.18);
    const h = Math.max(2, Math.round(env * g * 46));
    bars += `<rect x="${i * 4}" y="${(24 - h / 2).toFixed(1)}" width="2" height="${h}" rx="1"/>`;
  }
  return `<svg class="sl-cl__wave" viewBox="0 0 440 48" preserveAspectRatio="none" aria-hidden="true">${bars}</svg>`;
}

// Ola de mar: motivo de los clientes del mundo del surf y el mar. Tres líneas de ola
// periódicas que se desplazan a distinto ritmo (unas hacia un lado, otras hacia el
// otro), como el mar. Cada línea mide un periodo más que el lienzo y se traslada
// exactamente un periodo, así el bucle no tiene salto. La animación y el
// desvanecido de los bordes viven en styles.css (.sl-cl__wave--ola); con
// "reducir movimiento" se quedan quietas. Determinista, como la onda.
function ola() {
  const linea = (periodo, amp, y0, alpha, ancho, dur, sentido) => {
    let d = "";
    for (let x = 0; x <= 440 + periodo; x += 4) {
      const y = y0 + Math.sin((x / periodo) * 2 * Math.PI) * amp +
        Math.sin((x / periodo) * 6 * Math.PI) * amp * 0.12;
      d += (x ? "L" : "M") + x + " " + y.toFixed(1);
    }
    return (
      `<path d="${d}" fill="none" stroke="rgba(201,170,111,${alpha})" stroke-width="${ancho}" ` +
      `stroke-linecap="round" vector-effect="non-scaling-stroke" ` +
      `style="--p:${periodo}px;--d:${dur}s;animation-direction:${sentido}"/>`
    );
  };
  return (
    '<svg class="sl-cl__wave sl-cl__wave--ola" viewBox="0 0 440 48" preserveAspectRatio="none" aria-hidden="true">' +
    linea(110, 9, 24, 0.6, 2, 9, "normal") +
    linea(146, 6, 27, 0.32, 1.5, 14, "reverse") +
    linea(80, 3.5, 21, 0.2, 1, 7, "normal") +
    "</svg>"
  );
}

// Filete neutro para los clientes que no son del mundo audiovisual.
const FILETE =
  '<svg class="sl-cl__wave" viewBox="0 0 440 48" preserveAspectRatio="none" aria-hidden="true"><path d="M0 24H440" stroke="rgba(201,170,111,.45)" stroke-width="2" stroke-dasharray="2 6" fill="none"/></svg>';

// Sin foto, el círculo lleva las iniciales en dorado. Va en SVG con los colores en
// atributos para no tocar la hoja de estilos (y no obligar a subir su ?v=).
function iniciales(nombre) {
  const ini = String(nombre || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
  return (
    '<svg viewBox="0 0 66 66" width="66" height="66" style="display:block" aria-hidden="true">' +
    '<text x="33" y="33" dy=".35em" text-anchor="middle" fill="#D8BE83" ' +
    'font-family="Georgia,\'Times New Roman\',serif" font-size="23" letter-spacing="1">' +
    esc(ini) + "</text></svg>"
  );
}

function socio(p) {
  const foto = p.foto
    ? `<img src="${esc(p.foto.src)}" alt="${esc(p.nombre)}" width="${p.foto.lado}" height="${p.foto.lado}" loading="lazy" decoding="async">`
    : iniciales(p.nombre);
  return [
    '            <div class="sl-cl__p">',
    '              <span class="sl-cl__face">' + foto + "</span>",
    "              <span>",
    '                <span class="sl-cl__role">' + esc(p.rol) + "</span>",
    '                <span class="sl-cl__name">' + esc(p.nombre) + "</span>",
    p.bio ? '                <span class="sl-cl__bio">' + rich(p.bio) + "</span>" : "",
    p.linkedin
      ? '                <a class="sl-cl__li" href="' + esc(p.linkedin) + '" target="_blank" rel="noopener">' +
        LINKEDIN + " LinkedIn</a>"
      : "",
    "              </span>",
    "            </div>",
  ]
    .filter((x) => x !== "")
    .join("\n");
}

// La banda se desliza en bucle: se pinta el grupo dos veces y la animación desplaza
// media pista, así que el salto cae justo donde el segundo grupo repite al primero.
const tieneMarcas = (m) => Boolean(m && Array.isArray(m.items) && m.items.length);

function marcas(m) {
  if (!tieneMarcas(m)) return "";
  const grupo =
    '<div class="sl-cl__mq-group">' +
    m.items.map((x) => '<span class="sl-cl__wm">' + esc(x) + "</span>").join("") +
    "</div>";
  return [
    '        <div class="sl-cl__strip">',
    '          <span class="sl-cl__strip-lab">' + esc(m.etiqueta) + "</span>",
    '          <div class="sl-cl__mq"><div class="sl-cl__mq-track" style="--sl-cl-dur:' +
      esc(m.duracion || "46s") + '">' + grupo + grupo + "</div></div>",
    "        </div>",
  ].join("\n");
}

function tarjeta(c, i, total) {
  const l = c.logo;
  // El logo lleva a la web del cliente, igual que el enlace del pie.
  const img = '<img src="' + esc(l.src) + '" alt="' + esc(c.nombre) + '" width="' + l.ancho +
    '" height="' + l.alto + '" loading="lazy" decoding="async">';
  const logo = c.enlaces?.web
    ? '<a href="' + esc(c.enlaces.web.url) + '" target="_blank" rel="noopener" aria-label="' +
      esc(c.nombre) + ' (web)">' + img + "</a>"
    : img;
  const enlaces = [];
  if (c.enlaces?.web) {
    enlaces.push(
      '          <a href="' + esc(c.enlaces.web.url) + '" target="_blank" rel="noopener">' +
        esc(c.enlaces.web.texto) + " &#8594;</a>"
    );
  }
  if (c.enlaces?.linkedin) {
    enlaces.push(
      '          <a href="' + esc(c.enlaces.linkedin.url) + '" target="_blank" rel="noopener">' +
        LINKEDIN + " " + esc(c.enlaces.linkedin.texto) + "</a>"
    );
  }
  if (c.enlaces?.instagram) {
    enlaces.push(
      '          <a href="' + esc(c.enlaces.instagram.url) + '" target="_blank" rel="noopener">' +
        INSTAGRAM + " " + esc(c.enlaces.instagram.texto) + "</a>"
    );
  }
  return [
    '      <article class="sl-cl" role="group" aria-roledescription="diapositiva" aria-label="' +
      esc(c.nombre) + ", " + (i + 1) + " de " + total + '">',
    // Sin banda de marcas, los socios caerían pegados al pie: se les da el aire que
    // la banda daba con su margen. En línea para no tener que subir el ?v= del CSS.
    '        <div class="sl-cl__in"' + (tieneMarcas(c.marcas) ? "" : ' style="padding-bottom:28px"') + ">",
    '          <header class="sl-cl__top">',
    '            <p class="sl-cl__logo">' + logo + "</p>",
    '            <p class="sl-cl__tag">' + esc(c.etiqueta) + "<span>" + esc(c.meta) + "</span></p>",
    "          </header>",
    '          <p class="sl-cl__lead">' + rich(c.lead) + "</p>",
    "          " + (c.motivo === "onda" ? onda() : c.motivo === "ola" ? ola() : FILETE),
    '          <div class="sl-cl__crew">',
    (c.socios || []).map(socio).join("\n"),
    "          </div>",
    "        </div>",
    marcas(c.marcas),
    '        <div class="sl-cl__foot">',
    enlaces.join("\n"),
    "        </div>",
    "      </article>",
  ]
    .filter((x) => x !== "")
    .join("\n");
}

const FLECHA = (d) =>
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' +
  (d === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7") +
  '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// Carrusel: las tarjetas van una al lado de otra en una pista con scroll-snap (el
// dedo la arrastra sin JS). El script añade las flechas laterales, los puntos y el
// avance automático, que se para al pasar el ratón, al enfocar dentro, con la
// pestaña oculta, fuera de pantalla y con "reducir movimiento". Da la vuelta al
// llegar al final. Va en línea y una sola vez por página (se marca al montarse).
const SCRIPT = `<script>
(function(){
  document.querySelectorAll('[data-sl-cl]').forEach(function(root){
    if(root.getAttribute('data-sl-cl-on')) return;
    root.setAttribute('data-sl-cl-on','1');
    var vp = root.querySelector('[data-sl-cl-viewport]');
    var slides = [].slice.call(vp.querySelectorAll('.sl-cl'));
    var dots = [].slice.call(root.querySelectorAll('[data-sl-cl-dot]'));
    var n = slides.length; if(n < 2) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var cur = 0, hover = false, visible = true, timer = null, raf = 0;
    function pos(i){ return slides[i].offsetLeft - slides[0].offsetLeft; }
    function actual(){
      var max = vp.scrollWidth - vp.clientWidth;
      if(vp.scrollLeft >= max - 4) return n - 1;
      var best = 0, bd = Infinity;
      slides.forEach(function(s, i){ var d = Math.abs(pos(i) - vp.scrollLeft); if(d < bd){ bd = d; best = i; } });
      return best;
    }
    function pintar(){
      cur = actual();
      dots.forEach(function(d, i){ if(i === cur) d.setAttribute('aria-current','true'); else d.removeAttribute('aria-current'); });
    }
    function ir(i){
      i = (i + n) % n;
      vp.scrollTo({ left: pos(i), behavior: reduce.matches ? 'auto' : 'smooth' });
    }
    function parar(){ clearInterval(timer); timer = null; }
    function arrancar(){
      parar();
      if(reduce.matches) return;
      timer = setInterval(function(){
        if(hover || !visible || document.hidden || root.contains(document.activeElement)) return;
        ir(actual() + 1);
      }, 7000);
    }
    root.querySelector('[data-sl-cl-prev]').addEventListener('click', function(){ ir(actual() - 1); arrancar(); });
    root.querySelector('[data-sl-cl-next]').addEventListener('click', function(){ ir(actual() + 1); arrancar(); });
    dots.forEach(function(d, i){ d.addEventListener('click', function(){ ir(i); arrancar(); }); });
    vp.addEventListener('scroll', function(){ cancelAnimationFrame(raf); raf = requestAnimationFrame(pintar); }, { passive: true });
    vp.addEventListener('pointerdown', arrancar, { passive: true });
    root.addEventListener('mouseenter', function(){ hover = true; });
    root.addEventListener('mouseleave', function(){ hover = false; });
    root.addEventListener('keydown', function(e){
      if(e.key === 'ArrowLeft'){ e.preventDefault(); ir(actual() - 1); arrancar(); }
      if(e.key === 'ArrowRight'){ e.preventDefault(); ir(actual() + 1); arrancar(); }
    });
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(en){ visible = en[0].isIntersecting; }, { threshold: .25 }).observe(root);
    }
    if(reduce.addEventListener) reduce.addEventListener('change', arrancar);
    root.classList.add('is-on');
    pintar(); arrancar();
  });
})();
</script>`;

function main() {
  const data = JSON.parse(readFileSync(resolve(ROOT, "data/clientes.json"), "utf8"));
  const clientes = Array.isArray(data.clientes) ? data.clientes : [];
  if (!clientes.length) {
    console.error("build-clientes: data/clientes.json no tiene clientes; abortando.");
    process.exit(1);
  }
  const varios = clientes.length > 1;
  const controles = varios
    ? [
        '      <button class="sl-cl__arrow sl-cl__arrow--prev" type="button" data-sl-cl-prev aria-label="Cliente anterior">' +
          FLECHA("prev") + "</button>",
        '      <button class="sl-cl__arrow sl-cl__arrow--next" type="button" data-sl-cl-next aria-label="Cliente siguiente">' +
          FLECHA("next") + "</button>",
        '      <div class="sl-cl__dots">' +
          clientes
            .map((c, i) => '<button type="button" data-sl-cl-dot aria-label="Ver ' + esc(c.nombre) + '"' +
              (i === 0 ? ' aria-current="true"' : "") + "></button>")
            .join("") +
          "</div>",
      ].join("\n")
    : "";
  const block =
    '\n    <div class="sl-cl__carousel' + (varios ? "" : " sl-cl__carousel--solo") +
    ' sl-proof__reveal" data-sl-cl role="region" aria-roledescription="carrusel" aria-label="Clientes de SoyLegal360">\n' +
    '      <div class="sl-cl__viewport" data-sl-cl-viewport>\n' +
    '        <div class="sl-cl__track">\n' +
    clientes.map((c, i) => tarjeta(c, i, clientes.length)).join("\n") +
    "\n        </div>\n      </div>\n" +
    (controles ? controles + "\n" : "") +
    "    </div>\n" +
    (varios ? "    " + SCRIPT + "\n" : "") +
    "    ";

  let changed = 0;
  for (const rel of TARGETS) {
    const file = resolve(ROOT, rel);
    const html = readFileSync(file, "utf8");
    const s = html.indexOf(START);
    const e = html.indexOf(END);
    if (s === -1 || e === -1 || e < s) {
      console.error(`build-clientes: marcadores no encontrados en ${rel}; sáltalo.`);
      continue;
    }
    const next = html.slice(0, s + START.length) + block + html.slice(e);
    if (next !== html) {
      writeFileSync(file, next);
      changed++;
    }
  }
  console.log(`build-clientes: ${clientes.length} cliente(s) inyectado(s) en ${changed} fichero(s).`);
}

main();
