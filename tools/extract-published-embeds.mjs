import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const workspaceRoot = new URL("../", import.meta.url).pathname;
const inputDir = process.argv[2] ?? "/private/tmp";
const outputRoot = process.argv[3] ?? join(workspaceRoot, "published-embeds");
const docsPath = join(workspaceRoot, "docs", "inventario-codigos-incrustados-publicados.md");

if (!existsSync(inputDir)) {
  throw new Error(`No existe el directorio de entrada: ${inputDir}`);
}

const sourceFiles = readdirSync(inputDir)
  .filter((file) => file.startsWith("sl360-live-") && file.endsWith(".html"))
  .sort();

if (sourceFiles.length === 0) {
  throw new Error(`No hay capturas sl360-live-*.html en ${inputDir}`);
}

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(outputRoot, { recursive: true });

const inventory = [];
const seen = new Set();

for (const file of sourceFiles) {
  const page = basename(file, ".html").replace(/^sl360-live-/, "");
  const source = readFileSync(join(inputDir, file), "utf8");
  const embeds = extractGridEmbeds(source);
  const pageDir = join(outputRoot, page);
  mkdirSync(pageDir, { recursive: true });

  embeds.forEach((embed, index) => {
    const content = normalizeEmbedContent(embed);
    const hash = createHash("sha1").update(content).digest("hex").slice(0, 10);
    const duplicateKey = `${page}:${hash}`;
    if (seen.has(duplicateKey)) return;
    seen.add(duplicateKey);

    const title = inferTitle(content, embed);
    const kind = inferKind(page, content, embed);
    const flags = inferFlags(content, embed);
    const filename = `${String(index + 1).padStart(2, "0")}-${safeName(embed.id ?? "embed")}-${safeName(kind)}.html`;
    const target = join(pageDir, filename);

    writeFileSync(target, buildExtractedFile({ page, sourceFile: file, embed, content, title, kind, flags }));

    inventory.push({
      page,
      sourceFile: file,
      file: target.replace(workspaceRoot, ""),
      id: embed.id ?? "",
      kind,
      title,
      bytes: Buffer.byteLength(content),
      flags,
      decision: suggestedDecision(page, kind, flags),
    });
  });
}

writeFileSync(join(outputRoot, "index.json"), JSON.stringify(inventory, null, 2));
writeFileSync(docsPath, buildMarkdown(inventory));

console.log(`Extraidos ${inventory.length} bloques incrustados en ${outputRoot}`);
console.log(`Inventario: ${docsPath}`);

function extractGridEmbeds(source) {
  const propsValues = [...source.matchAll(/\sprops="([^"]+)"/g)].map((match) => decodeEntities(match[1]));
  const embeds = [];

  for (const props of propsValues) {
    let parsed;
    try {
      parsed = JSON.parse(props);
    } catch {
      continue;
    }
    walk(parsed, null, (node, currentKey) => {
      const type = taggedString(node.type);
      if (type !== "GridEmbed") return;
      const content = taggedString(node.content) ?? "";
      const settings = taggedObject(node.settings);
      const desktop = taggedObject(node.desktop);
      const mobile = taggedObject(node.mobile);
      const src = taggedString(settings?.src);
      embeds.push({
        id: currentKey,
        content,
        src,
        desktop: extractBox(desktop),
        mobile: extractBox(mobile),
      });
    });
  }

  return embeds;
}

function walk(node, currentKey, visitor) {
  if (!node) return;

  if (Array.isArray(node)) {
    for (const child of node) {
      walk(child, currentKey, visitor);
    }
    return;
  }

  if (typeof node === "object") {
    visitor(node, currentKey);
    for (const [key, value] of Object.entries(node)) {
      walk(value, key, visitor);
    }
  }
}

function taggedString(value) {
  return Array.isArray(value) && value[0] === 0 && typeof value[1] === "string"
    ? value[1]
    : undefined;
}

function taggedObject(value) {
  return Array.isArray(value) && value[0] === 0 && value[1] && typeof value[1] === "object"
    ? value[1]
    : undefined;
}

function taggedNumber(value) {
  return Array.isArray(value) && value[0] === 0 && typeof value[1] === "number"
    ? value[1]
    : undefined;
}

function extractBox(box) {
  if (!box) return {};
  return {
    top: taggedNumber(box.top),
    left: taggedNumber(box.left),
    width: taggedNumber(box.width),
    height: taggedNumber(box.height),
  };
}

function normalizeEmbedContent(embed) {
  let content = repeatDecode(embed.content ?? "").trim();
  if (!content && embed.src) {
    content = `<iframe src="${repeatDecode(embed.src)}" loading="lazy" width="100%" height="${embed.desktop?.height ?? 300}" frameborder="0"></iframe>`;
  }
  return content;
}

function repeatDecode(value) {
  let decoded = value;
  for (let i = 0; i < 4; i += 1) {
    const next = decodeEntities(decoded).replace(/\\\//g, "/");
    if (next === decoded) break;
    decoded = next;
  }
  return decoded;
}

function decodeEntities(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#x26;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function inferTitle(content, embed) {
  const comment = content.match(/SoyLegal360\s*(?:·|-)\s*([^<\n]+)/i);
  if (comment) return cleanText(comment[1]).slice(0, 90);

  const title = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title) return cleanText(title[1]).slice(0, 90);

  const h1 = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return cleanText(h1[1]).slice(0, 90);

  const h2 = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  if (h2) return cleanText(h2[1]).slice(0, 90);

  if (embed.src) return "Iframe externo";
  return "Codigo incrustado sin titulo";
}

function inferKind(page, content, embed) {
  const lower = content.toLowerCase();
  const title = inferTitle(content, embed).toLowerCase();
  if (page === "politica-de-cookies") return "legal-cookies";
  if (lower.includes("tally.so")) return "tally";
  if (lower.includes("maps.google") || lower.includes("google.com/maps") || embed.src?.includes("maps.google")) return "mapa";
  if (lower.includes("<meta charset") || lower.includes("<title>")) return "pagina-completa";
  if (title.includes("como te ayudamos") || title.includes("por que deberia importarte") || title.includes("guia rapida")) return "seccion-home";
  if (title.includes("servicios de proteccion de datos")) return "pagina-hub";
  if (lower.includes("calculadora")) return "calculadora";
  if (title.includes("faq") || lower.includes("faq")) return "faq";
  if (title.includes("cta") || lower.includes("cta")) return "cta";
  if (lower.includes("testimonio")) return "testimonios";
  if (lower.includes("<style")) return "seccion-html";
  return "embed";
}

function inferFlags(content, embed) {
  const lower = content.toLowerCase();
  const flags = [];
  if (lower.includes("tally.so")) flags.push("tally");
  if (lower.includes("cookiebot")) flags.push("cookiebot");
  if (lower.includes("wa.me")) flags.push("whatsapp");
  if (lower.includes("maps.google") || lower.includes("google.com/maps") || embed.src?.includes("maps.google")) flags.push("mapa");
  if (lower.includes("<script")) flags.push("script");
  if (lower.includes("<style")) flags.push("css-inline");
  if (lower.includes("<meta charset") || lower.includes("<title>")) flags.push("head-incrustado");
  if (lower.includes("clarice turner") || lower.includes("brian moten") || lower.includes("testimonios reales")) flags.push("testimonio-no-validado");
  if (!content.trim()) flags.push("vacio");
  return flags;
}

function suggestedDecision(page, kind, flags) {
  if (flags.includes("testimonio-no-validado")) return "No usar";
  if (kind === "tally") return "Usar como integracion";
  if (kind === "legal-cookies") return "Extraer texto legal";
  if (kind === "mapa") return "Revisar si se mantiene";
  if (kind === "pagina-completa") return "Usar como base de pagina";
  if (page === "home" || kind === "seccion-html" || kind === "seccion-home" || kind === "pagina-hub" || kind === "cta" || kind === "faq") return "Revisar para reutilizar";
  return "Pendiente de revision";
}

function buildExtractedFile({ page, sourceFile, embed, content, title, kind, flags }) {
  return `<!--
Fuente: ${sourceFile}
Pagina publicada: ${page}
Elemento Hostinger: ${embed.id ?? "sin-id"}
Tipo detectado: ${kind}
Titulo detectado: ${title}
Flags: ${flags.join(", ") || "ninguna"}
Desktop: ${JSON.stringify(embed.desktop)}
Mobile: ${JSON.stringify(embed.mobile)}
-->
${content}
`;
}

function buildMarkdown(items) {
  const lines = [
    "# Inventario de codigos incrustados publicados",
    "",
    "Extraccion realizada desde capturas temporales `sl360-live-*.html` de la web publicada.",
    "",
    "Carpeta de salida: `published-embeds/`.",
    "",
    "## Resumen",
    "",
    `- Bloques extraidos: ${items.length}.`,
    `- Paginas con bloques: ${new Set(items.map((item) => item.page)).size}.`,
    `- Bloques Tally: ${items.filter((item) => item.kind === "tally").length}.`,
    `- Bloques con head incrustado: ${items.filter((item) => item.flags.includes("head-incrustado")).length}.`,
    `- Bloques marcados como no usar: ${items.filter((item) => item.decision === "No usar").length}.`,
    "",
    "## Tabla",
    "",
    "| Pagina | Archivo extraido | Tipo | Titulo detectado | Flags | Decision |",
    "| --- | --- | --- | --- | --- | --- |",
  ];

  for (const item of items) {
    lines.push(
      `| \`${item.page}\` | \`${item.file}\` | ${item.kind} | ${escapePipe(item.title)} | ${item.flags.join(", ") || "-"} | ${item.decision} |`,
    );
  }

  lines.push(
    "",
    "## Notas de uso",
    "",
    "- Los bloques `pagina-completa` suelen traer `<meta>`, `<title>`, CSS y estructura completa dentro del embed de Hostinger; se deben limpiar antes de integrarlos en el generador.",
    "- Los bloques Tally se tratan como integraciones, no como contenido editorial.",
    "- Los bloques legales se usan para extraer texto vigente, no para copiar estilos inline tal cual.",
    "- Los bloques con testimonios no validados no se reutilizan.",
  );

  return `${lines.join("\n")}\n`;
}

function cleanText(value) {
  return repeatDecode(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function safeName(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70) || "embed";
}

function escapePipe(value) {
  return value.replace(/\|/g, "\\|");
}
