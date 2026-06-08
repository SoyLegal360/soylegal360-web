# Cruce web publicada y HTML locales

Fecha de cruce: 2026-05-26.

Objetivo: decidir, URL por URL, que contenido se conserva de la web publicada, que formato o componentes se reutilizan de los HTML locales mejorados y que queda pendiente antes de construir la version estatica definitiva.

## Fuentes y reglas

- Web viva: `https://www.soylegal360.es/`.
- Base local principal: `/Users/josemotos/Documents/Codex/SoyLegal360.es/https-www-soylegal360-es-analiza-en/`.
- Base local secundaria: `/Users/josemotos/Documents/Codex/SoyLegal360.es/files-mentioned-by-the-user-brief/`.
- Codigos incrustados extraidos de la web publicada: `published-embeds/` e inventario `docs/inventario-codigos-incrustados-publicados.md`.
- Los HTML historicos del Escritorio no se usan como fuente de contenido.
- Los textos locales mejorados se pueden usar si encajan con la oferta real, no contradicen la web publicada y no introducen testimonios falsos, claims dudosos o datos no validados.
- La salida final de despliegue sigue siendo `site/`.

## Herramientas detectadas

- Tally contacto: `https://tally.so/embed/Zj1O5B`.
- Tally auditoria gratuita: `https://tally.so/embed/ODdgMY`.
- WhatsApp Web Legal: enlaces `wa.me/34645668235` en la version local de Web Legal.
- Cookiebot publicado: `085be98f-70af-4e14-8e4a-aa2d511df57a`.

## Tabla de cruce

| URL final | Fuente publicada actual | HTML local candidato | Contenido a conservar | Formato a reutilizar | Estado SEO | Decision final |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | `/` | `home.html`, `seccion-aepd-importarte-mejorada.html`, `seccion-como-te-ayudamos-mejorada.html`, `seccion-guia-home-mejorada.html` | Hero sobre obligaciones legales, RGPD/LOPDGDD/LSSICE, bloque AEPD, servicios principales, confianza, oficina y contacto. | Secciones mejoradas de AEPD, ayuda y guia home. | Indexable tras limpiar testimonios genericos y ajustar meta description. | Fusionar. Base publicada + secciones locales mejoradas. Eliminar testimonios falsos y relleno visual del builder. |
| `/servicios-proteccion-de-datos/` | `/servicios-proteccion-de-datos` | `servicios-proteccion-de-datos-mejorada.html` | Familias de servicio y posicionamiento RGPD/LSSICE para pymes, autonomos y empresas. | Usar como hub principal mejorado. | Indexable tras fusion. | Adoptar la version local mejorada como base del hub, validando enlaces contra arquitectura final. |
| `/auditoria-web-gratuita/` | `/auditoria-web-gratuita` y `/solicita-auditoria-web-gratuita` | `solicita-auditoria-web-gratuita.html` | Riesgo/sanciones, promesa de auditoria gratuita, plazo 48 h, formulario Tally `ODdgMY`. | Rehacer limpio con layout de conversion, sin builder. | Indexable. Canonical final a `/auditoria-web-gratuita/`. | Construir pagina limpia. Redirigir `/solicita-auditoria-web-gratuita` a `/auditoria-web-gratuita/`. |
| `/auditoria-rgpd/` | `/auditoria-rgpd` | `auditoria-rgpd-mejorada.html` | Servicio de auditoria RGPD para empresas y objetivo de control de cumplimiento. | Adoptar estructura local mejorada. | Indexable tras completar body con la version mejorada. | Usar local mejorado como contenido principal y conservar title/description SEO publicado como referencia. |
| `/auditoria-ia/` | `/auditoria-ia` | `auditoria-ia-mejorada.html` | Auditoria de usos de IA, riesgos legales, datos personales y AI Act/RGPD. | Adoptar estructura local mejorada. | Indexable tras definir meta description y canonical final. | Usar local mejorado como base porque la pagina publicada tiene metadatos pobres y poco contenido visible. |
| `/adaptacion-web-rgpd/` | `/adaptacion-web-rgpd` | `home.html`, `servicios-proteccion-de-datos-mejorada.html` como apoyo visual | Pack Web Legal, desde 390 euros + IVA, textos legales, clausulas, cookies, formularios y guia de implementacion. | Reutilizar tarjetas/estructura del hub mejorado. | Indexable. | Mantener contenido publicado como base comercial y redisenar con formato limpio. |
| `/adaptacion-empresa-rgpd/` | `/adaptacion-empresa-rgpd` | `adaptacion-empresa-rgpd.html`, `calculadora-rgpd-adaptacion-empresa-fix.html` | Niveles Autonomos, PYME, Empresa y Nivel 4; documentacion, RAT, proveedores, brechas y formacion. | Rehacer pagina limpia; calculadora solo como componente si encaja. | Indexable. | Fusionar contenido publicado con estructura estatica. No sobredimensionar la calculadora en primera pasada si distrae del servicio. |
| `/adaptacion-ia/` | `/adaptacion-ia` | `adaptacion-ia-mejorada.html` | Adaptacion legal de herramientas IA, RGPD, usuarios informados, proveedores y decisiones sensibles. | Adoptar version local mejorada. | Indexable tras validar claims. | Usar local mejorado como base y conservar la URL publicada. |
| `/proteccion-legal-continua/` | `/proteccion-legal-continua` | `proteccion-legal-continua.html` | Desde 49 euros/mes + IVA, seguimiento, novedades, actualizaciones, alertas y consultas. | Rehacer limpio desde exportacion publicada. | Indexable. | Mantener contenido publicado y mejorar layout. |
| `/delegado-de-proteccion-de-datos-externalizado/` | `/delegado-de-proteccion-de-datos-externalizado` | `delegado-de-proteccion-de-datos-externalizado.html` | DPO externo, obligaciones y modalidades de servicio. | Rehacer limpio desde exportacion publicada. | Indexable. | Mantener contenido publicado y mejorar layout. |
| `/web-legal-lista-en-7-dias/` | `/web-legal-lista-en-7-dias` | `web-legal-lista-en-7-dias-mejorada.html`, `files-mentioned-by-the-user-brief/web-legal-lista-en-7-dias.html` | Web profesional y legal en 7 dias, pack integrado, precio desde 949 euros + IVA, CTA comercial y WhatsApp. | Fusionar version mejorada con variante del brief para CTAs/WhatsApp. | Indexable tras validar precios y alcance. | Usar local mejorado como base. Mantener WhatsApp solo en CTAs de encaje claro. |
| `/consultoria-proteccion-de-datos/` | `/consultoria-proteccion-de-datos` | `consultoria-proteccion-de-datos.html` | Consultoria puntual en proteccion de datos para pymes, autonomos, empresas y profesionales. | Rehacer limpio desde exportacion publicada. | Indexable. | Mantener contenido publicado y mejorar estructura. |
| `/consultoria-legal/` | `/consultoria-legal` | `consultoria-legal.html` | Consultoria legal para pymes/autonomos, contratos digitales y dudas legales de negocio. | Rehacer limpio desde exportacion publicada. | Indexable solo si queda diferenciada de revision de contratos. | Separar claramente de `/revision-de-contratos/`; si queda duplicada, mantener noindex temporal. |
| `/revision-de-contratos/` | `/revision-de-contratos` | `revision-de-contratos.html` | Revision de contratos para pymes, autonomos y empresas; analisis legal y entregables. | Rehacer limpio desde exportacion publicada. | Indexable. | Mantener como pagina especifica, no mezclar con consultoria general. |
| `/como-funciona/` | `/como-funciona` | `como-funciona.html` | Proceso en cuatro pasos, auditoria, analisis, propuesta y acompanamiento. | Rehacer limpio desde exportacion publicada. | Indexable. | Mantener como pagina de confianza/proceso. |
| `/faqs/` | `/faqs` | `faqs.html` | Preguntas frecuentes sobre RGPD, LSSICE, auditorias, precios y alcance. | Rehacer limpio desde exportacion publicada. | Indexable. | Mantener FAQs publicadas y convertir a estructura semantica. |
| `/sobre-nosotros/` | `/sobre-nosotros` | `sobre-nosotros.html` | Historia, derecho + tecnologia, compromiso y equipo. | Rehacer limpio desde exportacion publicada. | Indexable. | Mantener sin testimonios ni imagenes genericas innecesarias. |
| `/contacto/` | `/contacto` | `contacto.html` | Datos de contacto, oficina Torre Millenium, telefono, email y Tally `Zj1O5B`. | Layout limpio de contacto + iframe Tally. | Indexable. | Mantener formulario Tally y datos publicados. |
| `/aviso-legal/` | `/aviso-legal` | Sin candidato mejorado | Texto legal publicado. | Maquetacion legal simple. | No necesita sitemap comercial; accesible desde footer. | Volcar texto publicado completo antes de despliegue. |
| `/politica-de-privacidad/` | `/privacy-policy` | Sin candidato mejorado | Politica de privacidad publicada. | Maquetacion legal simple. | No necesita sitemap comercial; accesible desde footer. | Usar URL final en espanol y redirigir `/privacy-policy`. |
| `/politica-de-cookies/` | `/politica-de-cookies` | Sin candidato mejorado | Politica de cookies publicada si el texto completo esta disponible. | Maquetacion legal simple. | Noindex temporal si no se vuelca texto completo. | Revisar y volcar texto completo antes de publicar. |
| `/privacy-policy` | `/privacy-policy` | No aplica | No aplica. | No aplica. | Redirect 301. | Redirigir a `/politica-de-privacidad/`. |
| `/solicita-auditoria-web-gratuita` | `/solicita-auditoria-web-gratuita` | No aplica | No aplica. | No aplica. | Redirect 301. | Redirigir a `/auditoria-web-gratuita/` para consolidar SEO. |
| `/casos-de-exito/` | `/casos-de-exito` | No usar | Ninguno: contiene testimonios genericos/no validados. | No aplica. | Redirect 302 y fuera de sitemap. | Redirigir temporalmente a `/sobre-nosotros/` hasta tener casos reales. |

## Componentes sin URL propia

| Componente | Archivo local | Uso recomendado | Decision |
| --- | --- | --- | --- |
| Calculadora riesgo RGPD | `calculadora-riesgo-rgpd.html`, `calculadora-riesgo-rgpd-compacta.html`, `calculadora-riesgo-rgpd-embed.html` | Bloque de diagnostico en paginas RGPD si no distrae del CTA principal. | Mantener como componente, no como URL indexable en primera version. |
| Calculadora adaptacion empresa | `files-mentioned-by-the-user-brief/calculadora-rgpd-adaptacion-empresa-fix.html` | Posible apoyo para `/adaptacion-empresa-rgpd/`. | Revisar despues de construir la pagina base. |
| Secciones home mejoradas | `seccion-aepd-importarte-mejorada.html`, `seccion-como-te-ayudamos-mejorada.html`, `seccion-guia-home-mejorada.html` | Sustituir bloques flojos de la home publicada. | Usar en home nueva. |

## Orden de construccion recomendado

1. Actualizar home y hub `/servicios-proteccion-de-datos/`.
2. Construir las paginas mejoradas ya maduras: `/auditoria-rgpd/`, `/auditoria-ia/`, `/adaptacion-ia/`, `/web-legal-lista-en-7-dias/`.
3. Limpiar paginas publicadas existentes: adaptacion web, adaptacion empresa, proteccion continua, DPO, consultorias, revision, como funciona, FAQs, sobre nosotros y contacto.
4. Volcar paginas legales completas y configurar redirecciones.
5. Revisar sitemap, robots, canonical, noindex temporal y CTAs.

## Criterios de aceptacion para la fase de construccion

- Todas las rutas finales devuelven 200 en local.
- `/privacy-policy`, `/solicita-auditoria-web-gratuita` y `/casos-de-exito` redirigen correctamente.
- Tally `ODdgMY` aparece solo en auditoria gratuita y Tally `Zj1O5B` en contacto.
- Cookiebot usa el ID publicado si se mantiene el mismo gestor de consentimiento.
- No hay testimonios genericos, nombres falsos, imagenes de relleno ni claims no validados.
- El sitemap solo incluye paginas reales, utiles e indexables.

## Estado de construccion

- 2026-05-26: Home integrada en `site/` desde la web publicada y secciones locales aprobadas. Se elimina el enfoque provisional y se incorporan riesgo AEPD, puertas de entrada, confianza, familias de servicio, proceso y contacto.
- 2026-05-26: Hub `/servicios-proteccion-de-datos/` integrado en `site/` desde `published-embeds/servicios-proteccion-de-datos/01-zoejmc-pagina-hub.html`, limpiado y convertido a estructura estatica por familias.
- 2026-05-26: Verificacion local: 24 rutas con estado 200 y 0 enlaces internos rotos.
