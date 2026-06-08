# Inventario de la web publicada

Extraccion realizada desde URLs publicas y texto visible. No incluye documentos antiguos del Escritorio.

Decision de cruce con HTML locales reutilizables: `docs/cruce-web-publicada-html-locales.md`.

Codigos incrustados extraidos: `docs/inventario-codigos-incrustados-publicados.md` y carpeta `published-embeds/`.

## Paginas con contenido visible suficiente

- `/`: home actual con hero, riesgo, argumentos de confianza, contacto/oficina y CTA a auditoria.
- `/auditoria-web-gratuita`: descripcion de auditoria gratuita, entregables, plazo 48 h y CTA.
- `/adaptacion-web-rgpd`: explicacion de adaptacion web, precio desde 390 euros + IVA e incluidos.
- `/adaptacion-empresa-rgpd`: niveles Autonomos, PYME, Empresa y Nivel 4.
- `/proteccion-legal-continua`: servicio mensual desde 49 euros + IVA e incluidos.
- `/delegado-de-proteccion-de-datos-externalizado`: DPD externo, incluidos y modalidades.
- `/consultoria-proteccion-de-datos`: consultoria puntual y casos de uso.
- `/consultoria-legal`: actualmente reutiliza contenido de revision de contratos; conviene separar en fase de contenido.
- `/revision-de-contratos`: revision profesional, tipos de contratos y entregables.
- `/como-funciona`: proceso en cuatro pasos.
- `/faqs`: ocho preguntas frecuentes visibles.
- `/sobre-nosotros`: historia, compromiso y posicionamiento.
- `/contacto`: datos de contacto y nota legal del formulario.
- `/aviso-legal`: texto legal visible.
- `/privacy-policy`: politica de privacidad visible.

## Paginas existentes con contenido insuficiente en extraccion visible

Estas URLs existen en la arquitectura publicada, pero la extraccion devolvio solo navegacion/footer o contenido insuficiente. Se conservan en `site/` con `noindex` hasta completar contenido exacto.

- `/servicios-proteccion-de-datos`: la nueva version implementa hub por familias.
- `/auditoria-rgpd`
- `/auditoria-ia`
- `/adaptacion-ia`
- `/web-legal-lista-en-7-dias`
- `/politica-de-cookies`: URL preservada; el texto legal completo debe volcarse antes de desplegar.

## Contenido excluido

- `/casos-de-exito`: contiene testimonios genericos/no reales. No se publica como pagina visible; redirige temporalmente a `/sobre-nosotros/`.
- Blog: reservado para una fase posterior, sin publicacion ni enlaces en esta version.
