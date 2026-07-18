const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

// Mega-menu: abrir al hover con tolerancia al gap entre summary y menú
(function () {
  const sm = document.querySelector(".services-menu");
  if (!sm) return;
  let closeTimer;

  sm.addEventListener("mouseover", () => {
    clearTimeout(closeTimer);
    sm.setAttribute("open", "");
  });

  sm.addEventListener("mouseout", (e) => {
    if (!sm.contains(e.relatedTarget)) {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => sm.removeAttribute("open"), 150);
    }
  });
})();

// Carrusel de capturas del área privada (home + Protección Legal Continua):
// scroll-snap nativo + flechas/puntos, con autoplay que se pausa con hover/foco
// y respeta prefers-reduced-motion.
document.querySelectorAll("[data-carousel]").forEach((root) => {
  const track = root.querySelector("[data-track]");
  const dotsWrap = root.querySelector("[data-dots]");
  const prevBtn = root.querySelector("[data-prev]");
  const nextBtn = root.querySelector("[data-next]");
  const slides = track ? [...track.children] : [];
  if (!track || !slides.length) return;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir a la pantalla ${i + 1} de ${slides.length}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = [...dotsWrap.children];

  function activeIndex() {
    return Math.round(track.scrollLeft / track.clientWidth) || 0;
  }
  function paintDots() {
    const idx = activeIndex();
    dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
  }
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function goTo(i) {
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: track.clientWidth * clamped, behavior: reduceMotion ? "auto" : "smooth" });
  }

  prevBtn?.addEventListener("click", () => goTo(activeIndex() - 1));
  nextBtn?.addEventListener("click", () => goTo(activeIndex() + 1));
  track.addEventListener("scroll", () => {
    clearTimeout(track._scrollTimer);
    track._scrollTimer = setTimeout(paintDots, 80);
  });
  paintDots();

  // Vídeo de la demo: reproducir solo cuando está en pantalla (y por si el autoplay
  // del navegador no arranca solo, p. ej. con ahorro de datos).
  const vid = root.querySelector("video");
  if (vid && "IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) vid.play().catch(() => {});
        else vid.pause();
      });
    }, { threshold: 0.3 }).observe(vid);
  }

  if (!reduceMotion) {
    let timer;
    // La diapositiva con vídeo (demo) se queda más tiempo en pantalla que las capturas.
    const delayFor = () => (slides[activeIndex()]?.querySelector("video") ? 16000 : 5500);
    const tick = () => { goTo((activeIndex() + 1) % slides.length); start(); };
    const start = () => { clearTimeout(timer); timer = setTimeout(tick, delayFor()); };
    const stop = () => clearTimeout(timer);
    start();
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);
    // En táctil no hay mouseenter: la primera interacción del usuario
    // (deslizar o tocar) apaga el autoplay definitivamente.
    const kill = () => { stop(); root.removeEventListener("mouseleave", start); root.removeEventListener("focusout", start); };
    root.addEventListener("touchstart", kill, { passive: true, once: true });
    root.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") kill(); }, { once: true });
  }

  root.setAttribute("tabindex", "0");
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(activeIndex() - 1);
    if (e.key === "ArrowRight") goTo(activeIndex() + 1);
  });
});

// ── UX jul-2026: reveal al hacer scroll + tilt 3D en cards protagonistas ──
// Sin dependencias. Si no hay JS, html no lleva .sl-js y nada queda oculto.
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("sl-js");

  // Reveal: cards y bloques repetidos aparecen con fade+rise, escalonados por grupo.
  const revealSel =
    ".feature-card, .family-card, .entry-card, .content-card, .mini-card, " +
    ".directory-group, .steps article, .home-guide-route";
  const items = document.querySelectorAll(revealSel);
  if (items.length && "IntersectionObserver" in window && !reduceMotion) {
    const groups = new Map(); // padre → índice para escalonar la entrada
    items.forEach((el) => {
      const parent = el.parentElement;
      const i = groups.get(parent) || 0;
      groups.set(parent, i + 1);
      el.style.setProperty("--sl-reveal-delay", Math.min(i * 70, 350) + "ms");
      el.classList.add("sl-reveal");
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach((el) => io.observe(el));
    // Red de seguridad: si el observer no dispara (navegador raro, iframe,
    // renderizado throttled), a los 3 s se enseña todo y no se esconde nada.
    setTimeout(() => {
      if (!document.querySelector(".sl-reveal.is-in")) {
        items.forEach((el) => el.classList.add("is-in"));
        io.disconnect();
      }
    }, 3000);
  }

  // Tilt 3D: la card se inclina siguiendo el cursor (solo escritorio con ratón).
  if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const MAX_DEG = 5;
  document.querySelectorAll(".home-guide-route, .family-card, .entry-card").forEach((card) => {
    card.classList.add("sl-tilt");
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--tx", (x * MAX_DEG * 2).toFixed(2) + "deg");
      card.style.setProperty("--ty", (-y * MAX_DEG * 2).toFixed(2) + "deg");
      card.classList.add("is-tilting");
    });
    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-tilting");
      card.style.removeProperty("--tx");
      card.style.removeProperty("--ty");
    });
  });
})();


// ── Header: sombra sutil al despegarse del borde superior ──
(function () {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// ── Barra CTA fija en móvil (glass): auditoría gratis + WhatsApp ──
// Solo en pantallas táctiles estrechas y fuera de la home (el hero ya tiene su CTA).
(function () {
  if (window.matchMedia("(min-width: 721px)").matches) return;
  if (location.pathname === "/" || document.querySelector(".sl-mobile-cta")) return;
  var bar = document.createElement("div");
  bar.className = "sl-mobile-cta";
  bar.innerHTML =
    '<a class="sl-mobile-cta__main" href="https://app.soylegal360.es" rel="noopener">Auditoría web gratis</a>' +
    '<a class="sl-mobile-cta__wa" href="https://wa.me/34645668235?text=Hola%2C%20me%20gustar%C3%ADa%20informarme%20sobre%20vuestros%20servicios." target="_blank" rel="noopener" aria-label="WhatsApp">' +
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.13.56 4.2 1.62 6.03L4 29l8.13-1.58a12 12 0 0 0 3.9.65h.01c6.64 0 12.04-5.4 12.04-12.04C28.08 8.4 22.68 3 16.04 3Z"/></svg></a>';
  document.body.appendChild(bar);
  // Se esconde cuando el chat de ClaudIA está abierto para no tapar el input.
  var mo = new MutationObserver(function () {
    bar.style.display = document.body.classList.contains("sl-chat-open") ? "none" : "";
  });
  mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
})();
