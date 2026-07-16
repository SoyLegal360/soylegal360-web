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

  if (!reduceMotion) {
    let timer;
    const tick = () => goTo((activeIndex() + 1) % slides.length);
    const start = () => { timer = setInterval(tick, 5500); };
    const stop = () => clearInterval(timer);
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
