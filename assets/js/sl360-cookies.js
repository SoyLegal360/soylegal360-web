/* SoyLegal360: gestor de consentimiento de cookies propio (primera parte, sin CMP externo).
   Una sola categoria opcional: estadistica (Google Analytics 4).
   Consent Mode v2 en modo BASICO: gtag.js NO se carga hasta que el usuario acepta.
   La eleccion se guarda 12 meses en la cookie sl360_consent (JSON con version y fecha);
   si cambian las categorias o finalidades, subir VERSION para volver a preguntar.
   OJO: /assets/* se sirve con cache immutable de 1 año; al editar este fichero hay que
   subir el ?v= con el que se referencia en las paginas (igual que styles.css). */
(function () {
  "use strict";

  var GA_ID = "G-5WPZXV6ZKC";
  var COOKIE = "sl360_consent";
  var VERSION = 1;
  var MAX_AGE = 31536000; /* 12 meses (la AEPD recomienda no superar 24) */
  var POLICY = "/politica-de-cookies/";

  /* ---- Consent Mode v2: todo denegado por defecto hasta eleccion expresa ---- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  if (!window.gtag) { window.gtag = gtag; }
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted"
  });

  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded) { return; }
    gaLoaded = true;
    gtag("consent", "update", { analytics_storage: "granted" });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", GA_ID);
  }

  function readConsent() {
    var m = document.cookie.match(new RegExp("(?:^|;\\s*)" + COOKIE + "=([^;]*)"));
    if (!m) { return null; }
    try {
      var c = JSON.parse(decodeURIComponent(m[1]));
      return c && c.v === VERSION ? c : null; /* version antigua: se vuelve a preguntar */
    } catch (e) { return null; }
  }

  function writeConsent(analytics) {
    var value = { v: VERSION, ts: new Date().toISOString(), necessary: true, analytics: !!analytics };
    document.cookie = COOKIE + "=" + encodeURIComponent(JSON.stringify(value)) +
      "; Max-Age=" + MAX_AGE + "; Path=/; SameSite=Lax" +
      (location.protocol === "https:" ? "; Secure" : "");
    return value;
  }

  /* Borra las cookies de GA en todos los ambitos donde Google pudo fijarlas
     (host actual y dominio raiz, p. ej. .soylegal360.es). */
  function deleteGACookies() {
    var names = ["_ga", "_ga_" + GA_ID.replace(/^G-/, "")];
    var domains = ["", location.hostname, "." + location.hostname];
    var parts = location.hostname.split(".");
    if (parts.length > 2) { domains.push("." + parts.slice(-2).join(".")); }
    names.forEach(function (name) {
      domains.forEach(function (domain) {
        document.cookie = name + "=; Max-Age=0; Path=/" + (domain ? "; Domain=" + domain : "");
      });
    });
  }

  /* ---------------------------------- UI ----------------------------------
     Tarjeta compacta abajo a la izquierda (movil: hoja inferior), con la
     identidad del sitio: navy + filo dorado + Georgia. Aceptar y Rechazar
     IDENTICOS (guia AEPD: misma prominencia); Configurar en secundario. */

  var EASE = "cubic-bezier(.22,1,.36,1)";
  var CSS = "" +
    ".sl360c{position:fixed;left:18px;bottom:18px;z-index:100000;width:min(440px,calc(100vw - 36px));font-family:Arial,Helvetica,sans-serif;opacity:0;transform:translateY(26px);transition:opacity .55s " + EASE + ",transform .55s " + EASE + "}" +
    ".sl360c.is-in{opacity:1;transform:none}" +
    ".sl360c.is-out{opacity:0;transform:translateY(26px)}" +
    ".sl360c-card{position:relative;overflow:hidden;border:1px solid rgba(201,170,111,.4);border-radius:10px;padding:22px 22px 18px;color:#fff;background:linear-gradient(150deg,rgba(6,20,46,.99),rgba(13,33,64,.97) 55%,rgba(6,20,46,.99));box-shadow:0 30px 70px rgba(6,20,46,.45)}" +
    ".sl360c-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,#C9AA6F 30%,#D8BE83 50%,#C9AA6F 70%,transparent)}" +
    ".sl360c-head{display:flex;align-items:center;gap:10px;margin:0 0 8px}" +
    ".sl360c-head svg{flex:0 0 auto}" +
    ".sl360c-title{margin:0;color:#fff;font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:700;letter-spacing:0}" +
    ".sl360c-title span{color:#D8BE83}" +
    ".sl360c-text{margin:0;color:#cbd5e7;font-size:13.5px;line-height:1.6}" +
    ".sl360c-text a{color:#D8BE83;text-decoration:underline;text-underline-offset:3px}" +
    ".sl360c-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:15px}" +
    ".sl360c-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;border-radius:8px;padding:11px 10px;cursor:pointer;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;transition:transform .18s ease,box-shadow .18s ease,background .18s ease}" +
    ".sl360c-btn:hover{transform:translateY(-2px)}" +
    ".sl360c-btn:focus-visible{outline:3px solid #D8BE83;outline-offset:2px}" +
    ".sl360c-btn-gold{border:1px solid rgba(201,170,111,.6);color:#D8BE83;background:rgba(201,170,111,.09)}" +
    ".sl360c-btn-gold:hover{border-color:transparent;color:#06142E;background:linear-gradient(180deg,#D8BE83,#C9AA6F);box-shadow:0 16px 28px -14px rgba(201,170,111,.9)}" +
    ".sl360c-btn-ghost{grid-column:1 / -1;min-height:38px;border:1px solid rgba(255,255,255,.16);color:#cbd5e7;background:transparent}" +
    ".sl360c-btn-ghost:hover{border-color:rgba(255,255,255,.4);color:#fff;background:rgba(255,255,255,.06)}" +
    ".sl360c-overlay{position:fixed;inset:0;z-index:100001;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(6,20,46,.55);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);opacity:0;transition:opacity .3s ease}" +
    ".sl360c-overlay.is-in{opacity:1}" +
    ".sl360c-panel{width:min(560px,100%);max-height:90vh;overflow:auto;position:relative;border-radius:10px;padding:26px 24px;background:#fff;color:#16213D;font-family:Arial,Helvetica,sans-serif;box-shadow:0 34px 80px rgba(6,20,46,.4);transform:translateY(14px) scale(.98);transition:transform .35s " + EASE + "}" +
    ".sl360c-overlay.is-in .sl360c-panel{transform:none}" +
    ".sl360c-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,#C9AA6F 30%,#D8BE83 50%,#C9AA6F 70%,transparent)}" +
    ".sl360c-panel h2{margin:0 0 8px;color:#06142E;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.15}" +
    ".sl360c-panel>p{margin:0 0 16px;color:#46546b;font-size:14px;line-height:1.55}" +
    ".sl360c-panel a{color:#2E568D;text-decoration:underline;text-underline-offset:3px}" +
    ".sl360c-cat{border:1px solid rgba(23,54,97,.18);border-radius:8px;padding:14px 16px;background:#F8FAFD}" +
    ".sl360c-cat+.sl360c-cat{margin-top:10px}" +
    ".sl360c-cat-head{display:flex;align-items:center;justify-content:space-between;gap:12px}" +
    ".sl360c-cat b{color:#06142E;font-size:15px}" +
    ".sl360c-cat p{margin:8px 0 0;color:#46546b;font-size:13px;line-height:1.5}" +
    ".sl360c-badge{flex:0 0 auto;border:1px solid rgba(201,170,111,.55);border-radius:999px;padding:5px 10px;color:#6F5420;background:rgba(201,170,111,.16);font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}" +
    ".sl360c-switch{display:inline-flex;align-items:center;gap:8px;cursor:pointer}" +
    ".sl360c-switch input{width:42px;height:24px;margin:0;appearance:none;-webkit-appearance:none;border-radius:999px;background:#C6CFDD;position:relative;cursor:pointer;transition:background .15s ease}" +
    ".sl360c-switch input:focus-visible{outline:3px solid #C9AA6F;outline-offset:2px}" +
    ".sl360c-switch input::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .15s ease}" +
    ".sl360c-switch input:checked{background:linear-gradient(180deg,#D8BE83,#C9AA6F)}" +
    ".sl360c-switch input:checked::after{left:21px}" +
    ".sl360c-pactions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}" +
    ".sl360c-pactions .sl360c-btn{flex:1 1 auto}" +
    ".sl360c-pactions .sl360c-btn-navy{border:1px solid rgba(6,20,46,.35);color:#06142E;background:#fff}" +
    ".sl360c-pactions .sl360c-btn-navy:hover{border-color:transparent;color:#fff;background:linear-gradient(180deg,#12345D,#06142E);box-shadow:0 14px 26px -14px rgba(6,20,46,.55)}" +
    "@media(max-width:640px){.sl360c{left:10px;right:10px;bottom:10px;width:auto}.sl360c-card{padding:18px 16px 14px}.sl360c-btn{font-size:11px;letter-spacing:.03em}.sl360c-pactions{flex-direction:column}}" +
    "@media(prefers-reduced-motion:reduce){.sl360c,.sl360c-overlay,.sl360c-panel,.sl360c-btn{transition:none}.sl360c{opacity:1;transform:none}}";

  var SHIELD =
    '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M12 3l7 3v5c0 4.6-3 8.1-7 10-4-1.9-7-5.4-7-10V6l7-3z" stroke="#C9AA6F" stroke-width="1.6" fill="rgba(201,170,111,.14)"/>' +
      '<path d="M9 12l2 2 4-4.5" stroke="#D8BE83" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  var banner = null;
  var overlay = null;
  var lastFocus = null;

  function el(html) {
    var t = document.createElement("div");
    t.innerHTML = html;
    return t.firstElementChild;
  }

  function injectCSS() {
    if (document.getElementById("sl360c-style")) { return; }
    var s = document.createElement("style");
    s.id = "sl360c-style";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function hideBanner() {
    if (!banner) { return; }
    var b = banner;
    banner = null;
    b.classList.remove("is-in");
    b.classList.add("is-out");
    setTimeout(function () { b.remove(); }, 600);
  }

  function closePanel() {
    if (overlay) {
      var o = overlay;
      overlay = null;
      o.classList.remove("is-in");
      setTimeout(function () { o.remove(); }, 320);
    }
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    lastFocus = null;
  }

  /* Decision final del usuario: guarda, aplica y cierra la UI. */
  function decide(analytics) {
    var previous = readConsent();
    writeConsent(analytics);
    hideBanner();
    closePanel();
    if (analytics) {
      loadGA();
    } else {
      gtag("consent", "update", { analytics_storage: "denied" });
      deleteGACookies();
      /* Retirada real: si GA ya corria en esta pagina, recargar para descargarlo. */
      if (gaLoaded || (previous && previous.analytics)) { location.reload(); }
    }
    try {
      document.dispatchEvent(new CustomEvent("sl360:consent", { detail: { analytics: analytics } }));
    } catch (e) {}
  }

  function showBanner() {
    if (banner || overlay) { return; }
    injectCSS();
    banner = el(
      '<div class="sl360c" role="region" aria-label="Aviso de cookies">' +
        '<div class="sl360c-card">' +
          '<div class="sl360c-head">' + SHIELD +
            '<p class="sl360c-title">Cookies, <span>tú decides</span></p>' +
          '</div>' +
          '<p class="sl360c-text">Usamos cookies técnicas imprescindibles y, solo si las aceptas, cookies de estadística (Google Analytics 4) para mejorar el contenido. Cambia tu decisión cuando quieras desde Configurar cookies, en el pie de página. <a href="' + POLICY + '">Política de Cookies</a>.</p>' +
          '<div class="sl360c-actions">' +
            '<button type="button" class="sl360c-btn sl360c-btn-gold" data-a="reject">Rechazar todas</button>' +
            '<button type="button" class="sl360c-btn sl360c-btn-gold" data-a="accept">Aceptar todas</button>' +
            '<button type="button" class="sl360c-btn sl360c-btn-ghost" data-a="config">Configurar</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
    banner.addEventListener("click", function (e) {
      var b = e.target.closest("[data-a]");
      if (!b) { return; }
      var a = b.getAttribute("data-a");
      if (a === "accept") { decide(true); }
      if (a === "reject") { decide(false); }
      if (a === "config") { openPanel(); }
    });
    document.body.appendChild(banner);
    /* Entrada suave tras el primer render (sin JS de mas: solo una clase). */
    setTimeout(function () { if (banner) { banner.classList.add("is-in"); } }, 350);
  }

  function openPanel() {
    if (overlay) { return; }
    injectCSS();
    lastFocus = document.activeElement;
    var current = readConsent();
    overlay = el(
      '<div class="sl360c-overlay" role="dialog" aria-modal="true" aria-labelledby="sl360c-h">' +
        '<div class="sl360c-panel">' +
          '<h2 id="sl360c-h">Configura las cookies</h2>' +
          '<p>Elige qué cookies permites en esta web. Las técnicas no pueden desactivarse porque la web las necesita para funcionar. Más detalle en la <a href="' + POLICY + '">Política de Cookies</a>.</p>' +
          '<div class="sl360c-cat">' +
            '<div class="sl360c-cat-head"><b>Cookies técnicas</b><span class="sl360c-badge">Siempre activas</span></div>' +
            '<p>Imprescindibles para que la web funcione y para recordar tu elección de consentimiento (cookie propia sl360_consent). Exentas de consentimiento según el art. 22.2 LSSI-CE.</p>' +
          '</div>' +
          '<div class="sl360c-cat">' +
            '<div class="sl360c-cat-head"><b id="sl360c-al">Cookies de estadística</b>' +
              '<span class="sl360c-switch"><input type="checkbox" id="sl360c-analytics" aria-labelledby="sl360c-al"' + (current && current.analytics ? " checked" : "") + '></span>' +
            '</div>' +
            '<p>Google Analytics 4 (Google Ireland Ltd.). Miden de forma agregada qué páginas se visitan y cómo se usa la web para mejorar el contenido. Solo se instalan si las activas.</p>' +
          '</div>' +
          '<div class="sl360c-pactions">' +
            '<button type="button" class="sl360c-btn sl360c-btn-navy" data-a="save">Guardar selección</button>' +
            '<button type="button" class="sl360c-btn sl360c-btn-navy" data-a="reject">Rechazar todas</button>' +
            '<button type="button" class="sl360c-btn sl360c-btn-navy" data-a="accept">Aceptar todas</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) { dismissPanel(); return; }
      var b = e.target.closest("[data-a]");
      if (!b) { return; }
      var a = b.getAttribute("data-a");
      if (a === "accept") { decide(true); }
      if (a === "reject") { decide(false); }
      if (a === "save") { decide(overlay.querySelector("#sl360c-analytics").checked); }
    });
    overlay.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { dismissPanel(); }
    });
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { if (overlay) { overlay.classList.add("is-in"); } });
    overlay.querySelector("#sl360c-analytics").focus();
  }

  /* Cerrar el panel sin decidir: si aun no hay eleccion, vuelve a la primera capa. */
  function dismissPanel() {
    closePanel();
    if (!readConsent()) { showBanner(); }
  }

  /* --------------------------------- init --------------------------------- */

  function init() {
    var consent = readConsent();
    if (consent) {
      if (consent.analytics) { loadGA(); }
    } else {
      showBanner();
    }
    /* Enlaces "Configurar cookies" (pie de pagina) reabren el panel. */
    document.querySelectorAll("[data-sl360-cookies-open]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        hideBanner();
        openPanel();
      });
    });
  }

  window.SL360Cookies = { open: openPanel, get: readConsent };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
