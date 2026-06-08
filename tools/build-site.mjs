import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = new URL("../site/", import.meta.url).pathname;
const assetRoot = new URL("../assets/img/", import.meta.url).pathname;
const baseUrl = "https://www.soylegal360.es";
const cookiePolicyEmbed = new URL(
  "../published-embeds/politica-de-cookies/01-zjclt5-legal-cookies.html",
  import.meta.url,
);
const homeCalculatorEmbed = new URL(
  "../published-embeds/home/05-zo5ssx-calculadora.html",
  import.meta.url,
);
const homeAepdEmbed = new URL(
  "../published-embeds/home/03-zirhj9-seccion-home.html",
  import.meta.url,
);
const homeHelpEmbed = new URL(
  "../published-embeds/home/01-z-3qqo-seccion-home.html",
  import.meta.url,
);
const homeCtaEmbed = new URL(
  "../published-embeds/home/02-zse84t-cta.html",
  import.meta.url,
);
const servicesHubEmbed = new URL(
  "../published-embeds/servicios-proteccion-de-datos/01-zoejmc-pagina-hub.html",
  import.meta.url,
);
const auditoriaRgpdEmbed = new URL(
  "../published-embeds/auditoria-rgpd/01-zxc8wl-pagina-completa.html",
  import.meta.url,
);
const auditoriaIaEmbed = new URL(
  "../published-embeds/auditoria-ia/01-zekvlz-pagina-completa.html",
  import.meta.url,
);
const adaptacionIaEmbed = new URL(
  "../published-embeds/adaptacion-ia/01-z6mzqz-pagina-completa.html",
  import.meta.url,
);
const webLegalEmbed = new URL(
  "../published-embeds/web-legal-lista-en-7-dias/01-z84frf-pagina-completa.html",
  import.meta.url,
);
const adaptacionEmpresaEmbeds = [
  "../published-embeds/adaptacion-empresa-rgpd/01-z9v6-s-cta.html",
  "../published-embeds/adaptacion-empresa-rgpd/03-zxnzd5-seccion-html.html",
  "../published-embeds/adaptacion-empresa-rgpd/06-zxxvqx-cta.html",
  "../published-embeds/adaptacion-empresa-rgpd/04-zkmtzv-cta.html",
  "../published-embeds/adaptacion-empresa-rgpd/02-zcqjju-faq.html",
  "../published-embeds/adaptacion-empresa-rgpd/05-zlqxph-cta.html",
].map((path) => new URL(path, import.meta.url));

const serviceGroups = [
  {
    title: "Diagnóstico y auditoría",
    links: [
      ["/auditoria-web-gratuita/", "Auditoría web gratuita"],
      ["/auditoria-rgpd/", "Auditoría RGPD"],
      ["/auditoria-ia/", "Auditoría IA"],
    ],
  },
  {
    title: "Adaptación y cumplimiento",
    links: [
      ["/adaptacion-web-rgpd/", "Adaptación Web RGPD"],
      ["/adaptacion-empresa-rgpd/", "Adaptación Empresa RGPD"],
      ["/adaptacion-ia/", "Adaptación IA"],
    ],
  },
  {
    title: "Continuidad y figuras obligatorias",
    links: [
      ["/proteccion-legal-continua/", "Protección Legal Continua"],
      ["/delegado-de-proteccion-de-datos-externalizado/", "Delegado de Protección de Datos"],
    ],
  },
  {
    title: "Web y legal digital",
    links: [
      ["/web-legal-lista-en-7-dias/", "Web Legal Lista en 7 Días"],
      ["/consultoria-proteccion-de-datos/", "Consultoría Protección de Datos"],
      ["/consultoria-legal/", "Consultoría Legal"],
      ["/revision-de-contratos/", "Revisión de contratos"],
    ],
  },
];

const nav = [
  ["/", "Inicio"],
  ["/servicios-proteccion-de-datos/", "Servicios"],
  ["/como-funciona/", "Cómo funciona"],
  ["/sobre-nosotros/", "Sobre nosotros"],
  ["/faqs/", "FAQs"],
  ["/contacto/", "Contacto"],
];

const footerServices = [
  ["/auditoria-web-gratuita/", "Auditoría Web Gratuita"],
  ["/adaptacion-web-rgpd/", "Adaptación Web RGPD"],
  ["/adaptacion-empresa-rgpd/", "Adaptación Empresa RGPD"],
  ["/adaptacion-ia/", "Adaptación IA"],
  ["/web-legal-lista-en-7-dias/", "Web Legal Lista en 7 Días"],
  ["/proteccion-legal-continua/", "Protección Legal Continua"],
  ["/delegado-de-proteccion-de-datos-externalizado/", "Delegado de Protección de Datos"],
  ["/consultoria-legal/", "Consultoría Legal"],
];

const contact = {
  email: "info@soylegal360.es",
  privacyEmail: "privacidad@soylegal360.es",
  phone: "+34 645 668 235",
  phoneHref: "tel:+34645668235",
  addressName: "Torre Millenium",
  address: "Av. Francesc Macià, 60 planta 19, 08208 Sabadell (Barcelona)",
};

const integrations = {
  cookiebotId: "085be98f-70af-4e14-8e4a-aa2d511df57a",
  tally: {
    auditoria:
      "https://tally.so/embed/ODdgMY?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1",
    contacto:
      "https://tally.so/embed/Zj1O5B?hideTitle=1&dynamicHeight=1&formEventsForwarding=1",
  },
};

const serviceCards = [
  {
    href: "/auditoria-web-gratuita/",
    title: "Auditoría Web Gratuita",
    meta: "Revisión inicial en 48 h",
    text: "Para detectar señales de incumplimiento visibles en textos, formularios, cookies y LSSI-CE antes de decidir el siguiente paso.",
  },
  {
    href: "/adaptacion-web-rgpd/",
    title: "Adaptación Web RGPD / LSSI-CE",
    meta: "Desde 390 euros + IVA",
    text: "Documentación legal a medida para que tu web deje de apoyarse en textos genéricos.",
  },
  {
    href: "/adaptacion-empresa-rgpd/",
    title: "Adaptación RGPD Empresa",
    meta: "Desde 490 euros + IVA",
    text: "Para cubrir clientes, empleados, proveedores, herramientas digitales y obligaciones internas.",
  },
  {
    href: "/proteccion-legal-continua/",
    title: "Protección Legal Continua",
    meta: "Desde 49 euros/mes + IVA",
    text: "Seguimiento, actualizaciones, alertas y consultas para que el cumplimiento no se quede parado.",
  },
];

const serviceDirectory = [
  {
    title: "Diagnóstico y auditoría",
    text:
      "Un diagnóstico orienta el punto de entrada. Una auditoría baja al detalle y ordena riesgos, evidencias y prioridades.",
    links: [
      {
        href: "/auditoria-web-gratuita/",
        title: "Auditoría Web Gratuita",
        text: "Entrada rápida para una web ya publicada.",
      },
      {
        href: "/auditoria-rgpd/",
        title: "Auditoría RGPD",
        text: "Revisión profunda del cumplimiento, documentación, evidencias y prioridades.",
      },
      {
        href: "/auditoria-ia/",
        title: "Auditoría IA",
        text: "Revisión de usos de IA, proveedores, datos personales y riesgos legales.",
      },
    ],
  },
  {
    title: "Adaptación y cumplimiento",
    text:
      "Cuando ya toca implementar el cumplimiento: web, empresa o uso de inteligencia artificial.",
    links: [
      {
        href: "/adaptacion-web-rgpd/",
        title: "Adaptación Web RGPD",
        text: "Aviso legal, privacidad, cookies, formularios y guía de implementación.",
      },
      {
        href: "/adaptacion-empresa-rgpd/",
        title: "Adaptación Empresa RGPD",
        text: "Niveles según tamaño, tratamientos, proveedores, empleados y complejidad.",
      },
      {
        href: "/adaptacion-ia/",
        title: "Adaptación IA",
        text: "Inventario de usos, información a usuarios, RGPD y medidas internas.",
      },
    ],
  },
  {
    title: "Continuidad y figuras obligatorias",
    text:
      "Para negocios que necesitan mantener el cumplimiento vivo o cubrir una figura especializada.",
    links: [
      {
        href: "/proteccion-legal-continua/",
        title: "Protección Legal Continua",
        text: "Revisión periódica, novedades, actualizaciones y consultas.",
      },
      {
        href: "/delegado-de-proteccion-de-datos-externalizado/",
        title: "Delegado de Protección de Datos",
        text: "DPD externo cuando la organización necesita esta figura.",
      },
    ],
  },
  {
    title: "Web y legal digital",
    text:
      "Servicios para presencia online, consultas concretas y decisiones que no caben en un pack cerrado.",
    links: [
      {
        href: "/web-legal-lista-en-7-dias/",
        title: "Web Legal Lista en 7 Días",
        text: "Presencia online profesional con la parte legal integrada desde el inicio.",
      },
      {
        href: "/consultoria-proteccion-de-datos/",
        title: "Consultoría Protección de Datos",
        text: "Criterio profesional para una duda, tratamiento o decisión concreta.",
      },
      {
        href: "/consultoria-legal/",
        title: "Consultoría Legal",
        text: "Asesoramiento jurídico para dudas legales digitales y de negocio.",
      },
      {
        href: "/revision-de-contratos/",
        title: "Revisión de Contratos",
        text: "Lectura jurídica de obligaciones, riesgos y límites contractuales.",
      },
    ],
  },
];

const pages = [
  {
    slug: "",
    title: "Asesoría legal y cumplimiento RGPD LOPDGDD LSSICE | SoyLegal360",
    description:
      "SoyLegal360 ofrece asesoría legal y cumplimiento RGPD, LOPDGDD y LSSICE para pymes, autónomos, empresas y profesionales.",
    body: homeBody(),
  },
  {
    slug: "servicios-proteccion-de-datos",
    title: "Servicios RGPD y LSSICE para pymes y autónomos | SoyLegal360",
    description:
      "Servicios de cumplimiento RGPD, LOPDGDD y LSSICE organizados por diagnóstico, adaptación, continuidad y legal digital.",
    body: servicesHubBody(),
  },
  {
    slug: "auditoria-web-gratuita",
    title: "Auditoría Web RGPD Gratuita en 48h | SoyLegal360",
    description:
      "Auditoría gratuita de tu web para revisar cumplimiento RGPD, LOPDGDD y LSSICE. Sin compromiso y con informe en 48 horas.",
    body: detailBody({
      kicker: "Gratis · Sin compromiso · En 48 horas",
      h1: "Auditoría Web Gratuita",
      lead: "Soluciones de cumplimiento normativo RGPD, LOPDGDD y LSSI-CE adaptadas a tu negocio.",
      sections: [
        {
          title: "Qué revisamos",
          text: [
            "Analizamos tu web y detectamos los puntos de incumplimiento del RGPD-LOPDGDD y la LSSICE.",
            "Te entregamos un informe profesional con los puntos detectados, el nivel de riesgo de cada incumplimiento, una valoración global del estado de cumplimiento y nuestra propuesta para ayudarte a solucionarlo.",
            "No te pedimos datos bancarios. No te comprometes a nada. Solo necesitamos la URL de tu web y un email para enviarte el informe.",
          ],
          bullets: [
            "Puntos de incumplimiento detectados en tu web",
            "Nivel de riesgo de cada incumplimiento",
            "Valoración global del estado de cumplimiento",
            "Propuesta para ayudarte a solucionarlo",
          ],
        },
        formEmbed("auditoria"),
      ],
      cta: ["Auditoría web gratuita", "/contacto/"],
    }),
  },
  {
    slug: "auditoria-rgpd",
    title: "Auditoría RGPD para empresas | SoyLegal360",
    description:
      "Auditoría RGPD para revisar tratamientos, documentación, riesgos y prioridades antes de adaptar la protección de datos de tu empresa.",
    body: publishedFullPageBody(auditoriaRgpdEmbed),
  },
  {
    slug: "auditoria-ia",
    title: "Auditoría IA para empresas | AI Act y RGPD | SoyLegal360",
    description:
      "Auditoría IA para empresas: inventario de usos, clasificación de riesgo AI Act, RGPD, proveedores, transparencia y prioridades antes de adaptar.",
    body: publishedFullPageBody(auditoriaIaEmbed),
  },
  {
    slug: "adaptacion-web-rgpd",
    title: "Adaptación Web RGPD | SoyLegal360",
    description:
      "Adaptación web RGPD desde 390 euros + IVA: aviso legal, privacidad, cookies, formularios y guía de implementación.",
    body: detailBody({
      kicker: "Desde 390 euros + IVA",
      h1: "Adaptación Web RGPD",
      lead: "Cumplimiento legal real para tu negocio.",
      sections: [
        {
          title: "Qué hacemos",
          text: [
            "En SoyLegal360 ayudamos a pymes, autónomos, empresas, profesionales y e-commerce a tener una web alineada con la normativa española de protección de datos.",
            "Nos encargamos de que tu web cumpla con el RGPD y la LSSICE, con documentación legal redactada a medida por nuestro equipo de abogadas colegiadas del ICAB, especializadas en protección de datos y certificadas como Delegadas de Protección de Datos.",
            "Nada de plantillas. Nada de generadores automáticos. Cada texto legal se redacta específicamente para tu negocio, tu sector y tu forma de tratar datos.",
          ],
        },
        {
          title: "Incluye",
          text: ["Que tu web cumpla lo básico y deje de ser un riesgo."],
          bullets: [
            "Aviso Legal personalizado (LSSICE art. 10)",
            "Política de Privacidad a medida (RGPD)",
            "Política de Cookies adaptada",
            "Cláusulas informativas para formularios",
            "Guía de Implementación: dónde colocar cada documento y cómo activar el banner de cookies",
            "Todo firmado por abogada colegiada",
          ],
        },
      ],
      cta: ["Adapta mi web", "/contacto/"],
    }),
  },
  {
    slug: "adaptacion-empresa-rgpd",
    title: "Adaptación Empresa RGPD Protección de Datos - SoyLegal360",
    description:
      "Adaptación de empresas al RGPD, LOPDGDD y LSSICE: documentación, RAT, proveedores, brechas y formación según nivel.",
    body: adaptacionEmpresaBody(),
  },
  {
    slug: "adaptacion-ia",
    title: "Adaptación IA y AI Act para empresas | SoyLegal360",
    description:
      "Servicio de adaptación IA para empresas: Reglamento Europeo de Inteligencia Artificial, AI Act, RGPD, proveedores, transparencia, política interna de IA y análisis de riesgos.",
    body: publishedFullPageBody(adaptacionIaEmbed),
  },
  {
    slug: "proteccion-legal-continua",
    title: "Protección Legal Continua para pymes, empresas y autónomos | SoyLegal360",
    description:
      "Protección Legal Continua desde 49 euros al mes para mantener el cumplimiento actualizado.",
    body: detailBody({
      kicker: "Desde 49 euros/mes + IVA",
      h1: "Protección Legal Continua",
      lead: "La normativa cambia. Tu web también debería. Con nuestra protección mensual, tu negocio está siempre al día, sin que tengas que estar pendiente.",
      sections: [
        {
          title: "Qué incluye",
          bullets: [
            "2 videollamadas de seguimiento al año con abogado especializado en RGPD-LOPDGDD y LSSI-CE",
            "Informe trimestral de novedades RGPD relevantes para tu sector",
            "Actualización de tus documentos legales ante cambios normativos",
            "Alertas proactivas cuando la legislación te afecta",
            "2 consultas legales por email al mes con respuesta en 24-48 h hábiles",
          ],
          text: [
            "Piensa en ello como un seguro legal para tu presencia digital. Por menos de lo que cuesta un café al día, tienes la tranquilidad de saber que tu web cumple siempre.",
          ],
        },
      ],
      cta: ["Quiero protección legal", "/contacto/"],
    }),
  },
  {
    slug: "web-legal-lista-en-7-dias",
    title: "Web Legal Lista en 7 Días | SoyLegal360",
    description:
      "Dos niveles para lanzar tu presencia online con cumplimiento legal integrado: Pack Presencia Legal y Pack Web Completa. Web profesional y legal lista en 7 días.",
    body: publishedFullPageBody(webLegalEmbed),
  },
  {
    slug: "delegado-de-proteccion-de-datos-externalizado",
    title: "DPO Externo: Delegado de Protección de Datos | SoyLegal360",
    description:
      "Servicio de Delegado de Protección de Datos externalizado para organizaciones que necesitan cumplir con RGPD y LOPDGDD.",
    body: detailBody({
      kicker: "DPD externo",
      h1: "Delegado de Protección de Datos",
      lead: "Servicio de Delegado de Protección de Datos Externalizado.",
      sections: [
        {
          title: "Cuándo necesitas esta figura",
          text: [
            "Si tu negocio trata datos personales sensibles o a gran escala, la normativa puede exigirte designar un Delegado de Protección de Datos.",
            "Es una figura técnica y jurídica que actúa como punto de contacto con la AEPD y vela por el cumplimiento del RGPD en tu organización.",
            "En SoyLegal360 asumimos esa función con nuestro equipo de abogadas colegiadas del ICAB, certificadas como Delegadas de Protección de Datos.",
          ],
        },
        {
          title: "Qué incluye",
          bullets: [
            "Designación oficial ante la AEPD",
            "Punto de contacto continuo con la Agencia y con los interesados",
            "Asesoramiento permanente sobre cumplimiento RGPD, LOPDGDD y LSSICE",
            "Revisión periódica de tratamientos y análisis de riesgos",
            "Atención de derechos de los interesados",
            "Soporte ante brechas de seguridad y comunicación en plazo a la AEPD",
          ],
          text: ["Modalidades: mensual, trimestral o anual."],
        },
      ],
      cta: ["Solicitar propuesta", "/contacto/"],
    }),
  },
  {
    slug: "consultoria-proteccion-de-datos",
    title: "Consultoría en Protección de Datos para pymes y autónomos | SoyLegal360",
    description:
      "Consultoría puntual en Protección de Datos para dudas concretas sobre RGPD, LOPDGDD y LSSICE.",
    body: detailBody({
      kicker: "Consulta puntual",
      h1: "Consultoría Protección de Datos",
      lead: "No todas las dudas necesitan un proyecto completo. A veces basta con una consulta clara.",
      sections: [
        {
          title: "Cuándo recurrir a consultoría puntual",
          bullets: [
            "Dudas sobre tratamientos concretos de datos",
            "Validación de campañas de marketing y comunicaciones",
            "Cesiones de datos a terceros",
            "Cláusulas de consentimiento específicas",
            "Adaptación a cambios normativos puntuales",
            "Supuestos que no encajan en packs estándar",
          ],
          text: [
            "Te damos respuestas concretas, fundamentadas y aplicables, sin obligarte a contratar un servicio recurrente.",
          ],
        },
      ],
      cta: ["Consúltanos tu caso", "/contacto/"],
    }),
  },
  {
    slug: "consultoria-legal",
    title: "Consultoría Legal para pymes, empresas y autónomos | SoyLegal360",
    description:
      "Consultoría legal vinculada a actividad digital, protección de datos y aspectos mercantiles.",
    body: detailBody({
      kicker: "Legal digital",
      h1: "Consultoría Legal",
      lead: "Una duda legal vinculada a tu actividad digital: derecho digital, protección de datos y aspectos mercantiles de tu negocio.",
      sections: [
        {
          title: "Contenido publicado actual",
          text: [
            "La página publicada reutiliza actualmente el bloque de revisión profesional de contratos. Se mantiene esta estructura hasta separar el contenido exacto de consultoría legal y revisión de contratos.",
          ],
          bullets: [
            "Contratos de prestación de servicios",
            "Contratos con clientes",
            "Contratos de tratamiento de datos",
            "Acuerdos de confidencialidad",
            "Términos y condiciones de web o plataforma",
          ],
        },
      ],
      cta: ["Revisar mi caso", "/contacto/"],
    }),
  },
  {
    slug: "revision-de-contratos",
    title: "Revisión de Contratos para PYMEs - SoyLegal360",
    description:
      "Revisión profesional de contratos para detectar riesgos, explicar compromisos y proponer correcciones.",
    body: detailBody({
      kicker: "Contratos",
      h1: "Revisión profesional de contratos",
      lead: "Un contrato mal revisado puede salir muy caro.",
      sections: [
        {
          title: "Qué revisamos",
          text: [
            "Revisamos cualquier contrato que vayas a firmar o que ya tengas firmado, te explicamos en lenguaje claro qué te compromete realmente, dónde están los riesgos, y te proponemos las correcciones necesarias para protegerte.",
          ],
          bullets: [
            "Contratos de prestación de servicios",
            "Contratos con clientes B2B, B2C o e-commerce",
            "Contratos de tratamiento de datos",
            "Acuerdos de confidencialidad",
            "Términos y condiciones de tu web o plataforma",
          ],
        },
        {
          title: "Qué entregamos",
          bullets: [
            "Informe escrito con cláusulas problemáticas identificadas",
            "Propuestas de redacción alternativa",
            "Asesoramiento sobre cómo negociar puntos críticos",
          ],
        },
      ],
      cta: ["Revisar mi contrato", "/contacto/"],
    }),
  },
  {
    slug: "como-funciona",
    title: "Cumple con RGPD y LSSICE fácilmente | SoyLegal360",
    description:
      "Proceso de trabajo de SoyLegal360 en cuatro pasos: auditoría, análisis, informe y siguiente paso.",
    body: processBody(),
  },
  {
    slug: "faqs",
    title: "Preguntas Frecuentes sobre Cumplimiento RGPD | SoyLegal360",
    description:
      "Preguntas frecuentes sobre RGPD, LOPDGDD, LSSICE, auditoría web, DPO y Protección Legal Continua.",
    body: faqBody(),
  },
  {
    slug: "sobre-nosotros",
    title: "Consultoría de Cumplimiento Normativo | SoyLegal360",
    description:
      "SoyLegal360 combina derecho y tecnología para democratizar la protección legal de empresas, pymes, autónomos y profesionales.",
    body: aboutBody(),
  },
  {
    slug: "contacto",
    title: "Contacto | SoyLegal360",
    description:
      "Contacta con SoyLegal360 para resolver tus dudas legales sobre RGPD, LOPDGDD, LSSICE y cumplimiento digital.",
    body: contactBody(),
  },
  {
    slug: "aviso-legal",
    title: "Aviso Legal | SoyLegal360",
    description: "Aviso legal de SoyLegal360 Servicios Jurídicos, S.L.",
    noindex: true,
    body: avisoLegalBody(),
  },
  {
    slug: "politica-de-privacidad",
    title: "Política de Privacidad | SoyLegal360",
    description: "Política de privacidad de SoyLegal360 Servicios Jurídicos, S.L.",
    noindex: true,
    body: privacyPolicyBody(),
  },
  {
    slug: "politica-de-cookies",
    title: "Política de Cookies | SoyLegal360",
    description: "Política de cookies de SoyLegal360.",
    noindex: true,
    body: cookiePolicyBody(),
  },
];

const redirects = [
  {
    slug: "privacy-policy",
    target: "/politica-de-privacidad/",
    title: "Redirección a Política de Privacidad",
  },
  {
    slug: "solicita-auditoria-web-gratuita",
    target: "/auditoria-web-gratuita/",
    title: "Redirección a Auditoría Web Gratuita",
  },
  {
    slug: "casos-de-exito",
    target: "/sobre-nosotros/",
    title: "Redirección temporal a Sobre nosotros",
  },
];

for (const page of pages) {
  const file = page.slug ? join(root, page.slug, "index.html") : join(root, "index.html");
  write(file, renderPage(page));
}

for (const redirect of redirects) {
  write(
    join(root, redirect.slug, "index.html"),
    renderRedirect(redirect.title, redirect.target),
  );
}

copyStaticAssets();
write(join(root, "assets/css/styles.css"), styles());
write(join(root, "assets/js/site.js"), script());
write(join(root, ".htaccess"), htaccess());
write(join(root, "robots.txt"), robots());
write(join(root, "sitemap.xml"), sitemap());

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function copyStaticAssets() {
  mkdirSync(join(root, "assets/img"), { recursive: true });
  copyFileSync(
    join(assetRoot, "soylegal360_logo_color_horizontal.png"),
    join(root, "assets/img/soylegal360_logo_color_horizontal.png"),
  );
  copyFileSync(
    join(assetRoot, "soylegal360_logo_color.svg"),
    join(root, "assets/img/soylegal360_logo_color.svg"),
  );
  copyFileSync(
    join(assetRoot, "soylegal360_logo_color_header.svg"),
    join(root, "assets/img/soylegal360_logo_color_header.svg"),
  );
  copyFileSync(
    join(assetRoot, "soylegal360_logo_blanco.svg"),
    join(root, "assets/img/soylegal360_logo_blanco.svg"),
  );
  copyFileSync(
    join(assetRoot, "soylegal360_logo_blanco_footer.svg"),
    join(root, "assets/img/soylegal360_logo_blanco_footer.svg"),
  );
}

function renderPage(page) {
  const canonical = page.slug ? `${baseUrl}/${page.slug}/` : `${baseUrl}/`;
  const robotsMeta = page.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow">';
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  ${robotsMeta}
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="SoyLegal360">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:url" content="${canonical}">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32x32.png">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  ${cookiebotScript()}
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  ${header()}
  <main id="contenido">
    ${page.body}
  </main>
  ${footer()}
  <script src="/assets/js/site.js" defer></script>
</body>
</html>
`;
}

function renderRedirect(title, target) {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | SoyLegal360</title>
  <meta name="robots" content="noindex, follow">
  <meta http-equiv="refresh" content="0; url=${target}">
  <link rel="canonical" href="${baseUrl}${target}">
</head>
<body>
  <p>Redirigiendo a <a href="${target}">${target}</a>.</p>
</body>
</html>
`;
}

function cookiebotScript() {
  return `<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="${integrations.cookiebotId}" data-blockingmode="auto" type="text/javascript"></script>`;
}

function header() {
  const navItems = nav
    .map(([href, label]) => `<a href="${href}">${label}</a>`)
    .join("");
  const groupItems = serviceGroups
    .map(
      (group) => `<section>
        <h3>${group.title}</h3>
        ${group.links.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}
      </section>`,
    )
    .join("");

  return `<header class="site-header">
    <div class="header-inner">
      <a class="brand" href="/" aria-label="SoyLegal360 inicio">
        <img src="/assets/img/soylegal360_logo_color_header.svg" alt="SoyLegal360">
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <span></span><span></span><span></span>
        <span class="sr-only">Abrir menú</span>
      </button>
      <nav id="site-nav" class="site-nav" aria-label="Navegación principal">
        ${navItems}
        <details class="services-menu">
          <summary>Servicios por familia</summary>
          <div class="mega-menu">${groupItems}</div>
        </details>
        <a class="nav-cta" href="/auditoria-web-gratuita/">Auditoría web gratuita</a>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="footer-grid">
      <section>
        <img class="footer-logo" src="/assets/img/soylegal360_logo_blanco_footer.svg" alt="SoyLegal360">
        <p>Cumplimiento real para negocios reales.</p>
        <p><strong>Digitalización Blindada</strong></p>
      </section>
      <section>
        <h2>Servicios</h2>
        ${footerServices.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}
      </section>
      <section>
        <h2>Legal</h2>
        <a href="/aviso-legal/">Aviso Legal</a>
        <a href="/politica-de-privacidad/">Política de Privacidad</a>
        <a href="/politica-de-cookies/">Política de Cookies</a>
      </section>
      <section>
        <h2>Nuestra oficina</h2>
        <p>${contact.addressName}</p>
        <p>${contact.address}</p>
        <a href="mailto:${contact.email}">${contact.email}</a>
        <a href="${contact.phoneHref}">${contact.phone}</a>
      </section>
    </div>
    <div class="footer-bottom">© 2026 SoyLegal360. Todos los derechos reservados.</div>
  </footer>`;
}

function homeBody() {
  return `<section class="hero hero-home published-hero">
    <div class="hero-copy hero-copy-centered">
      <p class="eyebrow">RGPD · LOPDGDD · LSSICE<br><span>Protección de datos</span></p>
      <h1>Tu web tiene obligaciones legales.<br>¿Sabes si las <span class="hero-highlight">cumples todas</span>?</h1>
      <div class="hero-facts" aria-label="Datos destacados">
        <p>Hasta <strong>40.000€</strong> por infracción leve.</p>
        <p>El <strong>72%</strong> de las sanciones recaen sobre <b>autónomos y pymes.</b></p>
      </div>
      <p class="lead">En SoyLegal360 queremos ponértelo fácil, y te ofrecemos una auditoría gratuita de tu web para que sepas si tu página cumple con la protección de datos.</p>
      <div class="actions center-actions">
        <a class="button gold" href="/auditoria-web-gratuita/">Auditoría web gratuita</a>
      </div>
    </div>
  </section>
  ${homeGuide()}
  ${publishedHomeSection("porque-deberia-importarte", homeAepdEmbed)}
  ${homeRiskCalculator()}
  ${publishedHomeSection("como-te-ayudamos", homeHelpEmbed)}
  ${publishedHomeSection("cta-final", homeCtaEmbed)}
  ${contactBand()}`;
}

function homeGuide() {
  return `<nav class="home-guide" aria-label="Guía rápida de la página principal">
    <div class="home-guide-wrap">
      <div class="home-guide-intro">
        <p class="eyebrow">Guía rápida</p>
        <h2>Elige tu <span>siguiente paso</span></h2>
      </div>
      <div class="home-guide-routes">
        <a class="home-guide-route route-calc" href="#calculadora-riesgo-rgpd">
          <span class="route-top">
            <span class="route-kicker">Herramienta destacada</span>
            <span class="route-icon" aria-hidden="true">%</span>
          </span>
          <span>
            <b>Calcula tu riesgo RGPD</b>
            <p>Obtén una orientación inicial sobre tu web, datos, prácticas internas e IA.</p>
          </span>
          <span class="route-go">Ir a la calculadora</span>
        </a>
        <a class="home-guide-route" href="#porque-deberia-importarte">
          <span class="route-top">
            <span class="route-kicker">Contexto</span>
            <span class="route-icon" aria-hidden="true">!</span>
          </span>
          <span>
            <b>Ver por qué importa</b>
            <p>Cifras AEPD y riesgos habituales.</p>
          </span>
          <span class="route-go">Bajar</span>
        </a>
        <a class="home-guide-route" href="#como-te-ayudamos">
          <span class="route-top">
            <span class="route-kicker">Servicios</span>
            <span class="route-icon" aria-hidden="true">+</span>
          </span>
          <span>
            <b>Elegir solución</b>
            <p>Web, empresa o protección continua.</p>
          </span>
          <span class="route-go">Comparar</span>
        </a>
        <a class="home-guide-route" href="/auditoria-web-gratuita/">
          <span class="route-top">
            <span class="route-kicker">Diagnóstico</span>
            <span class="route-icon" aria-hidden="true">→</span>
          </span>
          <span>
            <b>Pedir auditoría</b>
            <p>Revisión inicial en 48 h.</p>
          </span>
          <span class="route-go">Solicitar</span>
        </a>
      </div>
    </div>
  </nav>`;
}

function homeRiskCalculator() {
  const raw = readFileSync(homeCalculatorEmbed, "utf8");
  const calculator = localizePublishedEmbed(raw)
    .replace(
      'src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=242,fit=crop/MZS9d1BboyNoZQUA/soylegal360_logo_blanco-y1PhXaZrbEu5XWTB.png"',
      'src="/assets/img/soylegal360_logo_blanco.svg"',
    );

  return `<section id="calculadora-riesgo-rgpd" class="section section-calculator">
    ${calculator}
  </section>`;
}

function publishedHomeSection(id, embedUrl) {
  return `<section id="${id}" class="published-embed-section">
    ${localizePublishedEmbed(readFileSync(embedUrl, "utf8"))}
  </section>`;
}

function localizePublishedEmbed(raw) {
  return fixSpanishCopy(normalizeInternalLinks(
    raw
      .replace(/^(?:\s*<!--[\s\S]*?-->\s*)+/, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .trim(),
  ));
}

function normalizeInternalLinks(raw) {
  const routes = [
    ["solicita-auditoria-web-gratuita", "auditoria-web-gratuita"],
    ["auditoria-web-gratuita", "auditoria-web-gratuita"],
    ["servicios-proteccion-de-datos", "servicios-proteccion-de-datos"],
    ["auditoria-rgpd", "auditoria-rgpd"],
    ["auditoria-ia", "auditoria-ia"],
    ["adaptacion-web-rgpd", "adaptacion-web-rgpd"],
    ["adaptacion-empresa-rgpd", "adaptacion-empresa-rgpd"],
    ["adaptacion-ia", "adaptacion-ia"],
    ["proteccion-legal-continua", "proteccion-legal-continua"],
    ["web-legal-lista-en-7-dias", "web-legal-lista-en-7-dias"],
    ["delegado-de-proteccion-de-datos-externalizado", "delegado-de-proteccion-de-datos-externalizado"],
    ["consultoria-proteccion-de-datos", "consultoria-proteccion-de-datos"],
    ["consultoria-legal", "consultoria-legal"],
    ["revision-de-contratos", "revision-de-contratos"],
    ["contacto", "contacto"],
  ];

  let html = raw.replace(/href="URL_PENDIENTE"/g, 'href="/auditoria-web-gratuita/"');

  for (const [from, to] of routes) {
    html = html
      .replace(new RegExp(`https://www\\.soylegal360\\.es/${from}/?`, "g"), `/${to}/`)
      .replace(new RegExp(`href="/${from}/?(?=([#"?]|$))`, "g"), `href="/${to}/`)
      .replace(new RegExp(`href:"/${from}/?(?=([#",}]|$))`, "g"), `href:"/${to}/`)
      .replace(new RegExp(`href:'/${from}/?(?=([#',}]|$))`, "g"), `href:'/${to}/`);
  }

  return html
    .replace(/\s+target="_top"/g, "")
    .replace(/\n\s*link\.target="_top";/g, "")
    .replace(/\/auditoria-web-gratuita\/#solicita-auditoria-web-gratuita/g, "/auditoria-web-gratuita/")
    .replace(/href="\/([^"#?]+)\/+#/g, 'href="/$1/#')
    .replace(/href="\/([^"#?]+)\/\/"/g, 'href="/$1/"');
}

function fixSpanishCopy(raw) {
  const replacements = [
    [/\bGuia rapida de la pagina\b/g, "Guía rápida de la página"],
    [/\bAcceso rapido\b/g, "Acceso rápido"],
    [/\bRiesgos y momentos de actuacion\b/g, "Riesgos y momentos de actuación"],
    [/\btelefono\b/g, "teléfono"],
    [/\blegitimacion\b/g, "legitimación"],
    [/\btecnicas\b/g, "técnicas"],
    [/\bboton\b/g, "botón"],
    [/\bvalido\b/g, "válido"],
    [/\bcamara\b/g, "cámara"],
    [/\binformacion\b/g, "información"],
    [/\bjuridica\b/g, "jurídica"],
    [/\blimites\b/g, "límites"],
    [/\bconservacion\b/g, "conservación"],
    [/\breclamacion\b/g, "reclamación"],
    [/\bcomunico\b/g, "comunicó"],
    [/\bnumero\b/g, "número"],
    [/ mas /g, " más "],
    [/\beconomico\b/g, "económico"],
    [/\bcuantia\b/g, "cuantía"],
    [/\btambien\b/g, "también"],
    [/\breputacion\b/g, "reputación"],
    [/\bestan\b/g, "están"],
    [/\bdocumentacion\b/g, "documentación"],
    [/\btecnica\b/g, "técnica"],
    [/\borganizacion\b/g, "organización"],
    [/\bfuncion\b/g, "función"],
    [/\bcarteleria\b/g, "cartelería"],
    [/\bauditoria IA\b/g, "auditoría IA"],
    [/\bauditoria RGPD\b/g, "auditoría RGPD"],
    [/\bauditoria web\b/g, "auditoría web"],
    [/\bAuditoria IA\b/g, "Auditoría IA"],
    [/\bAuditoria RGPD\b/g, "Auditoría RGPD"],
    [/\bAuditoria web\b/g, "Auditoría web"],
  ];

  return replacements.reduce((html, [pattern, replacement]) => html.replace(pattern, replacement), raw);
}

function localizeServicesHubEmbed(raw) {
  return fixSpanishCopy(normalizeInternalLinks(raw
    .replace(/^(?:\s*<!--[\s\S]*?-->\s*)+/, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim()
    .replace(/<main class="sl-services" data-sl-services="">/, '<div class="sl-services" data-sl-services>')
    .replace(/<\/main>/, "</div>")));
}

function servicesHubBody() {
  return localizeServicesHubEmbed(readFileSync(servicesHubEmbed, "utf8"));
}

function servicesPreview() {
  return `<section class="section section-soft">
    <div class="section-head">
      <p class="eyebrow">Servicios por familia</p>
      <h2>Encuentra el servicio correcto sin perderte entre siglas</h2>
      <p>Diagnóstico, adaptación, continuidad y legal digital. La estructura replica las URLs aprobadas y evita mezclar servicios que no tienen página validada.</p>
    </div>
    <div class="family-grid">
      ${serviceDirectory.map((group) => `<article class="family-card">
        <h3>${group.title}</h3>
        <p>${group.text}</p>
        ${group.links.map((link) => `<a href="${link.href}">${link.title}</a>`).join("")}
      </article>`).join("")}
    </div>
  </section>`;
}

function serviceCard(card) {
  return `<article class="entry-card">
    <p class="card-meta">${card.meta}</p>
    <h3>${card.title}</h3>
    <p>${card.text}</p>
    <a href="${card.href}">Ver servicio</a>
  </article>`;
}

function entryCard(title, text, href, label) {
  return `<article class="entry-card compact">
    <h3>${title}</h3>
    <p>${text}</p>
    <a href="${href}">${label}</a>
  </article>`;
}

function serviceDirectoryGroup(group) {
  return `<article class="directory-group">
    <header>
      <h3>${group.title}</h3>
      <p>${group.text}</p>
    </header>
    <div class="directory-links">
      ${group.links
        .map(
          (link) => `<a class="directory-link" href="${link.href}">
            <span>${link.title}</span>
            <small>${link.text}</small>
          </a>`,
        )
        .join("")}
    </div>
  </article>`;
}

function miniStat(label, text) {
  return `<article class="mini-stat">
    <strong>${label}</strong>
    <p>${text}</p>
  </article>`;
}

function detailBodyContent({ kicker, h1, lead, sections, cta }) {
  return `<section class="page-hero">
    <p class="eyebrow">${kicker}</p>
    <h1>${h1}</h1>
    <p>${lead}</p>
    ${cta ? `<a class="button primary" href="${cta[1]}">${cta[0]}</a>` : ""}
  </section>
  <section class="section">
    <div class="content-stack">
      ${sections.map(sectionBlock).join("")}
    </div>
  </section>`;
}

function detailBody({ kicker, h1, lead, sections, cta }) {
  return `${detailBodyContent({ kicker, h1, lead, sections, cta })}
  ${contactBand()}`;
}

function adaptacionEmpresaBody() {
  return `${detailBodyContent({
    kicker: "Adaptación empresa",
    h1: "Cumplimiento en protección de datos de extremo a extremo",
    lead: "No solo tu web: todo tu negocio. Redactado y firmado por abogadas especializadas en RGPD y colegiadas del ICAB.",
    sections: [
      {
        title: "Qué resolvemos",
        text: [
          "Cuando tienes empleados, clientes recurrentes, proveedores que acceden a tu información, herramientas digitales conectadas y obligaciones documentales internas, adaptar solo la web es insuficiente.",
          "La Agencia Española de Protección de Datos no sanciona por lo que ven tus visitantes en la web. Sanciona por lo que ocurre detrás: tratamientos sin base jurídica, falta de Registro de Actividades, contratos con proveedores sin firmar, brechas no notificadas en 72 horas o formularios laborales sin cláusula informativa.",
        ],
      },
      {
        title: "Niveles publicados",
        cards: [
          {
            title: "Adaptación RGPD Autónomos",
            meta: "Desde 490 euros + IVA · Pago único",
            text: "Para profesionales independientes que tratan datos de clientes, proveedores y herramientas digitales.",
          },
          {
            title: "Adaptación RGPD PYME (1-5 empleados)",
            meta: "Desde 690 euros + IVA · Pago único",
            text: "Para pequeños negocios y e-commerce con plantilla y tratamientos recurrentes de datos.",
          },
          {
            title: "Adaptación RGPD Empresa (6-20 empleados)",
            meta: "Desde 990 euros + IVA · Pago único",
            text: "Para pymes consolidadas, empresas con varios departamentos o sectores que requieren protección reforzada.",
          },
          {
            title: "Nivel 4 · Grandes estructuras",
            meta: "Presupuesto a medida",
            text: "Para estructuras con necesidades de cumplimiento complejas o alcance específico.",
          },
        ],
      },
    ],
    cta: ["Resolver dudas", "/contacto/"],
  })}
  ${adaptacionEmpresaEmbeds.map(publishedEmbedSection).join("")}`;
}

function publishedEmbedSection(embedUrl) {
  return `<section class="published-embed-section">
    ${localizePublishedEmbed(readFileSync(embedUrl, "utf8"))}
  </section>`;
}

function publishedFullPageBody(embedUrl) {
  return fixSpanishCopy(normalizeInternalLinks(
    readFileSync(embedUrl, "utf8")
      .replace(/^(?:\s*<!--[\s\S]*?-->\s*)+/, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<!doctype[^>]*>/gi, "")
      .replace(/<\/?html[^>]*>/gi, "")
      .replace(/<\/?head[^>]*>/gi, "")
      .replace(/<\/?body[^>]*>/gi, "")
      .replace(/<meta\b[^>]*>/gi, "")
      .replace(/<title>[\s\S]*?<\/title>/gi, "")
      .replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, "")
      .replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<main\b([^>]*)>/i, "<div$1>")
      .replace(/<\/main>/i, "</div>")
      .trim(),
  ));
}

function pendingPage({ slug, title, description, h1, role }) {
  return {
    slug,
    title,
    description,
    noindex: true,
    body: `<section class="page-hero pending">
      <p class="eyebrow">Página preservada</p>
      <h1>${h1}</h1>
      <p>${description}</p>
    </section>
    <section class="section">
      <div class="notice">
        <h2>Contenido pendiente de inventario exacto</h2>
        <p>${role}</p>
      <p>La URL existe en la web publicada y se conserva en la arquitectura. En la extracción de texto visible de la página publicada solo aparece navegación/footer o contenido insuficiente, por lo que no se inventa copy en esta primera implementación.</p>
        <p>Antes de desplegar, esta página debe completarse con el contenido exacto aprobado.</p>
      </div>
    </section>`,
  };
}

function sectionBlock(section) {
  if (section.kind === "form-embed") {
    return `<article class="content-card">
      <h2>${section.title}</h2>
      <p>${section.text}</p>
      <div class="tally-embed">
        <iframe src="${section.src}" width="100%" height="${section.height}" frameborder="0" marginheight="0" marginwidth="0" title="${section.iframeTitle}" loading="lazy"></iframe>
      </div>
      <script src="https://tally.so/widgets/embed.js" async></script>
      ${section.legalNote ?? ""}
    </article>`;
  }

  const text = section.text?.map((p) => `<p>${p}</p>`).join("") ?? "";
  const bullets = section.bullets
    ? `<ul class="check-list">${section.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>`
    : "";
  const cards = section.cards
    ? `<div class="card-grid">${section.cards
        .map(
          (card) => `<article class="mini-card">
            <h3>${card.title}</h3>
            <p class="card-meta">${card.meta}</p>
            <p>${card.text}</p>
          </article>`,
        )
        .join("")}</div>`
    : "";

  return `<article class="content-card">
    <h2>${section.title}</h2>
    ${text}
    ${bullets}
    ${cards}
  </article>`;
}

function formEmbed(type) {
  const isAudit = type === "auditoria";
  return {
    kind: "form-embed",
    title: isAudit ? "Formulario de auditoría" : "Formulario de contacto",
    text: isAudit
      ? "Completa el formulario publicado para solicitar la auditoría web gratuita."
      : "Escríbenos mediante el formulario publicado y te responderemos lo antes posible.",
    src: isAudit ? integrations.tally.auditoria : integrations.tally.contacto,
    iframeTitle: isAudit ? "Formulario Tally de auditoría web gratuita" : "Formulario Tally de contacto",
    height: isAudit ? "800" : "821",
    legalNote: isAudit ? auditLegalNote() : "",
  };
}

function auditLegalNote() {
  return `<aside class="legal-note form-legal-note audit-legal-note" aria-label="Información básica sobre protección de datos">
    <p><strong>Información básica sobre protección de datos</strong> <strong>Responsable del tratamiento:</strong> SOY LEGAL 360 SERVICIOS JURÍDICOS S.L.U.</p>
    <p><strong>Finalidad:</strong> 1) Gestionar tu solicitud de Auditoría Web Gratuita y enviarte el informe correspondiente. 2) Mantener el contacto comercial derivado para presentarte nuestros servicios.</p>
    <p><strong>Legitimación:</strong> Consentimiento del interesado.</p>
    <p><strong>Cesiones y transferencias:</strong> No se cederán datos a terceros salvo obligación legal. Los datos se almacenan en infraestructura de Google Workspace (Google Ireland Limited, UE) y son procesados por Tally B.V. (Países Bajos, UE) como encargado del tratamiento.</p>
    <p><strong>Derechos:</strong> Acceso, rectificación, supresión, oposición, limitación, portabilidad y revocación del consentimiento escribiendo a <a href="mailto:privacidad@soylegal360.es">privacidad@soylegal360.es</a>. Si consideras que el tratamiento no se ajusta a la normativa, puedes reclamar ante la Autoridad de Control (<a href="https://www.aepd.es" target="_blank" rel="noopener">www.aepd.es</a>).</p>
    <p><strong>Información adicional:</strong> Consulta nuestra <a href="/politica-de-privacidad/">Política de Privacidad</a>.</p>
  </aside>`;
}

function processBody() {
  return `<section class="page-hero">
    <p class="eyebrow">Proceso claro</p>
    <h1>Cuatro sencillos pasos para tu protección legal</h1>
    <p>La estructura publicada resume el proceso desde la auditoría hasta el siguiente paso recomendado.</p>
  </section>
  ${processPreview()}
  ${contactBand()}`;
}

function processPreview() {
  const steps = [
    ["1", "Solicita tu Auditoría Web Gratuita", "Sin formularios largos ni compromisos. Solo dinos tu web y en qué sector trabajas."],
    ["2", "Analizamos tu web en 48 horas", "Revisamos textos legales, formularios, cookies y política de privacidad."],
    ["3", "Recibes un informe real", "Te mostramos el estado legal de tu web, los riesgos y lo que necesitas para estar protegido."],
    ["4", "Decidimos juntos el siguiente paso", "Si hay trabajo que hacer, te proponemos el pack que encaja con tu negocio."],
  ];
  return `<section class="section section-soft">
    <div class="section-head">
      <p class="eyebrow">Cómo funciona</p>
      <h2>De la auditoría al plan de acción</h2>
    </div>
    <div class="steps">
      ${steps
        .map(
          ([num, title, text]) => `<article>
            <span>${num}</span>
            <h3>${title}</h3>
            <p>${text}</p>
          </article>`,
        )
        .join("")}
    </div>
    <div class="center-actions"><a class="button primary" href="/auditoria-web-gratuita/">Auditoría web gratuita</a></div>
  </section>`;
}

function faqBody() {
  const faqs = [
    ["¿Qué es el RGPD y me afecta como autónomo?", "El RGPD regula cómo se tratan los datos personales. Te afecta desde el momento en que tienes una web con formulario de contacto, una lista de clientes o usas herramientas de email marketing."],
    ["¿Qué pasa si mi web no cumple?", "Hay riesgos de sanciones económicas, denuncias de usuarios y pérdida de confianza. Adecuar la web cuesta una fracción de lo que puede costar una sanción."],
    ["¿Cuánto tarda la auditoría gratuita?", "El informe se envía en 48 horas hábiles desde que facilitas la URL."],
    ["¿Por qué no usáis plantillas genéricas?", "Porque no recogen tu negocio real: herramientas, datos tratados y forma de compartirlos."],
    ["¿Necesito un Delegado de Protección de Datos?", "Probablemente no, salvo supuestos concretos como tratamientos a gran escala, datos sensibles u observación sistemática."],
    ["¿Qué incluye la Protección Legal Continua?", "Consultas por email, videollamadas anuales, actualización documental, novedades RGPD y seguimiento."],
    ["¿Puedo contratar solo el pack legal sin la web?", "Sí. Los packs legales son independientes y la web en 7 días se reserva para quien también necesita crear la web."],
    ["¿Dáis servicio fuera de Barcelona?", "Sí. Trabajamos online con clientes de toda España, con sede en Sabadell."],
  ];
  return `<section class="page-hero">
    <p class="eyebrow">FAQs</p>
    <h1>Preguntas frecuentes y respuestas</h1>
  </section>
  <section class="section">
    <div class="faq-list">
      ${faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}
    </div>
  </section>
  ${contactBand()}`;
}

function aboutBody() {
  return `<section class="page-hero">
    <p class="eyebrow">Quiénes somos</p>
    <h1>Derecho y tecnología trabajando juntos</h1>
    <p>Democratizamos la protección legal de empresas, pymes, autónomos y profesionales.</p>
    <a class="button primary" href="/auditoria-web-gratuita/">Protégete ahora</a>
  </section>
  <section class="section">
    <div class="content-stack">
      <article class="content-card">
        <h2>Por qué existe SoyLegal360</h2>
        <p>Vimos un problema que se repetía una y otra vez: agencias que crean webs bonitas pero sin cumplimiento legal, despachos que redactan documentos correctos pero sin integración técnica, y miles de empresas y autónomos expuestos sin saberlo.</p>
        <p>SoyLegal360 nace para cerrar esa brecha combinando derecho y tecnología en un servicio a medida.</p>
      </article>
      <article class="content-card">
        <h2>Nuestro compromiso</h2>
        <p>Cada documento que sale de SoyLegal360 está redactado específicamente para proteger tu negocio. No usamos plantillas genéricas ni software automático que genera textos idénticos para todos.</p>
      </article>
    </div>
  </section>`;
}

function contactBody() {
  return `<section class="page-hero">
    <p class="eyebrow">Contacto</p>
    <h1>Estamos aquí para ayudarte con tus dudas legales</h1>
    <p>Servicio online a toda España desde Sabadell, Barcelona.</p>
  </section>
  <section class="section">
    <div class="split">
      <article class="content-card">
        <h2>Datos de contacto</h2>
        <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
        <p><strong>Teléfono:</strong> <a href="${contact.phoneHref}">${contact.phone}</a></p>
        <p><strong>Oficina:</strong> ${contact.addressName}, ${contact.address}</p>
      </article>
      ${sectionBlock(formEmbed("contacto"))}
    </div>
    <aside class="legal-note contact-legal-note" aria-label="Información básica de protección de datos">
      <p><strong>Responsable del tratamiento:</strong> SOY LEGAL 360 SERVICIOS JURÍDICOS S.L.U.</p>
      <p><strong>Finalidad:</strong> Responder a tu consulta y mantener el contacto derivado.</p>
      <p><strong>Legitimación:</strong> Consentimiento del interesado.</p>
      <p><strong>Cesiones y transferencias:</strong> No se cederán datos a terceros salvo obligación legal. Los datos se almacenan en infraestructura de Google Workspace (Google Ireland Limited, UE) y son procesados por Tally B.V. (Países Bajos, UE) como encargado del tratamiento.</p>
      <p><strong>Derechos:</strong> Acceso, rectificación, supresión, oposición, limitación, portabilidad y revocación del consentimiento escribiendo a <a href="mailto:privacidad@soylegal360.es">privacidad@soylegal360.es</a>. Si consideras que el tratamiento no se ajusta a la normativa, puedes reclamar ante la Autoridad de Control (<a href="https://www.aepd.es" target="_blank" rel="noopener">www.aepd.es</a>).</p>
      <p><strong>Información adicional:</strong> Consulta nuestra <a href="/politica-de-privacidad/">Política de Privacidad</a>.</p>
    </aside>
  </section>`;
}

function legalBody(title, paragraphs) {
  return `<section class="page-hero legal-hero">
    <p class="eyebrow">Legal</p>
    <h1>${title}</h1>
  </section>
  <section class="section">
    <article class="legal-content">
      ${paragraphs.map((p) => `<p>${p}</p>`).join("")}
    </article>
  </section>`;
}

function avisoLegalBody() {
  return `<section class="page-hero legal-hero">
    <p class="eyebrow">Legal</p>
    <h1>Aviso Legal</h1>
  </section>
  <section class="section">
    <article class="legal-content">
      <p><strong>Última actualización:</strong> Junio 2026</p>

      <p>El presente Aviso Legal regula el acceso y la utilización del sitio web accesible a través del dominio <a href="https://www.soylegal360.es">https://www.soylegal360.es</a> y de sus subdominios (en adelante, el "Sitio Web"). El simple acceso al Sitio Web atribuye a quien lo realiza la condición de usuario (en adelante, el "Usuario") e implica la aceptación plena y sin reservas del presente Aviso Legal. En caso de no estar de acuerdo con el mismo, el Usuario deberá abandonar inmediatamente el Sitio Web y abstenerse de utilizarlo.</p>

      <p>El usuario, además, se obliga a hacer un uso correcto del sitio web de conformidad con las leyes, la buena fe, el orden público, los usos del tráfico y el presente Aviso Legal, y responderá frente SOY LEGAL 360 o frente a terceros, de cualesquiera daños y perjuicios que pudieran causarse como consecuencia del incumplimiento de dicha obligación.</p>

      <p>Cualquier utilización distinta a la autorizada está expresamente prohibida, pudiendo SOY LEGAL 360 denegar o retirar el acceso y su uso en cualquier momento.</p>

      <h2>1. Información general</h2>
      <p>En cumplimiento del deber de información previsto en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se ofrecen los siguientes datos identificativos del titular del Sitio Web:</p>
      <p><strong>Titular:</strong> SOY LEGAL 360 SERVICIOS JURÍDICOS, S.L. (en adelante, "SOYLEGAL 360").<br>
      <strong>Domicilio social:</strong> Avenida Francesc Macià, nº 60, planta 19, 08208 Sabadell (Barcelona).<br>
      <strong>N.I.F.:</strong> B-88653225<br>
      <strong>Correo electrónico:</strong> <a href="mailto:privacidad@soylegal360.es">privacidad@soylegal360.es</a><br>
      <strong>Teléfono:</strong> <a href="tel:+34645668235">+34 645 668 235</a><br>
      <strong>Datos registrales:</strong> Inscrita en el Registro Mercantil de Barcelona, Hoja B-657252, Folio 1, Inscripción 1ª, Tomo/IRUS 1000474048569.</p>
      <p>Mediante el acceso al Sitio Web, el Usuario manifiesta que ha leído, entiende y acepta el presente Aviso Legal, que es mayor de edad y que, en caso de actuar en nombre de una persona jurídica, cuenta con poder suficiente para obligar a dicha entidad.</p>

      <h2>2. Objeto</h2>
      <p>El Sitio Web tiene por finalidad informar a los Usuarios sobre los servicios profesionales ofrecidos por SOYLEGAL360 en los ámbitos de consultoría jurídica, protección de datos, cumplimiento normativo, ciberseguridad, derecho digital y nuevas tecnologías, así como facilitar el contacto con la entidad y la contratación o solicitud de información sobre los servicios. Las condiciones específicas aplicables a la prestación de los servicios profesionales se regularán en el correspondiente contrato u hoja de encargo suscrito con cada cliente.</p>

      <h2>3. Acceso</h2>
      <p>El acceso y la navegación por el Sitio Web son de carácter gratuito, sin perjuicio del coste de la conexión a Internet a través de la red de telecomunicaciones contratada por el Usuario. Determinadas funcionalidades o áreas del Sitio Web podrán requerir el registro previo del Usuario o la suscripción de un contrato de prestación de servicios con SOYLEGAL360, en cuyo caso resultarán de aplicación las condiciones particulares correspondientes.</p>

      <h2>4. Normas de uso</h2>
      <p>El Usuario se obliga a utilizar el Sitio Web conforme a la legislación vigente, la moral, el orden público, las buenas costumbres y el presente Aviso Legal, absteniéndose de emplearlo para realizar actividades ilícitas o constitutivas de delito, contrarias a los derechos de terceros o que infrinjan el ordenamiento jurídico aplicable.</p>
      <p>En particular, el Usuario se compromete a no introducir o difundir contenidos de carácter racista, xenófobo, pornográfico, de apología del terrorismo o que atenten contra los derechos humanos; a no introducir o propagar virus informáticos, software malicioso o cualquier otro elemento susceptible de causar daños en los sistemas de SOYLEGAL360, sus proveedores o terceros; a no difundir información que vulnere derechos fundamentales y libertades públicas reconocidos constitucionalmente o en los tratados internacionales; a no realizar publicidad ilícita o desleal ni transmitir comunicaciones comerciales no solicitadas; a no difundir información falsa, ambigua o inexacta que pueda inducir a error; a no suplantar a otros Usuarios ni utilizar credenciales ajenas; a no vulnerar derechos de propiedad intelectual e industrial, patentes, marcas o derechos de autor; ni a infringir el secreto de las comunicaciones o la normativa de protección de datos personales.</p>
      <p>El Usuario mantendrá indemne a SOYLEGAL360 frente a cualquier reclamación, sanción, multa o pena que pudiera derivarse del incumplimiento por su parte de las normas de uso anteriores, sin perjuicio del derecho de SOYLEGAL360 a reclamar la indemnización por daños y perjuicios que en su caso corresponda.</p>

      <h2>5. Modificaciones</h2>
      <p>SOYLEGAL360 se reserva el derecho a efectuar, en cualquier momento y sin previo aviso, las modificaciones que considere oportunas en el Sitio Web, pudiendo cambiar, suprimir o añadir contenidos y servicios, así como la forma en que éstos se presenten o localicen.</p>

      <h2>6. Responsabilidad</h2>
      <p>SOYLEGAL360 desarrollará sus mejores esfuerzos para mantener el Sitio Web operativo, actualizado y libre de errores, si bien no garantiza la inexistencia de interrupciones, errores o fallos técnicos. SOYLEGAL360 no será responsable de los fallos técnicos que impidan o dificulten el acceso al Sitio Web, de las interrupciones temporales del servicio por mantenimiento, actualizaciones o mejoras, ni de los daños que el acceso al Sitio Web pudiera causar al dispositivo del Usuario.</p>
      <p>Los contenidos del Sitio Web tienen carácter meramente informativo y divulgativo, y no constituyen asesoramiento jurídico ni profesional de ninguna clase. La aplicación de la normativa o de los criterios expuestos a un caso concreto requiere del análisis individualizado por parte de un profesional cualificado, por lo que SOYLEGAL360 no asume responsabilidad alguna por las decisiones que el Usuario pudiera adoptar basándose exclusivamente en los contenidos publicados en el Sitio Web. La relación profesional con SOYLEGAL360 únicamente nacerá tras la aceptación expresa por escrito del correspondiente encargo profesional.</p>
      <p>SOYLEGAL360 no se responsabiliza de la veracidad, exactitud o actualización de los datos introducidos por el Usuario a través del Sitio Web, siendo éste el único responsable de la información que proporciona y de contar con las bases jurídicas necesarias cuando comunique datos personales de terceros.</p>

      <h2>7. Enlaces</h2>
      <p>El Sitio Web puede contener enlaces a páginas o portales de Internet de terceros (en adelante, "Sitios Enlazados"). SOYLEGAL360 únicamente responderá de los contenidos y servicios suministrados en los Sitios Enlazados en la medida en que tenga conocimiento efectivo de su ilicitud y no haya desactivado el enlace con la diligencia debida. Si el Usuario tuviera conocimiento de la existencia de un Sitio Enlazado con contenido ilícito o inadecuado, podrá comunicarlo a SOY LEGAL 360 mediante correo electrónico a <a href="mailto:privacidad@soylegal360.es">privacidad@soylegal360.es</a>.</p>
      <p>La existencia de Sitios Enlazados no presupone la formalización de acuerdos entre SOY LEGAL 360 y los responsables o titulares de los mismos, ni recomendación o promoción de dichos sitios o de sus contenidos.</p>

      <h2>8. Propiedad intelectual e industrial</h2>
      <p>Todos los contenidos del Sitio Web y de la Plataforma, entendiendo por éstos, a título meramente enunciativo pero no exhaustivo, los textos, fotografías, gráficos, imágenes, iconos, tecnología, software, links y demás contenidos audiovisuales o sonoros, así como su diseño gráfico y códigos fuente, son propiedad intelectual de SOYLEGAL360 o de terceros licenciadores, sin que puedan entenderse cedidos al Usuario ninguno de los derechos de explotación reconocidos por la normativa vigente en materia de propiedad intelectual sobre los mismos.</p>
      <p>Las marcas, nombres comerciales, logotipos y demás signos distintivos publicados en el Sitio Web son titularidad de SOYLEGAL360 o de terceros cedentes o licenciantes, sin que el acceso al Sitio Web atribuya al Usuario derecho alguno sobre los mismos. "SOYLEGAL360" es signo distintivo de SOY LEGAL 360 SERVICIOS JURÍDICOS, S.L.</p>
      <p>Queda expresamente prohibida la reproducción, distribución, comunicación pública, puesta a disposición, transformación o cualquier otra forma de explotación, total o parcial, de los contenidos del Sitio Web sin la autorización previa, expresa y por escrito de SOYLEGAL360 o del titular de los derechos correspondientes. Cualquier uso no autorizado podrá ser perseguido conforme a la legislación aplicable.</p>

      <h2>9. Protección de datos</h2>
      <p>El tratamiento de los datos personales de los Usuarios se realiza conforme a lo establecido en la <a href="/politica-de-privacidad/">Política de Privacidad</a> de SOYLEGAL360, en cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016 (RGPD), y de la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).</p>

      <h2>10. Cookies</h2>
      <p>El Sitio Web utiliza cookies y tecnologías similares conforme a lo previsto en el artículo 22.2 de la LSSI-CE y en la Guía sobre el uso de las cookies de la Agencia Española de Protección de Datos. Para más información, el Usuario puede consultar la <a href="/politica-de-cookies/">Política de Cookies</a> de SOY LEGAL 360.</p>

      <h2>11. Legislación y jurisdicción aplicable</h2>
      <p>El presente Aviso Legal se rige por la legislación española. Para la resolución de cualquier controversia derivada del acceso o uso del Sitio Web, las partes se someten expresamente a los Juzgados y Tribunales de Sabadell (Barcelona), con renuncia a cualquier otro fuero que pudiera corresponderles, sin perjuicio de los fueros legalmente imperativos aplicables a consumidores y usuarios conforme al Real Decreto Legislativo 1/2007, de 16 de noviembre, por el que se aprueba el texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios.</p>
    </article>
  </section>`;
}

function privacyPolicyBody() {
  return `<section class="page-hero legal-hero">
    <p class="eyebrow">Legal</p>
    <h1>Política de Privacidad</h1>
  </section>
  <section class="section">
    <article class="legal-content">
      <p><strong>Última actualización:</strong> Junio 2026</p>

      <h2>1. Responsable y encargado del tratamiento</h2>
      <p>SOYLEGAL360 SERVICIOS JURÍDICOS, S.L. (en adelante, "SOYLEGAL360"), con domicilio social en Avenida Francesc Macià, nº 60, planta 19, 08208 Sabadell (Barcelona), N.I.F. B88653225, correo electrónico <a href="mailto:privacidad@soylegal360.es">privacidad@soylegal360.es</a> y teléfono <a href="tel:+34645668235">+34 645 668 235</a>, es el Responsable del Tratamiento de los datos personales recabados a través del sitio web <a href="https://www.soylegal360.es">https://www.soylegal360.es</a> y de los facilitados por clientes, potenciales clientes, proveedores y demás personas que se relacionen con la entidad en el marco de su actividad de consultoría jurídica, tecnológica y de cumplimiento normativo.</p>

      <h2>2. Finalidades del tratamiento</h2>
      <p>Los datos personales del Usuario se tratarán para las siguientes finalidades:</p>
      <p><strong>Gestión de clientes y prestación de servicios profesionales.</strong> Se tratan los datos identificativos y de contacto del cliente o de las personas de contacto designadas por éste (nombre y apellidos, cargo, dirección postal, correo electrónico, teléfono), datos de facturación (denominación social, NIF, domicilio fiscal, datos bancarios) y la información que el cliente facilite en el marco del encargo profesional, con la finalidad de prestar los servicios de asesoramiento, consultoría, auditoría, formación, desarrollo tecnológico y demás incluidos en el objeto social de la compañía. La base jurídica es la ejecución del contrato de prestación de servicios o la aplicación de medidas precontractuales (art. 6.1.b RGPD), así como el cumplimiento de las obligaciones legales aplicables a SOYLEGAL360 (art. 6.1.c RGPD), entre otras, las derivadas de la normativa fiscal, mercantil y de prevención del blanqueo de capitales. Los datos se conservarán durante la vigencia de la relación contractual y, tras su finalización, durante los plazos de prescripción de responsabilidades legales.</p>
      <p><strong>Atención de consultas y solicitudes de información.</strong> Se tratan los datos facilitados a través de los formularios de contacto del sitio web, correo electrónico o teléfono (nombre, correo electrónico, teléfono y contenido de la consulta), con la finalidad de atender la solicitud realizada y, en su caso, remitir presupuesto o información sobre los servicios. La base jurídica es el consentimiento del interesado al remitir la consulta (art. 6.1.a RGPD) o la aplicación de medidas precontractuales (art. 6.1.b RGPD). Los datos se conservarán durante el tiempo necesario para atender la consulta y, posteriormente, durante los plazos de prescripción aplicables.</p>
      <p><strong>Gestión de proveedores y colaboradores profesionales.</strong> Se tratan los datos identificativos, de contacto y de facturación de proveedores, colaboradores y profesionales externos, con la finalidad de gestionar la relación contractual. La base jurídica es la ejecución del contrato (art. 6.1.b RGPD) y el cumplimiento de obligaciones legales (art. 6.1.c RGPD). Los datos se conservarán durante la vigencia de la relación y los plazos de prescripción legalmente previstos.</p>
      <p><strong>Envío de comunicaciones comerciales y newsletter.</strong> Cuando el Usuario lo consienta expresamente, o cuando exista una relación contractual previa respecto de productos o servicios similares conforme al artículo 21.2 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI), se utilizará su dirección de correo electrónico para enviar información sobre los servicios de SOYLEGAL360, novedades normativas, alertas legales, webinars, eventos formativos y publicaciones del sector. La base jurídica es el consentimiento del interesado (art. 6.1.a RGPD) o el interés legítimo en la fidelización de clientes (art. 6.1.f RGPD), debidamente ponderado. El Usuario podrá retirar el consentimiento u oponerse en cualquier momento mediante el enlace de baja incluido en cada comunicación o escribiendo a <a href="mailto:privacidad@soylegal360.es">privacidad@soylegal360.es</a>. Los datos se conservarán hasta la retirada del consentimiento o la oposición y, posteriormente, durante los plazos de prescripción aplicables.</p>
      <p><strong>Cumplimiento de obligaciones legales.</strong> SOYLEGAL360 trata los datos personales necesarios para el cumplimiento de las obligaciones legales que le resulten aplicables. La base jurídica es el cumplimiento de obligaciones legales (art. 6.1.c RGPD).</p>
      <p><strong>Gestión del sitio web, cookies y análisis estadístico.</strong> Se tratan los datos de navegación y los obtenidos mediante cookies y tecnologías similares, en los términos descritos en la <a href="/politica-de-cookies/">Política de Cookies</a>. La base jurídica es el consentimiento del Usuario (art. 6.1.a RGPD), salvo en el caso de las cookies técnicas estrictamente necesarias, conforme al artículo 22.2 LSSI y a la Guía sobre el uso de cookies de la Agencia Española de Protección de Datos.</p>
      <p><strong>Mejora de los servicios y análisis interno.</strong> SOYLEGAL360 podrá tratar datos agregados o anonimizados sobre el uso del sitio web y de los servicios contratados, con el fin de mejorar la calidad y eficiencia de su actividad, sobre la base del interés legítimo (art. 6.1.f RGPD).</p>

      <h2>3. Deber de confidencialidad y secreto profesional</h2>
      <p>SOYLEGAL360, así como su personal y colaboradores, están sujetos al deber de confidencialidad respecto de los datos personales tratados, conforme al artículo 5.1.f RGPD y al artículo 5 LOPDGDD. Dicho deber subsiste con carácter indefinido tras la finalización de la relación con el interesado.</p>

      <h2>4. Destinatarios</h2>
      <p>SOYLEGAL360 no cede ni vende datos personales a terceros con fines comerciales. Los datos podrán comunicarse a Administraciones Públicas, Juzgados y Tribunales, Fuerzas y Cuerpos de Seguridad y demás organismos competentes cuando exista obligación legal o sean requeridos en el marco de un procedimiento administrativo o judicial. Asimismo, los datos podrán comunicarse a entidades financieras para la gestión de cobros y pagos, y a la Agencia Estatal de Administración Tributaria y demás administraciones competentes para el cumplimiento de obligaciones fiscales.</p>
      <p>Para la prestación de determinados servicios, SOYLEGAL360 se apoya en proveedores que actúan como encargados del tratamiento (servicios de alojamiento web, herramientas de gestión documental y CRM, servicios de correo electrónico, plataformas de firma electrónica, herramientas de marketing y, en su caso, proveedores tecnológicos para servicios de cumplimiento normativo). Todos los encargados han suscrito el correspondiente contrato conforme al artículo 28 RGPD que garantiza la confidencialidad y seguridad de los datos.</p>
      <p>Algunos encargados pueden estar ubicados fuera del Espacio Económico Europeo, en cuyo caso SOYLEGAL360 habrá adoptado las garantías adecuadas previstas en los artículos 44 y siguientes del RGPD, tales como decisiones de adecuación de la Comisión Europea o cláusulas contractuales tipo aprobadas por ésta.</p>

      <h2>5. Derechos</h2>
      <p>Los interesados pueden ejercer sus derechos de acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición, así como retirar en cualquier momento el consentimiento prestado, sin que ello afecte a la licitud del tratamiento previo a su retirada, mediante solicitud escrita dirigida a SOYLEGAL360 SERVICIOS JURÍDICOS, S.L., Avenida Francesc Macià, nº 60, planta 19, 08208 Sabadell (Barcelona), o a la dirección de correo electrónico <a href="mailto:privacidad@soylegal360.es">privacidad@soylegal360.es</a>.</p>
      <p>En todo caso, los interesados tienen derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener">www.aepd.es</a>) si lo estiman oportuno.</p>

      <h2>6. Medidas de seguridad</h2>
      <p>SOYLEGAL360 ha implantado las medidas técnicas y organizativas apropiadas para garantizar un nivel de seguridad adecuado al riesgo del tratamiento, conforme al artículo 32 RGPD, considerando el estado de la técnica, los costes de aplicación y la naturaleza, alcance, contexto y fines del tratamiento, así como los riesgos para los derechos y libertades de los interesados.</p>

      <h2>7. Menores de edad</h2>
      <p>Los servicios de SOYLEGAL360 están dirigidos exclusivamente a personas mayores de edad y, principalmente, a clientes profesionales y empresariales. SOYLEGAL360 no trata conscientemente datos de menores de 14 años; en caso de detectarse, se procederá a su eliminación inmediata, conforme al artículo 7 LOPDGDD.</p>

      <h2>8. Veracidad de los datos</h2>
      <p>El Usuario garantiza la veracidad y exactitud de los datos facilitados, comprometiéndose a comunicar cualquier modificación. SOYLEGAL360 no será responsable de la inexactitud de los datos cuando ésta sea imputable al interesado o a un tercero que los haya facilitado.</p>

      <h2>9. Actualizaciones de la política de privacidad</h2>
      <p>SOYLEGAL360 se reserva el derecho de modificar la presente política para adaptarla a novedades legislativas, jurisprudenciales o de criterios de la Agencia Española de Protección de Datos. Los cambios sustanciales se anunciarán en esta página con antelación razonable a su entrada en vigor.</p>
    </article>
  </section>`;
}

function cookiePolicyBody() {
  return `<section class="page-hero legal-hero">
    <p class="eyebrow">Legal</p>
    <h1>Política de Cookies</h1>
  </section>
  <section class="section">
    <article class="legal-content">
      <p><strong>Sitio web:</strong> <a href="https://www.soylegal360.es">https://www.soylegal360.es</a></p>
      <p><strong>Última actualización:</strong> Mayo de 2026</p>
      <p>Esta Política de Cookies explica qué son las cookies, qué tipos de cookies utiliza el sitio web <a href="https://www.soylegal360.es">https://www.soylegal360.es</a> (en adelante, el "Sitio Web") y cómo puede el Usuario configurarlas o deshabilitarlas.</p>
      <p><strong>Titular del Sitio Web:</strong> SOY LEGAL 360 SERVICIOS JURIDICOS, S.L. (en adelante, "SOY LEGAL 360"), con domicilio social en Avenida Francesc Macià, nº 60, planta 19, 08208 Sabadell (Barcelona), N.I.F. B-88653225 y correo electrónico <a href="mailto:privacidad@soylegal360.es">privacidad@soylegal360.es</a>.</p>

      <h2>1. ¿Qué son las cookies?</h2>
      <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en el dispositivo del usuario (ordenador, tablet, smartphone) cuando éste navega por Internet. Las cookies permiten, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación del usuario o de su equipo y, dependiendo de la información que contengan y de la forma en que utilice su equipo, pueden utilizarse para reconocer al usuario. La normativa aplicable equipara a las cookies otras tecnologías análogas de almacenamiento y recuperación de información en los equipos de los Usuarios (por ejemplo, píxeles, local storage, fingerprinting o identificadores de dispositivo), a las que también resulta de aplicación la presente Política.</p>

      <h2>2. Tipos de cookies</h2>
      <p>Según la entidad que las gestione, pueden ser cookies propias (enviadas desde un equipo gestionado por SOY LEGAL 360) o cookies de terceros (enviadas desde un equipo o dominio que no es gestionado por SOY LEGAL 360, sino por otra entidad que trata los datos obtenidos a través de las cookies).</p>
      <p>Según el plazo de tiempo que permanecen activas en el equipo terminal, pueden ser cookies de sesión (recaban y almacenan datos mientras el Usuario accede al Sitio Web y se eliminan al finalizar la sesión) o cookies persistentes (los datos siguen almacenados durante el plazo definido por el responsable).</p>
      <p>Según la finalidad para la que se traten los datos obtenidos:</p>
      <p><strong>Cookies técnicas y funcionales:</strong> permiten al Usuario la navegación a través del Sitio Web y la utilización de las distintas opciones o funcionalidades existentes, estando exceptuadas de la obligación de obtener consentimiento conforme al artículo 22.2 LSSI-CE.</p>
      <p><strong>Cookies de preferencias o personalización:</strong> permiten recordar información para que el Usuario acceda al servicio con determinadas características que pueden diferenciar su experiencia (idioma, número de resultados a mostrar, aspecto del contenido, etc.).</p>
      <p><strong>Cookies de análisis o medición:</strong> permiten cuantificar el número de Usuarios y realizar análisis estadístico de la utilización que hacen del Sitio Web, con la finalidad de introducir mejoras.</p>
      <p><strong>Cookies de publicidad comportamental:</strong> almacenan información del comportamiento del Usuario para mostrar publicidad personalizada.</p>

      <h2>3. Cookies utilizadas</h2>
      <p>El Sitio Web utiliza actualmente las siguientes cookies:</p>
      <div>
        <table>
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Titular</th>
              <th>Tipo</th>
              <th>Finalidad</th>
              <th>Duración</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>__cf_bm</td>
              <td>zyrosite.com (Cloudflare)</td>
              <td>Tercero - Técnica</td>
              <td>Distinguir entre tráfico humano y bots para proteger el Sitio Web frente a accesos automatizados maliciosos.</td>
              <td>29 minutos</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Este listado será actualizado periódicamente. SOY LEGAL 360 desplegará sus mejores esfuerzos por mantener esta información debidamente actualizada, si bien las cookies utilizadas en el Sitio Web pueden variar en función de las funcionalidades implementadas en cada momento.</p>
      <p><strong>Servicio de analítica web.</strong> Actualmente, el Sitio Web no utiliza cookies de analítica web ni servicios de medición estadística de terceros. En caso de que en el futuro se incorporen, esta Política de Cookies se actualizará para reflejarlo y, cuando proceda, se recabará el consentimiento previo del Usuario a través del panel de configuración de cookies.</p>
      <p><strong>Servicios de publicidad y redes sociales.</strong> Actualmente, el Sitio Web no utiliza cookies de publicidad comportamental ni cookies de redes sociales de terceros. En caso de que en el futuro se incorporen, esta Política de Cookies se actualizará para reflejarlo y se recabará el consentimiento previo del Usuario a través del panel de configuración de cookies.</p>
      <p><strong>Transferencias internacionales de datos.</strong> La cookie __cf_bm es instalada por Cloudflare, Inc. a través del proveedor de alojamiento web (Zyro/Zyrosite), lo que puede implicar la transferencia de datos a Estados Unidos. Dicha transferencia se realiza al amparo de las garantías adecuadas previstas en los artículos 44 y siguientes del RGPD, en particular el Marco UE-EE.UU. de Privacidad de Datos (EU-U.S. Data Privacy Framework) y, en su caso, Cláusulas Contractuales Tipo aprobadas por la Comisión Europea. Puede obtenerse información adicional en la política de privacidad de Cloudflare: <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">https://www.cloudflare.com/privacypolicy/</a>.</p>

      <h2>4. Base legal</h2>
      <p>La base legal para el uso de cookies técnicas estrictamente necesarias es el interés legítimo de SOY LEGAL 360 en prestar el servicio solicitado por el Usuario, estando exceptuadas del consentimiento conforme al artículo 22.2 de la Ley de Servicios de la Sociedad de la Información. Para las cookies de preferencias, análisis y publicidad, la base legal es el consentimiento del Usuario, solicitado mediante el panel de configuración de cookies que aparece al acceder al Sitio Web.</p>

      <h2>5. Consentimiento</h2>
      <p>Al acceder por primera vez al Sitio Web, el Usuario visualizará un panel informativo sobre el uso de cookies (primera capa) en el que podrá: aceptar todas las cookies; rechazar las cookies opcionales, instalándose únicamente las técnicas estrictamente necesarias; o configurar las cookies seleccionando qué categorías desea activar o desactivar. Hasta que el Usuario manifieste su elección, no se instalarán cookies que no sean estrictamente necesarias.</p>
      <p>Conforme al artículo 7.3 RGPD, el Usuario puede modificar sus preferencias o retirar su consentimiento en cualquier momento, con la misma facilidad con la que lo otorgó, accediendo al panel de configuración de cookies disponible en el pie de página del Sitio Web (enlace "Configuración de Cookies" o equivalente). La retirada del consentimiento no afectará a la licitud del tratamiento basado en el consentimiento previo a su retirada.</p>

      <h2>6. Gestión de cookies</h2>
      <p>El Usuario puede gestionar las cookies a través del panel de configuración disponible en el Sitio Web, accesible desde el enlace "Configuración de Cookies" en el pie de página. Adicionalmente, el Usuario puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador. Los principales navegadores ofrecen información sobre gestión de cookies en:</p>
      <ul>
        <li>Chrome: <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">https://support.google.com/chrome/answer/95647</a></li>
        <li>Firefox: <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener">https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias</a></li>
        <li>Safari: <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener">https://support.apple.com/es-es/guide/safari/sfri11471/mac</a></li>
        <li>Microsoft Edge: <a href="https://support.microsoft.com/es-es/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener">https://support.microsoft.com/es-es/help/17442/windows-internet-explorer-delete-manage-cookies</a></li>
      </ul>

      <h2>7. Consecuencias de deshabilitar cookies</h2>
      <p>La desactivación de cookies no impide la navegación por el Sitio Web, si bien algunos servicios y funcionalidades pueden no funcionar correctamente o su experiencia de navegación puede verse limitada. En concreto, la desactivación de cookies técnicas puede impedir mantener la sesión de usuario iniciada, recordar las preferencias de navegación o acceder a áreas restringidas.</p>

      <h2>8. Actualizaciones</h2>
      <p>SOY LEGAL 360 puede modificar esta Política de Cookies en función de exigencias legislativas, reglamentarias o con la finalidad de adaptar dicha política a las instrucciones dictadas por la Agencia Española de Protección de Datos. Cuando se produzcan cambios significativos, se comunicará a los usuarios mediante aviso informativo en el Sitio Web o, cuando sea posible, por correo electrónico a los usuarios registrados.</p>

      <h2>9. Más información</h2>
      <p>Para cualquier duda o consulta sobre esta Política de Cookies, puede contactar con SOY LEGAL 360 en <a href="mailto:privacidad@soylegal360.es">privacidad@soylegal360.es</a>, en la dirección Avenida Francesc Macià, nº 60, planta 19, 08208 Sabadell (Barcelona) o llamando al teléfono <a href="tel:+34645668235">645 668 235</a>. También puede consultar la información sobre protección de datos en la Agencia Española de Protección de Datos: <a href="https://www.aepd.es" target="_blank" rel="noopener">https://www.aepd.es</a>.</p>
    </article>
  </section>`;
}

function contactBand() {
  return `<section class="contact-band">
    <div>
      <p class="eyebrow">Contacto</p>
      <h2>Nos encontraras en ${contact.addressName}</h2>
      <p>${contact.address}</p>
      <p><a href="mailto:${contact.email}">${contact.email}</a> · <a href="${contact.phoneHref}">${contact.phone}</a></p>
    </div>
    <a class="button primary" href="/contacto/">Hablar con SoyLegal360</a>
  </section>`;
}

function featureCard(title, text) {
  return `<article class="feature-card"><h3>${title}</h3><p>${text}</p></article>`;
}

function styles() {
  return `:root {
  --navy: #06152c;
  --navy-2: #0d2447;
  --copper: #c27b32;
  --gold: #c9a96e;
  --ink: #17213a;
  --muted: #5d6980;
  --line: #dfe4ee;
  --soft: #f5f7fb;
  --paper: #ffffff;
  --shadow: 0 20px 60px rgba(6, 21, 44, .12);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  color: var(--ink);
  background: var(--paper);
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.55;
}
a { color: inherit; }
.sr-only, .skip-link {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
.skip-link:focus {
  z-index: 100;
  width: auto;
  height: auto;
  clip: auto;
  top: 12px;
  left: 12px;
  padding: 10px 14px;
  color: #fff;
  background: var(--navy);
}
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(6, 21, 44, .1);
  background: rgba(255, 255, 255, .96);
  backdrop-filter: blur(12px);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1180px, calc(100% - 32px));
  min-height: 82px;
  margin: 0 auto;
  gap: 22px;
}
.brand img {
  display: block;
  width: 158px;
  height: auto;
  background: transparent;
}
.site-nav { display: flex; align-items: center; gap: 18px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 700; }
.site-nav a, .site-nav summary { text-decoration: none; cursor: pointer; }
.nav-cta, .button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 12px 18px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: .04em;
  text-decoration: none;
  text-transform: uppercase;
}
.nav-cta, .button.primary { color: #fff; background: var(--navy); }
.button.secondary { color: var(--navy); border-color: var(--line); background: #fff; }
.button.gold {
  color: #06152c;
  border-color: rgba(255, 255, 255, .42);
  background: linear-gradient(180deg, #ddc287, #c9a96e);
}
.services-menu { position: relative; }
.mega-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 14px);
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 16px;
  width: min(900px, calc(100vw - 32px));
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  box-shadow: var(--shadow);
}
.services-menu:not([open]) .mega-menu { display: none; }
.mega-menu h3 {
  margin: 0 0 10px;
  color: var(--copper);
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.mega-menu a { display: block; margin: 8px 0; font-weight: 600; }
.nav-toggle { display: none; border: 0; background: transparent; }
.nav-toggle span:not(.sr-only) { display: block; width: 24px; height: 2px; margin: 5px 0; background: var(--navy); }
.hero, .page-hero {
  padding: 96px max(22px, calc((100vw - 1180px) / 2)) 82px;
  color: #fff;
  background:
    linear-gradient(135deg, rgba(6, 21, 44, .98), rgba(13, 36, 71, .94)),
    repeating-linear-gradient(90deg, rgba(201, 169, 110, .12) 0 1px, transparent 1px 92px);
}
.hero-home {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 390px);
  gap: 46px;
  align-items: center;
}
.published-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: min(760px, calc(100vh - 82px));
  padding-top: 92px;
  padding-bottom: 74px;
  text-align: center;
  background:
    linear-gradient(90deg, rgba(14, 18, 24, .83), rgba(14, 18, 24, .78)),
    url("https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,fit=crop/MZS9d1BboyNoZQUA/despacho-torre-OMiiUJyLsyVSwit8.png") center / cover no-repeat;
}
.published-hero .hero-copy {
  position: relative;
  z-index: 1;
  max-width: 1060px;
  margin: 0 auto;
}
.published-hero .eyebrow {
  width: fit-content;
  max-width: 100%;
  margin: 0 auto 78px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 17px;
  line-height: 1.65;
  letter-spacing: .08em;
  text-align: center;
}
.published-hero .eyebrow span { display: inline-block; }
.published-hero h1 {
  max-width: none;
  margin: 0 auto;
  font-size: clamp(38px, 4.1vw, 58px);
  line-height: 1.18;
  font-weight: 600;
}
.hero-highlight {
  color: var(--gold);
  font-style: italic;
}
.hero-facts {
  display: grid;
  gap: 12px;
  margin-top: 64px;
}
.published-hero .hero-facts p {
  max-width: none;
  margin: 0 auto;
  color: #fff;
  font-size: clamp(24px, 2.55vw, 36px);
  line-height: 1.24;
}
.published-hero .hero-facts strong {
  color: var(--gold);
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 800;
}
.published-hero .lead {
  max-width: 950px;
  margin: 80px auto 0;
  color: #fff;
  font-size: clamp(19px, 2vw, 26px);
  line-height: 1.34;
}
.page-hero { min-height: 360px; }
.page-hero p, .hero p { max-width: 760px; }
.eyebrow {
  margin: 0 0 14px;
  color: var(--gold);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .16em;
  text-transform: uppercase;
}
h1, h2, h3 { margin: 0; line-height: 1.08; letter-spacing: 0; }
h1 { max-width: 900px; font-size: clamp(42px, 6vw, 74px); }
h2 { font-size: clamp(30px, 4vw, 48px); }
h3 { font-size: 22px; }
.lead { margin-top: 24px; color: #e5edf7; font-size: clamp(18px, 2vw, 23px); }
.actions, .center-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 32px; }
.center-actions { justify-content: center; }
.hero-panel {
  border: 1px solid rgba(255, 255, 255, .18);
  border-radius: 8px;
  padding: 26px;
  background: rgba(255, 255, 255, .08);
  box-shadow: 0 26px 70px rgba(0, 0, 0, .24);
}
.hero-panel span { color: var(--gold); font: 800 12px/1 Arial, Helvetica, sans-serif; letter-spacing: .12em; text-transform: uppercase; }
.hero-panel strong { display: block; margin-top: 18px; font-size: 42px; line-height: 1; }
.hero-panel p { margin: 8px 0 0; color: #dce6f3; }
.source-link {
  display: inline-block;
  margin-top: 18px;
  color: var(--gold);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 800;
  text-underline-offset: 4px;
}
.section { padding: 76px max(22px, calc((100vw - 1180px) / 2)); }
.section[id], .published-embed-section[id] { scroll-margin-top: 104px; }
.published-embed-section { display: block; }
.section-soft { background: var(--soft); }
.section-head { max-width: 840px; margin-bottom: 34px; }
.section-head p { color: var(--muted); font-size: 18px; }
.source-note {
  margin-top: 14px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px !important;
}
.source-note a { color: var(--navy); text-underline-offset: 4px; }
.home-guide {
  position: relative;
  overflow: hidden;
  padding: 20px 18px 22px;
  color: var(--ink);
  border-top: 1px solid rgba(201, 169, 110, .28);
  border-bottom: 1px solid rgba(23, 54, 97, .12);
  background:
    linear-gradient(90deg, rgba(255, 255, 255, .82), rgba(234, 243, 251, .96)),
    repeating-linear-gradient(90deg, rgba(23, 54, 97, .05) 0 1px, transparent 1px 102px);
}
.home-guide::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(201, 169, 110, .14), transparent);
}
.home-guide-wrap {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(190px, .78fr) minmax(0, 2.35fr);
  gap: 16px;
  align-items: center;
  width: min(1180px, 100%);
  margin: 0 auto;
}
.home-guide-intro { padding: 8px 6px 8px 0; }
.home-guide .eyebrow {
  margin: 0;
  color: var(--navy-2);
  font-size: 11px;
  letter-spacing: .2em;
}
.home-guide h2 {
  margin-top: 9px;
  color: var(--navy);
  font-size: clamp(22px, 2.15vw, 30px);
}
.home-guide h2 span { color: var(--gold); }
.home-guide-routes {
  display: grid;
  grid-template-columns: minmax(290px, 1.36fr) repeat(3, minmax(0, .72fr));
  gap: 10px;
  align-items: stretch;
}
.home-guide-route {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 122px;
  border: 1px solid rgba(23, 54, 97, .18);
  border-radius: 8px;
  padding: 16px;
  color: var(--ink);
  background: rgba(255, 255, 255, .78);
  box-shadow: 0 16px 40px rgba(12, 39, 78, .08);
  text-decoration: none;
  transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
}
.home-guide-route:hover {
  transform: translateY(-3px);
  border-color: rgba(201, 169, 110, .72);
  box-shadow: 0 22px 48px rgba(12, 39, 78, .13);
}
.route-calc {
  position: relative;
  overflow: hidden;
  color: #fff;
  border-color: rgba(201, 169, 110, .48);
  background:
    linear-gradient(135deg, rgba(6, 20, 46, .98), rgba(17, 45, 85, .96)),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, .05) 0 1px, transparent 1px 72px);
}
.route-calc::after {
  content: "";
  position: absolute;
  top: -46px;
  right: -34px;
  width: 152px;
  height: 152px;
  border: 1px solid rgba(201, 169, 110, .34);
  border-radius: 50%;
}
.route-top {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.route-kicker {
  color: var(--navy-2);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .15em;
  line-height: 1.3;
  text-transform: uppercase;
}
.route-calc .route-kicker { color: #d8be83; }
.route-icon {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(23, 54, 97, .16);
  border-radius: 8px;
  color: var(--navy);
  background: rgba(234, 243, 251, .8);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 17px;
  font-weight: 800;
}
.route-calc .route-icon {
  color: #d8be83;
  border-color: rgba(201, 169, 110, .38);
  background: rgba(255, 255, 255, .08);
}
.home-guide-route b {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 11px;
  color: var(--navy);
  font-size: 18px;
  line-height: 1.18;
}
.route-calc b {
  color: #fff;
  font-size: 23px;
}
.home-guide-route p {
  position: relative;
  z-index: 1;
  margin: 6px 0 0;
  color: var(--muted);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  line-height: 1.42;
}
.route-calc p {
  max-width: 340px;
  color: #d6e2f3;
  font-size: 13px;
}
.route-go {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 11px;
  color: var(--navy-2);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.route-go::after {
  content: "";
  width: 14px;
  height: 1px;
  background: currentColor;
  transition: width .2s ease;
}
.home-guide-route:hover .route-go::after { width: 22px; }
.route-calc .route-go { color: #d8be83; }
.risk-section { background: #fff; }
.risk-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}
.mini-stat {
  border-left: 4px solid var(--copper);
  padding: 20px;
  background: var(--soft);
}
.mini-stat strong {
  display: block;
  color: var(--navy);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  letter-spacing: .08em;
}
.mini-stat p { margin: 8px 0 0; color: var(--muted); }
.card-grid, .family-grid, .steps, .split {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.card-grid.four { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.family-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.entry-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}
.feature-card, .family-card, .entry-card, .directory-group, .directory-link, .content-card, .mini-card, .steps article, .notice, .legal-content {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 16px 42px rgba(6, 21, 44, .06);
}
.feature-card, .family-card, .entry-card, .directory-group, .content-card, .mini-card, .steps article, .notice { padding: 24px; }
.entry-card {
  display: flex;
  flex-direction: column;
  min-height: 270px;
}
.entry-card.compact { min-height: 220px; }
.entry-card h3 { color: var(--navy); }
.entry-card p { color: var(--muted); }
.entry-card a {
  margin-top: auto;
  color: var(--navy);
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 900;
  text-decoration-color: rgba(194, 123, 50, .35);
  text-underline-offset: 4px;
}
.family-card a {
  display: block;
  margin-top: 12px;
  color: var(--navy);
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 800;
  text-decoration-color: rgba(194, 123, 50, .35);
  text-underline-offset: 4px;
}
.family-card h3, .family-card h2 { color: var(--navy); }
.family-card p { color: var(--muted); }
.service-directory {
  display: grid;
  gap: 22px;
}
.directory-group {
  display: grid;
  grid-template-columns: minmax(220px, .8fr) minmax(0, 1.7fr);
  gap: 24px;
}
.directory-group header p { color: var(--muted); }
.directory-links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.directory-link {
  display: block;
  padding: 18px;
  text-decoration: none;
}
.directory-link span {
  display: block;
  color: var(--navy);
  font-weight: 900;
}
.directory-link small {
  display: block;
  margin-top: 8px;
  color: var(--muted);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.45;
}
.content-stack { display: grid; gap: 22px; max-width: 980px; }
.content-card p, .mini-card p, .feature-card p, .notice p { color: var(--muted); }
.check-list { display: grid; gap: 10px; margin: 18px 0 0; padding: 0; list-style: none; }
.check-list li { position: relative; padding-left: 28px; }
.check-list li::before { position: absolute; left: 0; color: var(--copper); font-weight: 900; content: "✓"; }
.card-meta { color: var(--copper) !important; font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: 900; text-transform: uppercase; }
.steps article span {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin-bottom: 16px;
  border-radius: 999px;
  color: #fff;
  background: var(--navy);
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 900;
}
.faq-list { display: grid; gap: 12px; max-width: 940px; }
.faq-list details {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 18px 20px;
  background: #fff;
}
.faq-list summary { cursor: pointer; color: var(--navy); font-weight: 800; }
.tally-embed {
  margin-top: 18px;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}
.tally-embed iframe {
  display: block;
  width: 100%;
  border: 0;
}
.section-calculator {
  padding-top: 64px;
  padding-bottom: 72px;
  background: #fff;
}
.section-calculator .sl360-risk {
  max-width: 1060px;
  padding-right: 0;
  padding-left: 0;
}
.legal-note {
  max-width: 980px;
  margin-top: 22px;
  color: var(--muted);
  font-size: 14px;
}
.contact-legal-note {
  max-width: none;
  margin-top: 18px;
  border: 1px solid rgba(201, 169, 110, .52);
  border-radius: 6px;
  padding: 16px 18px;
  color: #17213a;
  background: rgba(255, 255, 255, .96);
  box-shadow: 0 14px 32px rgba(6, 21, 44, .08);
  font-size: 13px;
  line-height: 1.42;
}
.contact-legal-note p {
  margin: 0;
}
.contact-legal-note p + p {
  margin-top: 3px;
}
.contact-legal-note strong {
  color: #06152c;
}
.contact-legal-note a {
  color: #06152c;
  font-weight: 700;
  text-underline-offset: 2px;
}
.form-legal-note {
  max-width: none;
  margin-top: 14px;
  border: 1px solid rgba(201, 169, 110, .64);
  border-radius: 8px;
  padding: 13px 15px;
  color: #17213a;
  background: #fbf7ee;
  box-shadow: none;
  font-size: 12px;
  line-height: 1.38;
}
.form-legal-note p {
  margin: 0;
}
.form-legal-note p + p {
  margin-top: 8px;
}
.form-legal-note strong {
  color: #06152c;
}
.form-legal-note a {
  color: #06152c;
  font-weight: 700;
  text-underline-offset: 2px;
}
.legal-content {
  max-width: 980px;
  padding: 34px;
}
.legal-content h2 {
  margin: 34px 0 12px;
  color: var(--navy);
  font-size: 22px;
}
.legal-content ul {
  padding-left: 22px;
}
.legal-content > div {
  overflow-x: auto;
}
.legal-content table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  margin: 18px 0;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
}
.legal-content th,
.legal-content td {
  border: 1px solid var(--line);
  padding: 12px;
  text-align: left;
  vertical-align: top;
}
.legal-content th {
  color: #fff;
  background: var(--navy);
}
.legal-content code {
  padding: 2px 5px;
  border-radius: 4px;
  background: var(--soft);
}
.contact-band {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 26px;
  padding: 54px max(22px, calc((100vw - 1180px) / 2));
  color: #fff;
  background: var(--navy);
}
.contact-band h2 { font-size: clamp(28px, 3vw, 40px); }
.contact-band p { color: #e0e8f3; }
.site-footer {
  color: #fff;
  background: #041022;
}
.footer-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1.2fr;
  gap: 28px;
  width: min(1180px, calc(100% - 44px));
  margin: 0 auto;
  padding: 54px 0;
}
.footer-logo {
  width: 235px;
  max-width: 100%;
  opacity: 1;
  filter: brightness(1.25) contrast(1.12) drop-shadow(0 10px 24px rgba(255, 255, 255, .08));
}
.site-footer h2 { margin-bottom: 14px; font-size: 18px; }
.site-footer a, .site-footer p { display: block; margin: 8px 0; color: #dbe6f4; text-decoration: none; }
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, .12);
  padding: 18px 22px;
  color: #b8c7d9;
  text-align: center;
}
@media (max-width: 980px) {
  .nav-toggle { display: block; }
  .site-nav {
    position: absolute;
    top: 82px;
    left: 0;
    right: 0;
    display: none;
    align-items: stretch;
    flex-direction: column;
    padding: 18px 22px 24px;
    border-bottom: 1px solid var(--line);
    background: #fff;
  }
  .site-nav.is-open { display: flex; }
  .mega-menu { position: static; grid-template-columns: 1fr; width: 100%; margin-top: 12px; box-shadow: none; }
  .published-hero {
    min-height: 660px;
    padding-top: 82px;
    padding-bottom: 58px;
  }
  .published-hero .eyebrow { margin-bottom: 46px; }
  .hero-facts { margin-top: 42px; }
  .published-hero .lead { margin-top: 48px; }
  .home-guide-wrap { grid-template-columns: 1fr; }
  .home-guide-intro { padding-right: 0; }
  .home-guide-routes {
    grid-template-columns: minmax(280px, 1.3fr) repeat(3, minmax(180px, .82fr));
    overflow-x: auto;
    padding-bottom: 4px;
    scroll-snap-type: x proximity;
  }
  .home-guide-route { scroll-snap-align: start; }
  .hero-home, .card-grid, .card-grid.four, .family-grid, .entry-grid, .risk-strip, .directory-group, .directory-links, .steps, .split, .footer-grid { grid-template-columns: 1fr; }
  h1 { font-size: 42px; }
  .contact-band { align-items: flex-start; flex-direction: column; }
}
@media (max-width: 680px) {
  .published-hero {
    min-height: 690px;
    padding: 62px 18px 46px;
    background-position: center;
  }
  .published-hero h1 { font-size: 35px; }
  .published-hero .eyebrow {
    margin-bottom: 34px;
    font-size: 13px;
  }
  .hero-facts {
    gap: 10px;
    margin-top: 34px;
  }
  .hero-facts p { font-size: 22px; }
  .published-hero .lead {
    margin-top: 38px;
    font-size: 18px;
  }
  .home-guide {
    padding: 18px 14px 19px;
  }
  .home-guide h2 { font-size: 25px; }
  .home-guide-routes {
    display: flex;
    gap: 10px;
  }
  .home-guide-route {
    flex: 0 0 190px;
    min-height: 118px;
    padding: 14px;
  }
  .route-calc { flex-basis: min(82vw, 320px); }
  .route-calc b { font-size: 21px; }
}
@media (prefers-reduced-motion: reduce) {
  .home-guide-route,
  .route-go::after {
    transition: none;
  }
}
`;
}

function script() {
  return `const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}
`;
}

function htaccess() {
  return `Redirect 301 /privacy-policy /politica-de-privacidad/
Redirect 301 /solicita-auditoria-web-gratuita /auditoria-web-gratuita/
Redirect 302 /casos-de-exito /sobre-nosotros/

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.+)/$ $1/index.html [L]
</IfModule>
`;
}

function robots() {
  return `Sitemap: ${baseUrl}/sitemap.xml

User-agent: *
Disallow:
`;
}

function sitemap() {
  const urls = pages
    .filter((page) => !page.noindex)
    .map((page) => {
      const loc = page.slug ? `${baseUrl}/${page.slug}/` : `${baseUrl}/`;
      const priority = page.slug ? "0.6" : "1.0";
      return `  <url><loc>${loc}</loc><priority>${priority}</priority></url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
