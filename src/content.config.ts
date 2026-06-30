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
  }),
});

export const collections = { blog };
