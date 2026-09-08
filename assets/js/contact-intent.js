/* Recorridos comerciales: solo valores conocidos, sin rastreo ni datos personales en URL. */
(function () {
  'use strict';
  var form = document.querySelector('form[data-sl-form="contacto"]');
  if (!form) return;
  var params = new URLSearchParams(location.search);
  if (params.get('servicio') !== 'proteccion-continua') return;
  var packs = new Map([['autonomo', 'Autónomo'], ['pyme', 'Pyme'], ['pyme-plus', 'Pyme Plus']]);
  var origins = new Map([['portada', 'Portada'], ['proteccion-legal-continua', 'Protección Legal Continua'], ['area-de-clientes', 'Área de clientes']]);
  var pack = packs.get(params.get('pack'));
  var demo = params.get('solicitud') === 'demo';
  if (!pack && !demo) return;
  var request = demo ? 'Solicitar una demostración' : 'Me interesa el pack ' + pack;
  var summary = form.querySelector('[data-request-summary]');
  summary.hidden = false;
  summary.textContent = request + '. Sin compromiso; esta solicitud no activa una contratación.';
  form.dataset.requestContext = request + (pack && demo ? '\nPack de interés: ' + pack : '') + '\nOrigen: ' + (origins.get(params.get('origen')) || 'Contacto');
  document.querySelector('.sl-ct-card__head h2').textContent = request;
  form.querySelector('[data-company-field]').hidden = false;
  form.elements.company.required = true;
  form.elements.name.required = true;
  form.elements.name.parentElement.firstChild.textContent = 'Nombre *';
  form.elements.phone.parentElement.hidden = true;
  form.elements.email.parentElement.firstChild.textContent = 'Correo profesional *';
  form.elements.message.required = false;
  form.elements.message.parentElement.firstChild.textContent = 'Comentario (opcional)';
  form.querySelector('button[type="submit"]').textContent = 'Enviar solicitud →';
  // Los atajos generales siguen disponibles sin arrastrar el pack ni la demo.
  function clearIntent() {
    delete form.dataset.requestContext;
    summary.hidden = true;
    form.querySelector('[data-company-field]').hidden = true;
    form.elements.company.required = false;
    form.elements.name.required = false;
    form.elements.name.parentElement.firstChild.textContent = 'Nombre';
    form.elements.email.parentElement.firstChild.textContent = 'Email *';
    form.elements.phone.parentElement.hidden = false;
    form.elements.message.required = true;
    form.elements.message.parentElement.firstChild.textContent = '¿En qué podemos ayudarte? *';
    document.querySelector('.sl-ct-card__head h2').textContent = 'Escríbenos';
    form.querySelector('button[type="submit"]').textContent = 'Enviar mensaje →';
  }
  form.elements.servicio.addEventListener('change', clearIntent);
  document.querySelectorAll('.sl-ct-intents button').forEach(function (button) { button.addEventListener('click', clearIntent); });
})();
