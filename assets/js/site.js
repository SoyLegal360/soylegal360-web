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
