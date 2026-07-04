import { defineCollection, z } from 'astro:content';

// Schema para artículos del feed
const articulos = defineCollection({
  type: 'content',
  schema: z.object({
    titulo:          z.string(),
    tipo:            z.string(),              // "Sobre un relato" | "Proceso" | "Mirada" | etc.
    fecha:           z.string(),              // Display: "Febrero 2026"
    fechaISO:        z.coerce.date(),         // Fecha real SOLO para ordenar y para el schema. Ej: 2026-04-20
    imagen:          z.string().optional(),   // URL de imagen
    imagenAlt:       z.string().optional(),   // Alt text
    pintura:         z.boolean().default(false),
    fragmento:       z.string().optional(),   // Nombre del relato para el libro-lector
    coleccion:       z.string().optional(),   // "Egixi · Matias J. Ortiz · Rosario"
    draft:           z.boolean().default(false),
    orden:           z.number().optional(),   // OPCIONAL: solo desempata fechas iguales. Ya no hay que tocarlo.

    // ── Campos SEO ─────────────────────────────────────────────────────────
    seoTitulo:       z.string().optional(),
    seoDescripcion:  z.string().optional(),
  })
});

export const collections = { articulos };
