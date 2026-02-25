import { defineCollection, z } from 'astro:content';

// Schema para artículos del feed
const articulos = defineCollection({
  type: 'content',
  schema: z.object({
    titulo:          z.string(),
    tipo:            z.string(),              // "Sobre un relato" | "Proceso" | "Mirada" | etc.
    fecha:           z.string(),              // "Febrero 2026"
    imagen:          z.string().optional(),   // URL de imagen
    imagenAlt:       z.string().optional(),   // Alt text
    pintura:         z.boolean().default(false),
    fragmento:       z.string().optional(),   // Nombre del relato para el libro-lector
    coleccion:       z.string().optional(),   // "Egixi · Matias J. Ortiz · Rosario"
    draft:           z.boolean().default(false),
    orden:           z.number().optional(),

    // ── Campos SEO ──────────────────────────────────────────────────────────
    // Si no se definen, el Layout usa el título genérico del sitio.
    // Escribirlos en texto plano, sin HTML.
    seoTitulo:       z.string().optional(),   // Ej: "Genius — Matias J. Ortiz — Ciencia Ficción Argentina"
    seoDescripcion:  z.string().optional(),   // Ej: "Análisis del relato Genius: trabajo, ocupación alienígena y resistencia obrera en Rosario."
  })
});

export const collections = { articulos };
