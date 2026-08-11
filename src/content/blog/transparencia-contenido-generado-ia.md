---
titulo: "Transparencia del contenido generado por IA: qué cumple tu proveedor y qué te obliga a ti (art. 50)"
meta: "La transparencia del contenido generado por IA no acaba en tu proveedor: que Claude o ChatGPT marquen el contenido (art. 50.2) no cubre tus obligaciones."
slug: transparencia-contenido-generado-ia
fecha: 2026-08-11
publico: empresa
keyword: "transparencia del contenido generado por IA"
cta: auditoria-ia
enlaces_internos:
  - /blog/ai-act-2-agosto-que-cambia/
  - /auditoria-ia/
  - /adaptacion-ia/
  - /blog/auditoria-ia-empresas/
faq:
  - q: "¿Si mi proveedor de IA ya marca el contenido, yo ya cumplo el artículo 50?"
    a: "No necesariamente. Que tu proveedor marque el contenido sintético en un formato legible por máquina cumple la obligación que el artículo 50.2 del Reglamento (UE) 2024/1689 impone al proveedor. Como empresa que usa esa IA, te siguen afectando otras obligaciones del mismo artículo 50: informar de que un chatbot es una IA (artículo 50.1) y, como responsable del despliegue, etiquetar las ultrafalsificaciones (deepfakes) y revelar los textos generados por IA que publiques para informar al público sobre asuntos de interés público (artículo 50.4)."
  - q: "¿Tengo que avisar de que mi chatbot es una IA?"
    a: "Sí, salvo que resulte evidente por el contexto. El artículo 50.1 del Reglamento de IA exige que un sistema destinado a interactuar directamente con personas les informe de que están interactuando con una IA. La información debe darse de forma clara y distinguible y, como muy tarde, en el momento de la primera interacción (artículo 50.5). Si pones un chatbot de atención al cliente en tu web, asegúrate de que ese aviso está y se ve."
  - q: "¿Un texto escrito con IA hay que señalarlo siempre?"
    a: "No siempre. El artículo 50.4 obliga a revelar el uso de IA en los textos que se publiquen para informar al público sobre asuntos de interés público. Esa obligación no se aplica cuando el contenido ha pasado por un proceso de revisión humana o de control editorial y una persona física o jurídica asume la responsabilidad editorial de la publicación. La mayoría del contenido de marketing corriente no encaja en el concepto de asuntos de interés público, pero conviene valorarlo caso a caso."
  - q: "¿La marca de agua de Claude sirve como prueba de que un texto lo hizo una IA?"
    a: "No como prueba concluyente. Según la documentación de Anthropic, detectar la marca indica que el contenido puede haber sido procesado por Claude, no que Claude lo escribiera por completo (puede haberlo solo revisado, traducido o resumido). Y su ausencia tampoco prueba que no haya IA detrás: la marca se puede perder al editar, parafrasear o traducir el texto, con textos muy cortos o al eliminar los metadatos. Es una señal, no una prueba."
  - q: "¿Quién tiene que marcar técnicamente el contenido generado por IA?"
    a: "El proveedor del sistema de IA. El artículo 50.2 obliga a los proveedores, incluidos los de sistemas de IA de uso general, a que la salida de sus sistemas esté marcada en un formato legible por máquina y sea detectable como generada o manipulada artificialmente. Por eso el marcado técnico lo implementa el proveedor (por ejemplo, Anthropic en Claude), no la empresa que usa la herramienta."
fuentes:
  - "Reglamento (UE) 2024/1689 (Reglamento de IA), artículo 50 — https://eur-lex.europa.eu/eli/reg/2024/1689/oj"
  - "Comisión Europea, Código de Buenas Prácticas sobre transparencia del contenido generado por IA — https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content"
  - "Documentación de Anthropic, «Cómo Claude marca el contenido generado por IA» (fuente de empresa, no legal) — https://support.claude.com/es/articles/16266773-como-claude-marca-el-contenido-generado-por-ia"
  - "C2PA, Coalition for Content Provenance and Authenticity (estándar técnico) — https://c2pa.org/"
estado_revision: verificado
---

Que tu proveedor de IA (Claude, ChatGPT y similares) marque el contenido que genera cumple una obligación suya, la del artículo 50.2 del Reglamento de IA, pero no te libera de las tuyas. Si tu empresa usa un chatbot de cara al público o publica imágenes o textos hechos con IA, el artículo 50 te sigue obligando a ti.

Lo recordamos ahora porque Anthropic, proveedor del modelo Claude con el que trabajamos en SoyLegal360, acaba de firmar el Código de Buenas Prácticas sobre transparencia del contenido generado por IA y ha publicado cómo marca el contenido que genera Claude. Es un buen ejemplo de cómo un proveedor implementa el artículo 50.2, pero resuelve la parte del proveedor. La parte que le toca a tu empresa sigue ahí. Esta transparencia es exigible desde el 2 de agosto de 2026, como contamos en [qué obliga de verdad el AI Act desde el 2 de agosto](/blog/ai-act-2-agosto-que-cambia/).

## La noticia: tu proveedor de IA ya marca el contenido

Anthropic ha explicado en su documentación de soporte cómo marca el contenido generado por Claude. Lo resumimos como ejemplo real, de forma neutral y con sus propias limitaciones (según la documentación de Anthropic):

- Los modelos de Claude lanzados en la Unión Europea desde el 2 de agosto de 2026 marcan el contenido desde el primer día; los modelos anteriores están en un periodo de transición.
- Usa dos técnicas. La primera, una **marca de agua imperceptible incrustada en el texto** que genera: se aplica a nivel de modelo, viaja al copiar y pegar y puede sobrevivir a algunas ediciones. La segunda, **metadatos de procedencia firmados en los archivos** (.svg, .png, .jpg) siguiendo el estándar abierto **C2PA** (Coalition for Content Provenance and Authenticity).
- Anthropic trabaja en permitir que usuarios y terceros detecten esas marcas. La documentación técnica de detección llegará más adelante: por ahora no hay un detector público.

Todo esto responde a la obligación del artículo 50.2 del Reglamento (UE) 2024/1689, que obliga a los proveedores de sistemas de IA (incluidos los de uso general) a que la salida de sus sistemas esté marcada en un formato legible por máquina y sea detectable como generada o manipulada artificialmente. Es la obligación del proveedor. No la tuya.

Lo decimos abiertamente, como ya hicimos en el artículo anterior: en SoyLegal360 usamos Claude, de Anthropic, como proveedor de IA. Una consultora de cumplimiento no puede escribir sobre transparencia y esconder la suya.

## Lo que el marcado del proveedor no cubre: tus obligaciones

El artículo 50 reparte la transparencia entre dos papeles distintos: el proveedor del sistema de IA y el responsable del despliegue, que es la empresa que usa esa IA en su actividad. Que el proveedor cumpla su parte (el marcado del 50.2) no ejecuta la tuya. Si despliegas IA de cara al público, hay dos frentes que siguen siendo tuyos.

### Chatbots y asistentes: avisar de que es una IA (art. 50.1)

Si pones un chatbot o un asistente conversacional de cara a tu público, el artículo 50.1 exige que la persona sepa que está interactuando con una IA, salvo que resulte evidente por el contexto. En el texto de la norma ese mandato recae sobre el proveedor, que debe diseñar el sistema para que lo informe; pero quien opera el chatbot es quien tiene que asegurarse de que ese aviso está activado y se ve (y, si lo despliega bajo su propia marca, puede ser él mismo el proveedor a estos efectos). Esa información debe darse de forma clara y distinguible y, como muy tarde, en el momento de la primera interacción (artículo 50.5).

En la práctica: un chatbot de atención al cliente en tu web necesita un aviso visible de que quien responde es una IA. Que Claude o el modelo que uses marquen internamente el texto no coloca ese aviso por ti.

### Ultrafalsificaciones (deepfakes) y textos de interés público (art. 50.4)

El artículo 50.4 dirige otras dos obligaciones al responsable del despliegue, es decir, a tu empresa:

- **Ultrafalsificaciones (deepfakes).** Si generas o manipulas imágenes, audio o vídeo que constituyan una ultrafalsificación, tienes que hacer público que ese contenido se ha generado o manipulado de manera artificial. Cuando forma parte de una obra manifiestamente creativa, satírica, artística o de ficción, la obligación se limita a revelar su existencia de un modo que no dificulte el disfrute de la obra.
- **Textos de interés público.** Si publicas texto generado o manipulado con IA para informar al público sobre asuntos de interés público, tienes que divulgarlo. Con una excepción importante: no se aplica cuando el texto ha pasado por un proceso de revisión humana o de control editorial y una persona física o jurídica asume la responsabilidad editorial de la publicación.

Esa excepción del texto es la clave para muchas empresas. La norma no dice "todo lo escrito con IA lleva etiqueta", sino "el texto de interés público sin revisión humana editorial lleva etiqueta". Y el contenido de marketing corriente, además, no suele encajar en el concepto de asuntos de interés público, aunque conviene valorarlo caso a caso.

## El marcado es una señal, no una prueba

Aquí está el error que conviene no cometer: tratar la marca del proveedor como una prueba de cumplimiento o de autoría. El propio Anthropic lo advierte en su documentación:

- Detectar la marca indica que el contenido **puede haber sido procesado por Claude**, no que Claude sea su autor. El modelo puede haber solo revisado, traducido o resumido un texto de otra fuente.
- La **ausencia** de marca tampoco prueba que no haya IA detrás. La marca se puede perder al editar, parafrasear o traducir el contenido, con textos muy cortos, o al eliminar los metadatos por una conversión de archivo o un pantallazo.

Es decir: la marca de agua es una señal útil, no una prueba concluyente, y hoy ni siquiera hay un detector público para comprobarla. Por eso no puede ser tu sistema de cumplimiento. El propio Anthropic lo dice sin rodeos: si integras Claude en tu propio producto, debes evaluar de forma independiente qué te exige el artículo 50 a tus productos y servicios. Ese es exactamente el punto de este artículo.

## Transparencia: usamos IA y lo decimos

Predicamos con el ejemplo. Este artículo se ha redactado con apoyo de IA y lo ha revisado nuestro equipo legal, que asume la responsabilidad editorial de lo publicado. Ese es, precisamente, el supuesto que el artículo 50.4 exceptúa para el texto: revisión humana y responsabilidad editorial. Y declaramos qué herramienta usamos en lugar de esconderla.

No es un adorno. Una marca que vende cumplimiento no puede incumplir la norma sobre la que asesora.

## Qué debería hacer tu empresa ahora

Con el reparto claro (el proveedor marca, tú informas), el trabajo por tu lado es corto pero concreto:

- **Inventaría** dónde usas IA de cara al público: chatbots, asistentes, generación de imágenes o textos para marketing, atención automatizada.
- **Chatbots:** comprueba que avisan de que son una IA, de forma clara y en la primera interacción (artículos 50.1 y 50.5).
- **Deepfakes:** si generas imágenes, audio o vídeo sintéticos, etiquétalos (artículo 50.4).
- **Textos de interés público:** divúlgalo, o asegúrate de que pasan por revisión humana con responsabilidad editorial (artículo 50.4).
- **No confíes el cumplimiento a la marca del proveedor:** documenta tú tu propio proceso.

Si no tienes claro qué usos de IA tienes ni qué te obliga cada uno, nuestra [auditoría de IA](/auditoria-ia/) los inventaría, los clasifica por riesgo y te dice qué parte del artículo 50 te toca a ti. Si ya sabes que hay que actuar, la [adaptación de IA](/adaptacion-ia/) lo pone en marcha. Y si quieres el marco completo, aquí tienes nuestra guía sobre [qué es una auditoría de IA, a quién obliga y qué revisa](/blog/auditoria-ia-empresas/).
