---
titulo: "Conectar ChatGPT a los datos de tu empresa sin regalarlos: así funciona una conexión MCP de solo lectura"
meta: "Conectar ChatGPT a los datos de tu empresa sin regalarlos: qué es una conexión MCP de solo lectura, revocable y con registro de uso, y qué exige el RGPD."
slug: conectar-tu-ia-a-tu-cumplimiento-rgpd
titulo_tarjeta: "Conecta tu IA a tu cumplimiento RGPD"
imagen: /assets/img/blog/conectar-tu-ia-a-tu-cumplimiento-rgpd.webp
fecha: 2026-08-19
publico: pyme
keyword: "conectar ChatGPT a los datos de tu empresa"
cta: auditoria-gratuita
enlaces_internos:
  - /auditoria-web-gratuita/
  - /auditoria-ia/
  - /adaptacion-ia/
  - /proteccion-legal-continua/
  - /blog/politica-de-privacidad-con-chatgpt/
  - /blog/contrato-encargado-del-tratamiento/
faq:
  - q: "¿Puedo conectar ChatGPT o Claude a los datos de mi empresa sin incumplir el RGPD?"
    a: "Sí, si controlas qué datos ve la IA y en qué condiciones. El problema habitual no es la conexión en sí, sino el copiar y pegar sin criterio: volcar en un chat datos de clientes o empleados es comunicarlos a un tercero, y eso exige base jurídica (artículo 6 RGPD) y, con el proveedor, un contrato de encargado del tratamiento (artículo 28.3 RGPD). Una conexión bien diseñada hace lo contrario: expone solo información no personal y de solo lectura, se puede revocar al instante y deja registro de cada uso."
  - q: "¿Qué es MCP (Model Context Protocol)?"
    a: "Es un estándar abierto que permite a un asistente de IA (Claude, ChatGPT, Copilot, Gemini) consultar una fuente de datos externa de forma controlada, en lugar de que el usuario copie y pegue la información en el chat. Quien publica la conexión decide exactamente qué se puede consultar y qué no. En el área de cliente de SoyLegal360, la conexión MCP es de solo lectura: la IA puede leer la ficha de cumplimiento, pero no puede modificar nada ni acceder a datos que no estén expuestos expresamente."
  - q: "¿Qué ve mi IA si la conecto al área de cliente de SoyLegal360?"
    a: "Ve tu estado de cumplimiento RGPD: la ficha de cumplimiento, la lista de documentos y el historial de consultas con los abogados. No ve datos privados de la empresa como el CIF ni los datos de contacto, porque la conexión aplica minimización de datos desde el diseño (artículos 5.1.c y 25 RGPD). Es de solo lectura, solo la gestiona el titular de la cuenta, se puede revocar al instante y cada acceso queda registrado."
  - q: "¿Es seguro dar acceso a una IA a documentos de mi empresa?"
    a: "Depende de cómo se dé el acceso. Pegar documentos en un chat no deja rastro, no se puede revocar y suele incluir más datos de los necesarios. Una conexión de solo lectura con alcance limitado invierte esa lógica: tú decides el perímetro, puedes cortarla en cualquier momento y hay registro de uso. El RGPD exige medidas de seguridad apropiadas al riesgo (artículo 32) y protección de datos desde el diseño y por defecto (artículo 25); una conexión revocable, mínima y auditada encaja con ambos principios."
  - q: "¿Puedo llevarme mis datos si dejo de ser cliente?"
    a: "Sí. El derecho a la portabilidad (artículo 20 RGPD) permite a las personas físicas recibir sus datos en un formato estructurado y de uso común. Para los datos de tu empresa, en SoyLegal360 aplicamos ese mismo principio como política propia: la descarga completa está disponible en un clic, en cualquier momento y sin tener que solicitarla ni esperar respuesta. Tus datos son tuyos."
fuentes:
  - "RGPD (Reglamento (UE) 2016/679), artículo 5.1.c) (minimización de datos), artículo 6 (licitud del tratamiento: base jurídica), artículo 20 (derecho a la portabilidad: recibir los datos en formato estructurado, de uso común y lectura mecánica), artículo 25 (protección de datos desde el diseño y por defecto), artículo 28.3 (contrato de encargado del tratamiento) y artículo 32 (seguridad del tratamiento: medidas técnicas y organizativas apropiadas al riesgo) · https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A32016R0679"
  - "RGPD, artículo 12.3 (plazo general para responder al ejercicio de derechos, incluida la portabilidad: un mes desde la recepción, prorrogable dos meses más en casos complejos) · https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A32016R0679"
  - "LOPDGDD (Ley Orgánica 3/2018), artículo 73.k) (infracción grave: encargar el tratamiento a un tercero sin el contrato del artículo 28.3 RGPD) · https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673"
  - "Model Context Protocol (MCP), especificación del estándar abierto para conectar asistentes de IA con fuentes de datos externas · https://modelcontextprotocol.io/"
estado_revision: verificado
---

Conectar ChatGPT a los datos de tu empresa sin regalarlos es posible: la clave es una conexión de solo lectura, con alcance limitado, revocable al instante y con registro de cada acceso, en lugar del copiar y pegar de siempre. Eso es exactamente lo que estrena el área de cliente de SoyLegal360: una conexión MCP para que la IA que ya usas (Claude, ChatGPT, Copilot o Gemini) consulte tu ficha de cumplimiento RGPD, tus documentos y tus consultas con los abogados, sin que tú muevas un dedo y sin ceder el control de nada.

## El problema real: tus datos ya están entrando en la IA, pero sin control

La mayoría de pymes y autónomos que usan ChatGPT o Claude a diario ya están metiendo datos de su empresa en la IA. Lo hacen a mano: pegan contratos, correos, listados de clientes, políticas internas. Y ese gesto tiene tres problemas:

- **No hay perímetro.** Se pega lo que haga falta en ese momento, incluidos datos que la IA no necesitaba ver. La minimización de datos es un principio del RGPD (artículo 5.1.c), y el copiar y pegar es su enemigo natural.
- **No hay marcha atrás.** Lo pegado, pegado está. No existe un botón de "revocar" para un texto que ya salió de tu empresa.
- **No hay registro.** Nadie en la empresa sabe qué se ha compartido, cuándo ni con qué herramienta.

Si además lo que se pega incluye datos personales de clientes, proveedores o empleados, el asunto sube de nivel: comunicar datos a un proveedor de IA es un tratamiento que necesita base jurídica (artículo 6 RGPD) y un contrato de encargado del tratamiento con el contenido del artículo 28.3. Encargar el tratamiento sin ese contrato es una infracción grave (artículo 73.k de la LOPDGDD). Lo explicamos en detalle en [qué es el contrato de encargado del tratamiento](/blog/contrato-encargado-del-tratamiento/) y en [por qué la política de privacidad no se publica tal cual sale del chat](/blog/politica-de-privacidad-con-chatgpt/).

## La alternativa: que la IA consulte, no que tú vuelques

Aquí entra **MCP (Model Context Protocol)**, un estándar abierto que, en una frase, permite a tu asistente de IA consultar una fuente de datos externa de forma controlada, en lugar de que tú le pegues la información en el chat. Lo soportan los principales asistentes del mercado, y quien publica la conexión decide exactamente qué se puede leer.

El área de cliente de SoyLegal360 estrena conexiones MCP con esta lógica. Si eres cliente, tu IA puede consultar directamente:

- **Tu ficha de cumplimiento**: en qué estado está tu adaptación RGPD.
- **Tus documentos RGPD**: qué documentos tienes y cuáles son.
- **Tus consultas con los abogados**: el historial de lo ya resuelto, para que la IA no te haga repetirlo.

Un ejemplo práctico: le preguntas a tu ChatGPT "¿tengo el registro de actividades de tratamiento al día?" y responde consultando tu ficha real, no inventando ni pidiéndote que se lo pegues.

## Lo contrario de regalar tus datos

La conexión está diseñada al revés que el copiar y pegar, y cada decisión de diseño responde a un principio del RGPD:

- **Solo lectura.** La IA consulta; no puede modificar, borrar ni escribir nada.
- **Sin datos privados.** La conexión no expone el CIF ni los datos de contacto de la empresa. Solo lo necesario para responder sobre cumplimiento: minimización desde el diseño (artículos 5.1.c y 25 RGPD).
- **Revocable al instante.** Un clic en el área de cliente y la conexión muere. Lo pegado en un chat no se puede despegar; una conexión sí se puede cortar.
- **Con registro de uso.** Cada acceso queda anotado. Sabes qué se consultó y cuándo, en línea con la seguridad apropiada al riesgo que exige el artículo 32 RGPD.
- **Solo la gestiona el titular.** Crear o revocar conexiones es exclusivo del titular de la cuenta, no de cualquier miembro del equipo.

## El mismo principio en todo el área de cliente: tus datos son tuyos

La conexión MCP no es una feature suelta, es la aplicación de una regla de la casa. En la misma área de cliente:

- **Te llevas todo en un clic.** Descarga completa de tus datos en formato estructurado, cuando quieras. Es el derecho a la portabilidad del artículo 20 RGPD, pero sin tener que ejercerlo formalmente ni esperar el plazo de respuesta de hasta un mes que permite el artículo 12.3: el botón está siempre ahí.
- **Ves quién entra y desde dónde.** Panel de seguridad con sesiones activas (con cierre remoto), alerta por email cuando hay un acceso desde un dispositivo nuevo y registro de actividad.
- **Sabes lo que cuesta antes de que cueste.** En las consultas con abogado apruebas el precio antes de que se facture nada; la consulta adicional cuesta 29 € + IVA con una dedicación máxima de 15 minutos.

Una consultoría de protección de datos que retuviera los datos de sus clientes como rehenes tendría un problema de coherencia. Nosotros predicamos con el ejemplo.

## Y si aún no eres cliente: empieza por saber dónde estás

Conectar tu IA a tu cumplimiento presupone algo previo: tener un cumplimiento al que conectarla. Si todavía no sabes en qué estado está tu empresa, el primer paso es gratis: pide la [auditoría gratuita](/auditoria-web-gratuita/) y te decimos qué tienes bien, qué te falta y por dónde empezar. Y si tu empresa ya usa IA en el día a día y quieres hacerlo con orden, mira la [auditoría de IA](/auditoria-ia/) y la [adaptación a la normativa de IA](/adaptacion-ia/): son el complemento natural de todo lo anterior.
