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
    "Hola 👋 Soy el asistente de SoyLegal360. Puedo orientarte sobre nuestros servicios de protección de datos y cumplimiento de IA, o ayudarte a contactar con el equipo. ¿En qué te ayudo?";
  var ERROR_MSG =
    "Ahora mismo no puedo responder. Escríbenos por WhatsApp o desde /contacto/ y te respondemos en menos de 48 horas hábiles.";

  // Historial real enviado a la API (sin el saludo, que es solo de UI).
  var history = [];
  var sending = false;
  var leadFormOpen = false; // evita mostrar dos formularios a la vez
  var els = {};

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

  function addBubble(role, text) {
    var b = el("div", "sl-chat__msg sl-chat__msg--" + role);
    b.textContent = role === "bot" ? stripMarkdown(text) : text;
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
    var motivo = el("input", "sl-chat__honey", { type: "hidden", name: "message" });
    motivo.value = prefill.motivo || "Solicitud desde el asistente virtual.";
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
            addBubble("bot", "¡Listo! He pasado tus datos al equipo. Te escribirán en menos de 48 horas hábiles. ¿Algo más en lo que te ayude?");
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
    els.input.value = "";
    setSending(true);
    var typing = showTyping();

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: history.slice(-24),
        pageContext: { path: location.pathname, title: document.title },
        website: els.honey.value || ""
      })
    })
      .then(function (r) {
        return r.json().catch(function () {
          return {};
        });
      })
      .then(function (data) {
        typing.remove();
        var reply = (data && data.reply) || ERROR_MSG;
        addBubble("bot", reply);
        if (data && data.reply) history.push({ role: "assistant", content: data.reply });
        setSending(false);
        if (data && data.cta === "lead_form") renderLeadForm(data.prefill);
        else els.input.focus();
      })
      .catch(function () {
        typing.remove();
        addBubble("bot", ERROR_MSG);
        setSending(false);
      });
  }

  function open() {
    els.panel.hidden = false;
    els.launcher.setAttribute("aria-expanded", "true");
    document.body.classList.add("sl-chat-open");
    if (!els.body.dataset.seeded) {
      addBubble("bot", GREETING);
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
    // Lanzador
    var launcher = el("button", "sl-chat-launcher", {
      type: "button",
      "aria-label": "Abrir el asistente virtual",
      "aria-expanded": "false"
    });
    launcher.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 3C6.9 3 3 6.6 3 11.1c0 2.3 1 4.3 2.7 5.8L5 21l3.9-1.6c1 .3 2 .5 3.1.5 5.1 0 9-3.6 9-8.1S17.1 3 12 3Z"/></svg>';

    // Panel
    var panel = el("div", "sl-chat", { role: "dialog", "aria-label": "Asistente virtual de SoyLegal360", hidden: "" });

    var header = el("div", "sl-chat__header");
    header.innerHTML =
      '<div class="sl-chat__head-main">' +
      '<strong>Asistente SoyLegal360</strong>' +
      '<span class="sl-chat__note">Orientación, no asesoramiento jurídico. No conservamos los mensajes. ' +
      '<a href="/politica-de-privacidad/" target="_blank" rel="noopener">Privacidad</a>.</span>' +
      "</div>";
    var closeBtn = el("button", "sl-chat__close", { type: "button", "aria-label": "Cerrar el asistente" });
    closeBtn.innerHTML = "&times;";
    header.appendChild(closeBtn);

    var bodyEl = el("div", "sl-chat__body");

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
