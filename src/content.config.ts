import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Esquema = el "contrato" que produce sl360-redactor. Si un .md no lo cumple,
// el build falla: es la validación automática del frontmatter del agente.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    titulo: z.string(),
    meta: z.string(),
    fecha: z.coerce.date(),
    publico: z.enum(['pyme', 'autonomo', 'empresa', 'b2c']).optional(),
    keyword: z.string().optional(),
    cta: z.string().optional(),
    enlaces_internos: z.array(z.string()).optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    fuentes: z.array(z.string()).default([]),
    estado_revision: z.enum(['pendiente', 'verificado']).default('pendiente'),
    autor: z.string().default('Samara Nacher'),
    imagen: z.string().optional(), // imagen custom (Codex + marco de marca); si falta, tarjeta programatica de gen-og.mjs
    titulo_tarjeta: z.string().optional(), // titular corto para la imagen; si falta, el titulo antes de ':' o '?'
  }),
});

export const collections = { blog };
