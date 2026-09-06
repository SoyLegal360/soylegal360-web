/* Formularios propios de SoyLegal360 → POST a la API de la herramienta (Vercel).
   Sustituyen a los embeds de Tally. Sin dependencias. */
(function () {
  "use strict";

  var ENDPOINT = "https://app.soylegal360.es/api/contact";

  // Prefijar la vertical del caso desde el permalink del wizard (?caso=…).
  function prefillCaso(form) {
    var select = form.querySelector('select[name="caso"]');
    if (!select) return;
    var caso = new URLSearchParams(window.location.search).get("caso") || "";
    var match = ["marketing", "morosidad", "olvido"].find(function (v) {
      return caso.indexOf(v) === 0;
    });
    if (match) select.value = match;
  }

  // Prefijar el servicio y un mensaje de arranque cuando se llega desde el CTA
  // de una página de servicio (?servicio=…). El desplegable queda pre-seleccionado
  // y el mensaje trae una frase editable. Los checkboxes de consentimiento y
  // marketing NUNCA se premarcan: un consentimiento pre-marcado sería nulo (RGPD).
  var SERVICIOS = {
    "auditoria-web-gratuita": { opt: "Auditoría web gratuita", msg: "Me gustaría solicitar la auditoría web gratuita." },
    "auditoria-rgpd": { opt: "Auditoría RGPD", msg: "Me gustaría pedir una propuesta de Auditoría RGPD para mi negocio." },
    "auditoria-ia": { opt: "Auditoría IA", msg: "Me gustaría pedir una propuesta de Auditoría IA (AI Act) para mi empresa." },
    "adaptacion-web": { opt: "Adaptación Web RGPD", msg: "Me gustaría una propuesta para poner mi web en regla (Adaptación Web RGPD)." },
    "adaptacion-empresa": { opt: "Adaptación Empresa RGPD", msg: "Me gustaría una propuesta de Adaptación Empresa RGPD." },
    "adaptacion-ia": { opt: "Adaptación IA", msg: "Me gustaría una propuesta de Adaptación IA (AI Act) para mi empresa." },
    "proteccion-continua": { opt: "Protección Legal Continua", msg: "Me gustaría información sobre Protección Legal Continua." },
    "dpd": { opt: "Delegado de Protección de Datos", msg: "Me gustaría una propuesta de Delegado de Protección de Datos externalizado." },
    "responsable-ia": { opt: "Responsable de IA", msg: "Me gustaría una propuesta de Responsable de IA externalizado." },
    "web-7-dias": { opt: "Web Legal en 7 días", msg: "Me gustaría una propuesta de Web Legal en 7 días." },
    "consultoria-datos": { opt: "Consultoría Protección de Datos", msg: "Me gustaría una consultoría de protección de datos para mi caso." },
    "consultoria-legal": { opt: "Consultoría Legal", msg: "Me gustaría una consultoría legal para mi caso." },
    "revision-contratos": { opt: "Revisión de contratos", msg: "Me gustaría una revisión de contratos." }
  };

  function optionExists(select, value) {
    return Array.prototype.some.call(select.options, function (o) {
      return o.value === value;
    });
  }

  function prefillServicio(form) {
    var select = form.querySelector('select[name="servicio"]');
    if (!select) return;
    var slug = new URLSearchParams(window.location.search).get("servicio") || "";
    var data = SERVICIOS[slug];
    if (!data) return;
    if (optionExists(select, data.opt)) select.value = data.opt;
    var msg = form.querySelector('textarea[name="message"]');
    if (msg && !msg.value) msg.value = data.msg;
  }

  function setStatus(form, kind, text) {
    var el = form.querySelector(".sl-form__status");
    if (!el) return;
    el.textContent = text || "";
    el.className = "sl-form__status" + (kind ? " sl-form__status--" + kind : "");
  }

  function handle(form) {
    prefillCaso(form);
    prefillServicio(form);
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var data = {
        formType: form.getAttribute("data-sl-form") || "contacto",
        name: (form.elements.name && form.elements.name.value) || "",
        email: (form.elements.email && form.elements.email.value) || "",
        phone: (form.elements.phone && form.elements.phone.value) || "",
        message: (form.elements.message && form.elements.message.value) || "",
        url: (form.elements.url && form.elements.url.value) || "",
        caso: (form.elements.caso && form.elements.caso.value) || "",
        servicio: (form.elements.servicio && form.elements.servicio.value) || "",
        consent: !!(form.elements.consent && form.elements.consent.checked),
        marketing: !!(form.elements.marketing && form.elements.marketing.checked),
        website: (form.elements.website && form.elements.website.value) || ""
      };

      if (!data.consent) {
        setStatus(form, "error", "Debes aceptar la política de privacidad.");
        return;
      }

      btn.disabled = true;
      var label = btn.textContent;
      btn.textContent = "Enviando…";
      setStatus(form, "", "");

      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          return res.json().then(function (json) {
            if (!res.ok) throw new Error(json.error || "No se pudo enviar.");
          });
        })
        .then(function () {
          // GA4: conversión al enviar el formulario con éxito (faltaba; por eso generate_lead salía 0).
          try { if (window.gtag) window.gtag("event", "generate_lead", { form_type: data.formType }); } catch (e) {}
          var ok = document.createElement("div");
          ok.className = "sl-form__success";
          ok.setAttribute("role", "status");
          ok.innerHTML =
            "<strong>✓ Recibido.</strong> " +
            (form.getAttribute("data-sl-success") ||
              "Te responderemos en menos de 48 horas hábiles. También te hemos enviado un email de confirmación.");
          form.replaceWith(ok);
        })
        .catch(function (err) {
          setStatus(
            form,
            "error",
            (err && err.message) ||
              "No se pudo enviar. Inténtalo de nuevo o escríbenos a hola@soylegal360.es."
          );
          btn.disabled = false;
          btn.textContent = label;
        });
    });
  }

  document.querySelectorAll("form[data-sl-form]").forEach(handle);
})();
