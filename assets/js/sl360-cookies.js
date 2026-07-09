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

  /* ---------------------------------- UI ---------------------------------- */

  var CSS = "" +
    ".sl360c{position:fixed;left:0;right:0;bottom:0;z-index:100000;padding:14px;font-family:Arial,Helvetica,sans-serif}" +
    ".sl360c-card{width:min(1060px,100%);margin:0 auto;border:1px solid rgba(23,54,97,.22);border-radius:8px;padding:20px 22px;background:#fff;color:#16213D;box-shadow:0 24px 60px rgba(6,20,46,.28)}" +
    ".sl360c-title{margin:0 0 6px;color:#06142E;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:700}" +
    ".sl360c-text{margin:0;color:#46546b;font-size:14px;line-height:1.55}" +
    ".sl360c a{color:#2E568D;text-decoration:underline;text-underline-offset:3px}" +
    ".sl360c-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}" +
    ".sl360c-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;border-radius:8px;padding:11px 18px;cursor:pointer;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;transition:transform .15s ease,box-shadow .15s ease}" +
    ".sl360c-btn:hover{transform:translateY(-1px)}" +
    ".sl360c-btn:focus-visible{outline:3px solid #C9AA6F;outline-offset:2px}" +
    ".sl360c-btn-solid{border:1px solid transparent;color:#fff;background:linear-gradient(180deg,#12345D,#06142E)}" +
    ".sl360c-btn-ghost{border:1px solid rgba(23,54,97,.35);color:#06142E;background:#fff}" +
    ".sl360c-overlay{position:fixed;inset:0;z-index:100001;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(6,20,46,.55)}" +
    ".sl360c-panel{width:min(560px,100%);max-height:90vh;overflow:auto;border-radius:8px;padding:26px 24px;background:#fff;color:#16213D;font-family:Arial,Helvetica,sans-serif;box-shadow:0 34px 80px rgba(6,20,46,.4)}" +
    ".sl360c-panel h2{margin:0 0 8px;color:#06142E;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.15}" +
    ".sl360c-panel>p{margin:0 0 16px;color:#46546b;font-size:14px;line-height:1.55}" +
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
    "@media(max-width:640px){.sl360c{padding:10px}.sl360c-card{padding:16px}.sl360c-actions{flex-direction:column}.sl360c-btn{width:100%}}";

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
    if (banner) { banner.remove(); banner = null; }
  }

  function closePanel() {
    if (overlay) { overlay.remove(); overlay = null; }
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
          '<p class="sl360c-title">Cookies en esta web</p>' +
          '<p class="sl360c-text">Usamos cookies técnicas imprescindibles y, solo si las aceptas, cookies de estadística (Google Analytics 4) para medir el uso de la web y mejorar el contenido. Puedes cambiar tu decisión en cualquier momento desde el enlace Configurar cookies del pie de página. <a href="' + POLICY + '">Política de Cookies</a>.</p>' +
          '<div class="sl360c-actions">' +
            '<button type="button" class="sl360c-btn sl360c-btn-ghost" data-a="config">Configurar</button>' +
            '<button type="button" class="sl360c-btn sl360c-btn-solid" data-a="reject">Rechazar todas</button>' +
            '<button type="button" class="sl360c-btn sl360c-btn-solid" data-a="accept">Aceptar todas</button>' +
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
          '<div class="sl360c-actions">' +
            '<button type="button" class="sl360c-btn sl360c-btn-ghost" data-a="save">Guardar selección</button>' +
            '<button type="button" class="sl360c-btn sl360c-btn-solid" data-a="reject">Rechazar todas</button>' +
            '<button type="button" class="sl360c-btn sl360c-btn-solid" data-a="accept">Aceptar todas</button>' +
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
