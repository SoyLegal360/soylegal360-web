/* Asistente virtual flotante de SoyLegal360 → POST al endpoint de chat (Vercel).
   Orienta sobre servicios/FAQs y deriva a humano. Sin dependencias, CSP-safe.
   La conversación NO se conserva: vive solo en esta página y en la petición. */
(function () {
  "use strict";

  var ENDPOINT = "https://app.soylegal360.es/api/chat";
  var CONTACT_ENDPOINT = "https://app.soylegal360.es/api/contact";
  var WHATSAPP =
    "https://wa.me/34645668235?text=Hola%2C%20me%20gustar%C3%ADa%20informarme%20sobre%20vuestros%20servicios.";

  var GREETING =
    "Hola, soy ClaudIA, el asistente virtual con IA de SoyLegal360. Puedo orientarte sobre nuestros servicios de protección de datos y cumplimiento de IA, o ayudarte a contactar con el equipo. ¿En qué te ayudo?";
  var ERROR_MSG =
    "Ahora mismo no puedo responder. Escríbenos por WhatsApp o desde /contacto/ y te respondemos en menos de 48 horas hábiles.";

  // Historial real enviado a la API (sin el saludo, que es solo de UI).
  var history = [];
  var sending = false;
  var leadFormOpen = false; // evita mostrar dos formularios a la vez
  var els = {};

  var STORE_KEY = "sl-chat-history"; // continuidad dentro de la sesión (solo navegador)
  var CHIPS = ["¿Qué servicios tenéis?", "¿Necesito un DPO?", "Precios", "Hablar con un abogado"];

  // Evento GA4 (sin datos personales; respeta el Consent Mode ya configurado).
  function track(name) {
    if (window.gtag) { try { window.gtag("event", name); } catch (e) {} }
  }
  // Guarda el historial SOLO en el navegador (sessionStorage), se borra al cerrar pestaña.
  function saveHistory() {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(history.slice(-24))); } catch (e) {}
  }

  function el(tag, cls, attrs) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (attrs) for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function scrollDown() {
    els.body.scrollTop = els.body.scrollHeight;
  }

  // El chat renderiza en texto plano (textContent, sin HTML = sin XSS). Pero el modelo
  // a veces emite markdown; lo quitamos aquí para que no se vean símbolos sueltos.
  function stripMarkdown(t) {
    return String(t || "")
      .replace(/\*\*(.*?)\*\*/g, "$1") // negrita **texto**
      .replace(/__(.*?)__/g, "$1") // negrita __texto__
      .replace(/`([^`]*)`/g, "$1") // código `texto`
      .replace(/(^|\n)\s*#{1,6}\s+/g, "$1") // encabezados ###
      .replace(/(^|\n)\s*[-*]\s+/g, "$1• "); // viñetas - / * -> •
  }

  // Etiquetas legibles para los enlaces (en vez de mostrar la ruta cruda).
  var LINK_LABELS = {
    "/contacto/": "formulario de contacto",
    "/servicios-proteccion-de-datos/": "todos los servicios",
    "/como-funciona/": "cómo funciona",
    "/faqs/": "preguntas frecuentes",
    "/sobre-nosotros/": "sobre nosotros",
    "/ejercicio-de-derechos/": "ejercicio de derechos",
    "/aviso-legal/": "aviso legal",
    "/politica-de-privacidad/": "política de privacidad",
    "/politica-de-cookies/": "política de cookies",
    "/auditoria-web-gratuita/": "auditoría web gratuita",
    "/auditoria-rgpd/": "auditoría RGPD",
    "/auditoria-ia/": "auditoría de IA",
    "/adaptacion-web-rgpd/": "adaptación web RGPD",
    "/adaptacion-empresa-rgpd/": "adaptación empresa RGPD",
    "/adaptacion-ia/": "adaptación a la IA",
    "/proteccion-legal-continua/": "protección legal continua",
    "/web-legal-lista-en-7-dias/": "web legal en 7 días",
    "/consultoria-proteccion-de-datos/": "consultoría de protección de datos",
    "/consultoria-legal/": "consultoría legal",
    "/revision-de-contratos/": "revisión de contratos",
    "/delegado-de-proteccion-de-datos-externalizado/": "DPO externalizado",
    "/responsable-ia-externalizado/": "responsable de IA externalizado",
    "/delegado-de-ia-publico/": "delegado de IA público"
  };

  // Convierte URLs y rutas del sitio en enlaces clicables SIN innerHTML (a prueba de XSS):
  // tokeniza el texto y crea nodos <a>/texto. Solo acepta http(s), wa.me y rutas /.../.
  function linkify(text) {
    var frag = document.createDocumentFragment();
    var re = /(https?:\/\/[^\s)]+)|(\bwa\.me\/\d+)|(\/(?:[a-z0-9-]+\/)+)/g;
    var last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var raw = m[0];
      var href, external, label, isCta = false;
      if (m[1]) {
        href = raw;
        external = !/(^https?:\/\/)([^/]*\.)?soylegal360\.es\//.test(raw) || /wa\.me/.test(raw);
        if (/^https?:\/\/app\.soylegal360\.es/i.test(raw)) { isCta = true; label = "Analizar mi web gratis"; }
        else label = /wa\.me/.test(raw) ? "WhatsApp" : raw;
      } else if (m[2]) {
        href = "https://" + raw; external = true; label = "WhatsApp";
      } else {
        href = raw; external = false; label = LINK_LABELS[raw] || raw; // ruta del sitio
      }
      if (/^https?:\/\//.test(href) || href.charAt(0) === "/") {
        var a = document.createElement("a");
        a.href = href;
        a.textContent = isCta ? label + " →" : label;
        a.className = isCta ? "sl-chat__cta" : "sl-chat__link";
        if (external) { a.target = "_blank"; a.rel = "noopener"; }
        frag.appendChild(a);
      } else {
        frag.appendChild(document.createTextNode(raw));
      }
      last = re.lastIndex;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    return frag;
  }

  function addBubble(role, text) {
    var b = el("div", "sl-chat__msg sl-chat__msg--" + role);
    if (role === "bot") b.appendChild(linkify(stripMarkdown(text)));
    else b.textContent = text;
    els.body.appendChild(b);
    scrollDown();
    return b;
  }

  function showTyping() {
    var t = el("div", "sl-chat__msg sl-chat__msg--bot sl-chat__typing");
    t.setAttribute("aria-label", "Escribiendo");
    t.innerHTML = "<span></span><span></span><span></span>";
    els.body.appendChild(t);
    scrollDown();
    return t;
  }

  function setSending(on) {
    sending = on;
    els.input.disabled = on;
    els.send.disabled = on;
  }

  // Formulario de contacto con casilla de consentimiento (acto afirmativo del visitante).
  // El lead solo se registra al marcar la casilla y enviar → POST /api/contact (Tipo=chat).
  function renderLeadForm(prefill) {
    if (leadFormOpen) return;
    leadFormOpen = true;
    prefill = prefill || {};

    var form = el("form", "sl-chat__lead");
    var field = function (name, type, ph, val) {
      var i = el("input", "sl-chat__lead-input", {
        type: type,
        name: name,
        placeholder: ph,
        autocomplete: name === "email" ? "email" : name === "phone" ? "tel" : "name"
      });
      if (val) i.value = val;
      return i;
    };
    var nombre = field("name", "text", "Nombre", prefill.nombre || "");
    var email = field("email", "email", "Email", prefill.email || "");
    var tel = field("phone", "tel", "Teléfono (opcional)", "");

    // Desplegable para calificar el lead. Mantener idéntico a TIPOS_CONSULTA del backend
    // (chat-kb.ts) y a las opciones del campo "Tipo de consulta" de Notion.
    var TIPOS_CONSULTA = [
      "Brecha o robo de datos", "Auditoría (web/RGPD/IA)", "Adaptación al RGPD",
      "Cumplimiento de IA (AI Act)", "DPO / Responsable de IA", "Revisión de contratos",
      "Ejercicio de derechos", "Otro"
    ];
    var tipo = el("select", "sl-chat__lead-input sl-chat__lead-select", { name: "tipoConsulta", "aria-label": "Tipo de consulta" });
    var tipoPh = el("option", null, { value: "" });
    tipoPh.textContent = "¿Sobre qué necesitas ayuda?";
    tipo.appendChild(tipoPh);
    TIPOS_CONSULTA.forEach(function (t) {
      var o = el("option", null, { value: t });
      o.textContent = t;
      tipo.appendChild(o);
    });

    var motivo = el("textarea", "sl-chat__lead-input sl-chat__lead-textarea", { name: "message", rows: "2", placeholder: "Cuéntanos brevemente tu caso (opcional)" });
    if (prefill.motivo) motivo.value = prefill.motivo;
    var honey = el("input", "sl-chat__honey", { type: "text", name: "website", tabindex: "-1", autocomplete: "off", "aria-hidden": "true" });

    var consentRow = el("label", "sl-chat__lead-consent");
    var consent = el("input", null, { type: "checkbox", name: "consent" });
    var consentText = el("span");
    consentText.innerHTML =
      'He leído y acepto la <a href="/politica-de-privacidad/" target="_blank" rel="noopener">política de privacidad</a>.';
    consentRow.appendChild(consent);
    consentRow.appendChild(consentText);

    var submit = el("button", "sl-chat__lead-submit", { type: "submit" });
    submit.textContent = "Enviar mis datos";
    var status = el("div", "sl-chat__lead-status");

    form.appendChild(nombre);
    form.appendChild(email);
    form.appendChild(tel);
    form.appendChild(tipo);
    form.appendChild(motivo);
    form.appendChild(honey);
    form.appendChild(consentRow);
    form.appendChild(submit);
    form.appendChild(status);
    els.body.appendChild(form);
    scrollDown();
    setTimeout(function () {
      (prefill.email ? tel : email).focus();
    }, 60);

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var mail = (email.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
        status.textContent = "Introduce un email válido.";
        return;
      }
      if (!tipo.value) {
        status.textContent = "Selecciona el tipo de consulta.";
        return;
      }
      if (!consent.checked) {
        status.textContent = "Debes aceptar la política de privacidad.";
        return;
      }
      submit.disabled = true;
      status.textContent = "Enviando…";

      fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "chat",
          name: (nombre.value || "").trim(),
          email: mail,
          phone: (tel.value || "").trim(),
          message: motivo.value || "",
          servicio: (prefill && prefill.servicio) || "",
          tipoConsulta: tipo.value || "",
          consent: true,
          marketing: false,
          website: honey.value || ""
        })
      })
        .then(function (r) {
          return r.json().catch(function () {
            return {};
          });
        })
        .then(function (data) {
          if (data && data.ok) {
            form.remove();
            track("chat_lead");
            var ok = "¡Listo! He pasado tus datos al equipo. Te escribirán en menos de 48 horas hábiles. ¿Algo más en lo que te ayude?";
            addBubble("bot", ok);
            history.push({ role: "assistant", content: ok });
            saveHistory();
            leadFormOpen = false;
          } else {
            submit.disabled = false;
            status.textContent = (data && data.error) || "No se pudo enviar. Inténtalo de nuevo.";
          }
        })
        .catch(function () {
          submit.disabled = false;
          status.textContent = "No se pudo enviar. Escríbenos por WhatsApp o a hola@soylegal360.es.";
        });
    });
  }

  function send(text) {
    text = (text || "").trim();
    if (!text || sending) return;
    addBubble("user", text);
    history.push({ role: "user", content: text });
    saveHistory();
    track("chat_mensaje"); // GA4: 1 evento por mensaje (uso por usuario/sesión, sin PII; respeta consentimiento)
    els.input.value = "";
    setSending(true);
    var typing = showTyping();

    // Estado del turno en streaming (NDJSON: líneas {type:"delta"|"done"}).
    var bubble = null, acc = "", done = null, finished = false;

    function ensureBubble() {
      if (typing) { typing.remove(); typing = null; }
      if (!bubble) { bubble = el("div", "sl-chat__msg sl-chat__msg--bot"); els.body.appendChild(bubble); }
    }
    function handleEvent(ev) {
      if (!ev) return;
      if (ev.type === "delta") { ensureBubble(); acc += ev.text || ""; bubble.textContent = acc; scrollDown(); }
      else if (ev.type === "done") { done = ev; }
    }
    function parseLine(l) { l = (l || "").trim(); if (l) { try { handleEvent(JSON.parse(l)); } catch (e) {} } }
    function finalize() {
      if (finished) return;
      finished = true;
      if (typing) { typing.remove(); typing = null; }
      var finalText = acc.trim() ? acc : ((done && done.reply) || ERROR_MSG);
      if (!bubble) { bubble = el("div", "sl-chat__msg sl-chat__msg--bot"); els.body.appendChild(bubble); }
      bubble.textContent = "";
      bubble.appendChild(linkify(stripMarkdown(finalText)));
      scrollDown();
      history.push({ role: "assistant", content: finalText });
      saveHistory();
      setSending(false);
      if (done && done.cta === "lead_form") renderLeadForm(done.prefill);
      else els.input.focus();
    }

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: history.slice(-24),
        pageContext: { path: location.pathname, title: document.title },
        website: els.honey.value || ""
      })
    })
      .then(function (resp) {
        if (!resp.body || !resp.body.getReader) {
          // Navegador sin streaming → leer todo y procesar las líneas NDJSON.
          return resp.text().then(function (txt) { (txt || "").split("\n").forEach(parseLine); finalize(); });
        }
        var reader = resp.body.getReader(), dec = new TextDecoder(), buf = "";
        function pump() {
          return reader.read().then(function (r) {
            if (r.done) { buf += dec.decode(); buf.split("\n").forEach(parseLine); finalize(); return; }
            buf += dec.decode(r.value, { stream: true });
            var lines = buf.split("\n");
            buf = lines.pop();
            lines.forEach(parseLine);
            return pump();
          });
        }
        return pump();
      })
      .catch(function () {
        if (typing) { typing.remove(); typing = null; }
        if (!finished) { addBubble("bot", ERROR_MSG); setSending(false); }
      });
  }

  function renderChips() {
    var row = el("div", "sl-chat__chips");
    CHIPS.forEach(function (q) {
      var c = el("button", "sl-chat__chip", { type: "button" });
      c.textContent = q;
      c.addEventListener("click", function () { row.remove(); send(q); });
      row.appendChild(c);
    });
    els.body.appendChild(row);
    scrollDown();
  }

  function open() {
    els.panel.hidden = false;
    els.launcher.setAttribute("aria-expanded", "true");
    document.body.classList.add("sl-chat-open");
    track("chat_abierto");
    if (!els.body.dataset.seeded) {
      if (history.length) {
        // Continuidad: reproducir la conversación previa de esta sesión.
        history.forEach(function (m) { addBubble(m.role, m.content); });
      } else {
        addBubble("bot", GREETING);
        renderChips();
      }
      els.body.dataset.seeded = "1";
    }
    setTimeout(function () {
      els.input.focus();
    }, 60);
  }

  function close() {
    els.panel.hidden = true;
    els.launcher.setAttribute("aria-expanded", "false");
    document.body.classList.remove("sl-chat-open");
    els.launcher.focus();
  }

  function build() {
    // Continuidad: recuperar la conversación de esta sesión (solo del navegador).
    try {
      var saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || "[]");
      if (saved && saved.length) history = saved;
    } catch (e) {}

    // Lanzador
    var launcher = el("button", "sl-chat-launcher", {
      type: "button",
      "aria-label": "Abrir el asistente virtual ClaudIA",
      "aria-expanded": "false"
    });
    launcher.innerHTML =
      '<span class="sl-chat-launcher__icon"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 3C6.9 3 3 6.6 3 11.1c0 2.3 1 4.3 2.7 5.8L5 21l3.9-1.6c1 .3 2 .5 3.1.5 5.1 0 9-3.6 9-8.1S17.1 3 12 3Z"/></svg></span>' +
      '<span class="sl-chat-launcher__label"><b>ClaudIA</b><small>Asistente IA</small></span>';

    // Panel
    var panel = el("div", "sl-chat", { role: "dialog", "aria-label": "Asistente virtual de SoyLegal360", hidden: "" });

    var header = el("div", "sl-chat__header");
    header.innerHTML =
      '<div class="sl-chat__head-main">' +
      '<span class="sl-chat__head-name"><strong>ClaudIA</strong><span class="sl-chat__ia-badge">IA</span></span>' +
      '<span class="sl-chat__note">Asistente virtual con IA · orientación, no asesoramiento jurídico. No conservamos los mensajes. ' +
      '<a href="/politica-de-privacidad/" target="_blank" rel="noopener">Privacidad</a>.</span>' +
      "</div>";
    var closeBtn = el("button", "sl-chat__close", { type: "button", "aria-label": "Cerrar el asistente" });
    closeBtn.innerHTML = "&times;";
    header.appendChild(closeBtn);

    var bodyEl = el("div", "sl-chat__body", { "aria-live": "polite", "aria-atomic": "false" });

    var actions = el("div", "sl-chat__actions");
    var waLink = el("a", "sl-chat__action", { href: WHATSAPP, target: "_blank", rel: "noopener" });
    waLink.textContent = "WhatsApp";
    var contactLink = el("a", "sl-chat__action", { href: "/contacto/" });
    contactLink.textContent = "Contacto";
    actions.appendChild(waLink);
    actions.appendChild(contactLink);

    var form = el("form", "sl-chat__form");
    var honey = el("input", "sl-chat__honey", {
      type: "text",
      name: "website",
      tabindex: "-1",
      autocomplete: "off",
      "aria-hidden": "true"
    });
    var input = el("input", "sl-chat__input", {
      type: "text",
      placeholder: "Escribe tu mensaje…",
      "aria-label": "Tu mensaje",
      autocomplete: "off",
      maxlength: "1000"
    });
    var sendBtn = el("button", "sl-chat__send", { type: "submit", "aria-label": "Enviar" });
    sendBtn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 20.5 21 12 3 3.5 3 10l12 2-12 2z"/></svg>';
    form.appendChild(honey);
    form.appendChild(input);
    form.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(bodyEl);
    panel.appendChild(actions);
    panel.appendChild(form);

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    els = { launcher: launcher, panel: panel, body: bodyEl, input: input, send: sendBtn, honey: honey };

    launcher.addEventListener("click", function () {
      if (panel.hidden) open();
      else close();
    });
    closeBtn.addEventListener("click", close);
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      send(input.value);
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && !panel.hidden) close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
