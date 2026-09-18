/* Auditoría web en el sitio: URL → nota + hasta 3 líneas en lenguaje llano → correo para el PDF.
   Mejora progresiva de los formularios [data-quick-analyze]: sin JS (o si la API falla) el
   formulario sigue funcionando como antes y lleva a app.soylegal360.es.
   Backend: repo auditoria-rgpd (/api/audit devuelve `plain` y `leadToken`; /api/lead exige ese
   testigo). No carga terceros ni instala cookies: no toca el banner ni la política de cookies. */
(function () {
  "use strict";
  var API = "https://app.soylegal360.es";
  var forms = document.querySelectorAll("[data-quick-analyze]");
  if (!forms.length || !window.fetch) return;

  var CSS =
    ".sl-aud-err{margin:10px 0 0;color:#f3c9c9;font:14px/1.4 Arial,Helvetica,sans-serif}" +
    ".sl-aud{width:min(620px,100%);margin:0 auto;text-align:left;overflow:hidden;max-height:0;opacity:0;transform:translateY(-6px);transition:max-height .55s ease,opacity .4s ease,transform .4s ease,margin .4s ease}" +
    ".page-hero .sl-aud,.svc-hero .sl-aud{margin-left:0;margin-right:0}" +
    ".svc-hero .sl-aud__glass,.page-hero .sl-aud__glass{background:rgba(6,20,46,.94)}" +
    ".sl-aud.is-open{max-height:1100px;opacity:1;transform:none;margin-top:22px}" +
    ".sl-aud__glass{padding:24px 26px;border:1px solid rgba(255,255,255,.22);border-radius:16px;background:rgba(6,20,46,.58);-webkit-backdrop-filter:blur(14px) saturate(1.3);backdrop-filter:blur(14px) saturate(1.3);box-shadow:0 24px 60px -20px rgba(0,0,0,.5);color:#fff}" +
    ".sl-aud__head{display:flex;gap:18px;align-items:center}" +
    ".sl-aud__grade{flex:none;width:68px;height:68px;border:1.5px solid #c9a96e;border-radius:12px;display:grid;place-items:center;font:italic 700 38px/1 Georgia,'Times New Roman',serif;color:#e2c88b;background:rgba(201,169,110,.08)}" +
    ".sl-aud__dom{margin:0 0 4px;color:#e2c88b;font:800 11px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.2em;text-transform:uppercase;word-break:break-all}" +
    ".sl-aud__title{margin:0;font:700 clamp(19px,2vw,23px)/1.2 Georgia,'Times New Roman',serif;color:#fff}" +
    ".sl-aud__scale{margin:5px 0 0;font:13px/1.4 Arial,Helvetica,sans-serif;color:rgba(255,255,255,.62)}" +
    ".sl-aud__list{list-style:none;margin:18px 0 0;padding:0}" +
    ".sl-aud__list li{display:flex;gap:12px;padding:13px 0;border-top:1px solid rgba(255,255,255,.14);font:15px/1.5 Arial,Helvetica,sans-serif;color:rgba(255,255,255,.93)}" +
    ".sl-aud__dot{flex:none;width:9px;height:9px;margin-top:7px;border-radius:50%;background:#c9a96e}" +
    ".sl-aud__dot.is-open{background:transparent;border:1.5px solid rgba(255,255,255,.5)}" +
    ".sl-aud__list small{display:block;margin-top:2px;font-size:12.5px;color:rgba(255,255,255,.58)}" +
    ".sl-aud__cta{margin-top:6px;padding-top:18px;border-top:1px solid rgba(255,255,255,.14)}" +
    ".sl-aud__cta .button{width:100%;margin:0;justify-content:center;text-align:center}" +
    ".sl-aud__cta .button[disabled]{opacity:.6;cursor:default}" +
    ".sl-aud__fine{margin:12px 0 0;font:12px/1.55 Arial,Helvetica,sans-serif;color:rgba(255,255,255,.62)}" +
    ".sl-aud__fine a,.sl-aud__check a{color:rgba(255,255,255,.88)}" +
    ".sl-aud__fields{display:grid;grid-template-columns:1.3fr 1fr;gap:10px;margin-bottom:12px}" +
    ".sl-aud__fields input{min-width:0;min-height:50px;padding:12px 14px;border:1px solid rgba(255,255,255,.3);border-radius:8px;background:rgba(255,255,255,.14);color:#fff;font:15px/1.3 Arial,Helvetica,sans-serif}" +
    ".sl-aud__fields input::placeholder{color:rgba(255,255,255,.62)}" +
    ".sl-aud__fields input:focus{outline:2px solid rgba(201,169,110,.8);outline-offset:1px;background:rgba(255,255,255,.2)}" +
    ".sl-aud__check{display:flex;gap:10px;align-items:flex-start;margin:0 0 12px;font:13px/1.5 Arial,Helvetica,sans-serif;color:rgba(255,255,255,.86);cursor:pointer}" +
    ".sl-aud__check input{flex:none;width:18px;height:18px;margin-top:1px;accent-color:#c9a96e}" +
    ".sl-aud__hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}" +
    ".sl-aud__again{display:inline-block;margin-top:14px;background:none;border:0;padding:0;color:rgba(255,255,255,.72);font:13px/1.4 Arial,Helvetica,sans-serif;text-decoration:underline;cursor:pointer}" +
    ".sl-aud__load{text-align:center}" +
    ".sl-aud__load p{margin:0;font:15px/1.5 Arial,Helvetica,sans-serif;color:rgba(255,255,255,.9)}" +
    ".sl-aud__bar{height:2px;margin:16px auto 0;width:min(320px,80%);background:rgba(255,255,255,.16);border-radius:2px;overflow:hidden}" +
    ".sl-aud__bar i{display:block;height:100%;width:0;background:#c9a96e;transition:width 9s cubic-bezier(.1,.7,.2,1)}" +
    ".sl-aud__done{display:flex;gap:12px;align-items:flex-start;font:15px/1.5 Arial,Helvetica,sans-serif}" +
    ".sl-aud__done b{font:italic 700 20px/1.2 Georgia,serif;color:#e2c88b}" +
    ".published-hero.sl-aud-active .lead,.published-hero.sl-aud-active .eyebrow,.published-hero.sl-aud-active .hero-highlight,.published-hero.sl-aud-active .hero-facts{display:none}" +
    ".published-hero.sl-aud-active h1{font-size:clamp(24px,3vw,34px);margin-bottom:22px}" +
    "@media (max-width:560px){.sl-aud__fields{grid-template-columns:1fr}.sl-aud__glass{padding:20px 18px}.sl-aud__grade{width:56px;height:56px;font-size:32px}}" +
    "@media (prefers-reduced-motion:reduce){.sl-aud,.sl-aud__bar i{transition:none}}";
  var style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function track(name, params) {
    try { if (window.gtag) window.gtag("event", name, params || {}); } catch (e) {}
  }
  function post(path, body) {
    return fetch(API + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        return { ok: res.ok, status: res.status, data: data };
      });
    });
  }

  Array.prototype.forEach.call(forms, function (form) {
    var input = form.elements.url;
    var place = form.getAttribute("data-quick-analyze") || (form.closest(".published-hero") ? "home" : "landing");
    var hero = form.closest(".published-hero");
    var anchor = form.closest(".actions") || form;

    var err = document.createElement("p");
    err.className = "sl-aud-err";
    err.setAttribute("role", "alert");
    var panel = document.createElement("div");
    panel.className = "sl-aud";
    panel.setAttribute("aria-live", "polite");
    anchor.parentNode.insertBefore(err, anchor.nextSibling);
    anchor.parentNode.insertBefore(panel, err.nextSibling);

    var busy = false;
    var audit = null;

    function open(html) {
      panel.innerHTML = '<div class="sl-aud__glass">' + html + "</div>";
      panel.classList.add("is-open");
      if (hero) {
        hero.classList.add("sl-aud-active");
        try { hero.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) {}
      }
    }
    function reset() {
      panel.classList.remove("is-open");
      if (hero) hero.classList.remove("sl-aud-active");
      audit = null;
      input.value = "";
      input.focus();
    }
    function fallback(url) {
      // La API no responde: el camino de siempre (la herramienta en su propio dominio).
      window.location.href = API + "/?url=" + encodeURIComponent(url);
    }

    input.addEventListener("input", function () { err.textContent = ""; });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (busy) return;
      var raw = (input.value || "").trim();
      var host = raw.replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
      if (!/^[^\s.]+(\.[^\s.]+)+$/.test(host)) {
        err.textContent = "Escribe la dirección de tu web, por ejemplo tuweb.es";
        return;
      }
      var url = /^https?:\/\//i.test(raw) ? raw : "https://" + raw;
      busy = true;
      track("audit_start", { place: place });

      var steps = ["Comprobando la seguridad de " + host, "Revisando cookies y rastreadores", "Buscando tus textos legales"];
      var n = 0;
      open('<div class="sl-aud__load"><p>' + esc(steps[0]) + '</p><div class="sl-aud__bar"><i></i></div></div>');
      var stepEl = panel.querySelector("p");
      var bar = panel.querySelector("i");
      setTimeout(function () { if (bar) bar.style.width = "92%"; }, 30);
      var timer = setInterval(function () {
        n = Math.min(n + 1, steps.length - 1);
        if (stepEl) stepEl.textContent = steps[n];
      }, 1400);

      post("/api/audit", { url: url })
        .then(function (r) {
          clearInterval(timer);
          busy = false;
          if (!r.ok || !r.data || !r.data.plain) {
            if (r.status === 422 || r.status === 429 || r.status === 400) {
              panel.classList.remove("is-open");
              if (hero) hero.classList.remove("sl-aud-active");
              err.textContent = (r.data && r.data.error) || "No hemos podido analizar esa web. Revisa la dirección e inténtalo de nuevo.";
              return;
            }
            return fallback(url);
          }
          audit = r.data;
          audit._url = r.data.finalUrl || url;
          track("audit_result", { place: place, grade: audit.preliminaryGrade || audit.grade });
          showResult();
        })
        .catch(function () {
          clearInterval(timer);
          busy = false;
          fallback(url);
        });
    });

    function showResult() {
      var grade = audit.preliminaryGrade || audit.grade;
      var items = (audit.plain.risks || [])
        .map(function (r) {
          return (
            '<li><span class="sl-aud__dot' + (r.confirmed ? "" : " is-open") + '"></span><span>' + esc(r.text) +
            (r.confirmed ? "" : "<small>No lo hemos podido comprobar desde fuera.</small>") + "</span></li>"
          );
        })
        .join("");
      open(
        '<div class="sl-aud__head"><div class="sl-aud__grade" aria-label="Nota ' + esc(grade) + '">' + esc(grade) + "</div><div>" +
          '<p class="sl-aud__dom">' + esc(audit.domain) + "</p>" +
          '<p class="sl-aud__title">' + esc(audit.plain.headline) + "</p>" +
          '<p class="sl-aud__scale">Nota orientativa, de A (bien) a E (mal)</p></div></div>' +
          (items ? '<ul class="sl-aud__list">' + items + "</ul>" : "") +
          '<div class="sl-aud__cta"><button type="button" class="button gold" data-aud-pdf>Recibir el informe completo en PDF</button>' +
          '<p class="sl-aud__fine">Gratis. Incluye la lectura de tus textos legales y cómo arreglar cada punto. Solo comprobamos lo que se ve desde fuera de tu web: es una orientación, no un dictamen.</p></div>' +
          '<button type="button" class="sl-aud__again" data-aud-again>Analizar otra web</button>'
      );
      panel.querySelector("[data-aud-pdf]").addEventListener("click", showLead);
      panel.querySelector("[data-aud-again]").addEventListener("click", reset);
    }

    function showLead() {
      track("audit_pdf_click", { place: place });
      var cta = panel.querySelector(".sl-aud__cta");
      cta.innerHTML =
        '<form novalidate data-aud-lead><div class="sl-aud__fields">' +
        '<input type="email" name="email" placeholder="tu@correo.es" aria-label="Tu correo" autocomplete="email" required>' +
        '<input type="text" name="name" placeholder="Tu nombre (opcional)" aria-label="Tu nombre, opcional" autocomplete="name"></div>' +
        '<label class="sl-aud__hp" aria-hidden="true">No rellenes este campo<input type="text" name="website" tabindex="-1" autocomplete="off"></label>' +
        '<label class="sl-aud__check"><input type="checkbox" name="consent" required><span>He leído y acepto la <a href="/politica-de-privacidad/" target="_blank" rel="noopener">política de privacidad</a>.</span></label>' +
        '<p class="sl-aud-err" role="alert" style="margin:0 0 10px"></p>' +
        '<button type="submit" class="button gold">Enviarme el informe</button>' +
        '<p class="sl-aud__fine">Responsable: SoyLegal360. Finalidad: elaborar y enviarte el informe que pides sobre esta web. Base jurídica: tu consentimiento. Puedes ejercer tus derechos en privacidad@soylegal360.es.</p></form>';
      var lf = cta.querySelector("form");
      var lerr = cta.querySelector(".sl-aud-err");
      var btn = cta.querySelector("button");
      lf.elements.email.focus();
      lf.addEventListener("input", function () { lerr.textContent = ""; });
      lf.addEventListener("submit", function (ev) {
        ev.preventDefault();
        if (lf.elements.website.value) return; // bot
        var email = lf.elements.email.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { lerr.textContent = "Escribe un correo válido"; return; }
        if (!lf.elements.consent.checked) { lerr.textContent = "Marca la casilla de privacidad para poder enviarte el informe"; return; }
        btn.disabled = true;
        btn.textContent = "Enviando…";
        post("/api/lead", {
          email: email,
          name: lf.elements.name.value.trim(),
          url: audit._url,
          consent: true,
          marketing: false,
          token: audit.leadToken,
        })
          .then(function (r) {
            if (!r.ok) {
              btn.disabled = false;
              btn.textContent = "Enviarme el informe";
              lerr.textContent = (r.data && r.data.error) || "No se pudo enviar. Inténtalo de nuevo.";
              return;
            }
            track("generate_lead", { form_type: "auditoria-" + place });
            cta.innerHTML = '<div class="sl-aud__done"><b>Enviado.</b><span>Te llega en unos minutos a ' + esc(email) + ". Si no lo ves, mira en la carpeta de spam.</span></div>";
          })
          .catch(function () {
            btn.disabled = false;
            btn.textContent = "Enviarme el informe";
            lerr.textContent = "No se pudo enviar. Comprueba tu conexión e inténtalo de nuevo.";
          });
      });
    }
  });
})();
