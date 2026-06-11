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

  function setStatus(form, kind, text) {
    var el = form.querySelector(".sl-form__status");
    if (!el) return;
    el.textContent = text || "";
    el.className = "sl-form__status" + (kind ? " sl-form__status--" + kind : "");
  }

  function handle(form) {
    prefillCaso(form);
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
