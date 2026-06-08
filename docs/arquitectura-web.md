# Estructura optima SoyLegal360

Fuente de verdad para esta fase: web publicada en `https://www.soylegal360.es`.
No se usan documentos antiguos del Escritorio como base de contenido.

## Salida implementada

La version estatica esta en `site/` y esta pensada para subir el contenido de esa carpeta a `public_html` cuando este revisada.

El cruce operativo entre la web publicada y los HTML locales reutilizables esta en `docs/cruce-web-publicada-html-locales.md`.
Los codigos incrustados de la web publicada estan extraidos en `published-embeds/` e inventariados en `docs/inventario-codigos-incrustados-publicados.md`.

## Navegacion principal

- Inicio: `/`
- Servicios: `/servicios-proteccion-de-datos/`
- Como funciona: `/como-funciona/`
- Sobre nosotros: `/sobre-nosotros/`
- FAQs: `/faqs/`
- Contacto: `/contacto/`
- CTA principal: `/auditoria-web-gratuita/`

## Servicios por familia

Diagnostico y auditoria:

- `/auditoria-web-gratuita/`
- `/auditoria-rgpd/`
- `/auditoria-ia/`

Adaptacion y cumplimiento:

- `/adaptacion-web-rgpd/`
- `/adaptacion-empresa-rgpd/`
- `/adaptacion-ia/`

Continuidad y figuras obligatorias:

- `/proteccion-legal-continua/`
- `/delegado-de-proteccion-de-datos-externalizado/`

Web y legal digital:

- `/web-legal-lista-en-7-dias/`
- `/consultoria-proteccion-de-datos/`
- `/consultoria-legal/`
- `/revision-de-contratos/`

## Redirecciones

- `/privacy-policy` redirige a `/politica-de-privacidad/`
- `/casos-de-exito` redirige temporalmente a `/sobre-nosotros/`

## Criterio de indexacion en esta version

Se incluyen en `sitemap.xml` solo paginas con contenido util en esta primera implementacion.
Las paginas preservadas pero pendientes de contenido exacto se mantienen navegables y con `noindex` hasta completar la fase de contenido.
