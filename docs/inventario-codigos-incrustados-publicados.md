# Inventario de codigos incrustados publicados

Extraccion realizada desde capturas temporales `sl360-live-*.html` de la web publicada.

Carpeta de salida: `published-embeds/`.

## Resumen

- Bloques extraidos: 19.
- Paginas con bloques: 10.
- Bloques Tally: 2.
- Bloques con head incrustado: 4.
- Bloques marcados como no usar: 0.

## Tabla

| Pagina | Archivo extraido | Tipo | Titulo detectado | Flags | Decision |
| --- | --- | --- | --- | --- | --- |
| `adaptacion-empresa-rgpd` | `published-embeds/adaptacion-empresa-rgpd/01-z9v6-s-cta.html` | cta | ¿Más de 20 empleados, sector regulado o tratamientos a gran escala ? | css-inline | Revisar para reutilizar |
| `adaptacion-empresa-rgpd` | `published-embeds/adaptacion-empresa-rgpd/02-zcqjju-faq.html` | faq | SECCION — FAQs (acordeon moderno) | script, css-inline | Revisar para reutilizar |
| `adaptacion-empresa-rgpd` | `published-embeds/adaptacion-empresa-rgpd/03-zxnzd5-seccion-html.html` | seccion-html | SECCION 3 — Tabla comparativa rapida (v3 interactiva) | css-inline | Revisar para reutilizar |
| `adaptacion-empresa-rgpd` | `published-embeds/adaptacion-empresa-rgpd/04-zkmtzv-cta.html` | cta | SECCION — Por que SoyLegal360 (5 razones) | css-inline | Revisar para reutilizar |
| `adaptacion-empresa-rgpd` | `published-embeds/adaptacion-empresa-rgpd/05-zlqxph-cta.html` | cta | SECCION — CTA Final | css-inline | Revisar para reutilizar |
| `adaptacion-empresa-rgpd` | `published-embeds/adaptacion-empresa-rgpd/06-zxxvqx-cta.html` | cta | SECCION — Como funciona (4 pasos) | css-inline | Revisar para reutilizar |
| `adaptacion-ia` | `published-embeds/adaptacion-ia/01-z6mzqz-pagina-completa.html` | pagina-completa | Adaptación IA y AI Act para empresas \| SoyLegal360 | script, css-inline, head-incrustado | Usar como base de pagina |
| `auditoria-ia` | `published-embeds/auditoria-ia/01-zekvlz-pagina-completa.html` | pagina-completa | Auditoría IA para empresas \| AI Act y RGPD \| SoyLegal360 | script, css-inline, head-incrustado | Usar como base de pagina |
| `auditoria-rgpd` | `published-embeds/auditoria-rgpd/01-zxc8wl-pagina-completa.html` | pagina-completa | Auditoría RGPD para empresas \| SoyLegal360 | script, css-inline, head-incrustado | Usar como base de pagina |
| `contacto` | `published-embeds/contacto/01-zqnjpr-tally.html` | tally | Codigo incrustado sin titulo | tally, script | Usar como integracion |
| `home` | `published-embeds/home/01-z-3qqo-seccion-home.html` | seccion-home | SECCION — Como te ayudamos Pegar en: Hostinger > Anadir > Seccion en blanco > Codigo incru | script, css-inline | Revisar para reutilizar |
| `home` | `published-embeds/home/02-zse84t-cta.html` | cta | SECCION — CTA Final | css-inline | Revisar para reutilizar |
| `home` | `published-embeds/home/03-zirhj9-seccion-home.html` | seccion-home | SECCION — Por que deberia importarte Pegar en: Hostinger > Anadir > Seccion en blanco > Co | script, css-inline | Revisar para reutilizar |
| `home` | `published-embeds/home/04-zmqwqd-seccion-home.html` | seccion-home | SECCION — Guia rapida de la home Pegar en: Hostinger > Anadir > Seccion en blanco > Codigo | script, css-inline | Revisar para reutilizar |
| `home` | `published-embeds/home/05-zo5ssx-calculadora.html` | calculadora | Calcula el nivel de riesgo legal de tu negocio | script, css-inline | Revisar para reutilizar |
| `politica-de-cookies` | `published-embeds/politica-de-cookies/01-zjclt5-legal-cookies.html` | legal-cookies | POLÍTICA DE COOKIES | - | Extraer texto legal |
| `servicios-proteccion-de-datos` | `published-embeds/servicios-proteccion-de-datos/01-zoejmc-pagina-hub.html` | pagina-hub | PAGINA - Servicios de proteccion de datos | script, css-inline | Revisar para reutilizar |
| `solicita-auditoria-web-gratuita` | `published-embeds/solicita-auditoria-web-gratuita/01-zsn2ca-tally.html` | tally | Codigo incrustado sin titulo | tally | Usar como integracion |
| `web-legal-lista-en-7-dias` | `published-embeds/web-legal-lista-en-7-dias/01-z84frf-pagina-completa.html` | pagina-completa | Web Legal Lista en 7 Días \| SoyLegal360 | script, css-inline, head-incrustado | Usar como base de pagina |

## Notas de uso

- Los bloques `pagina-completa` suelen traer `<meta>`, `<title>`, CSS y estructura completa dentro del embed de Hostinger; se deben limpiar antes de integrarlos en el generador.
- Los bloques Tally se tratan como integraciones, no como contenido editorial.
- Los bloques legales se usan para extraer texto vigente, no para copiar estilos inline tal cual.
- Los bloques con testimonios no validados no se reutilizan.
