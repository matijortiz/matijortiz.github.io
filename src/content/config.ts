import { defineCollection, z } from 'astro:content';

// Schema para artículos del feed
const articulos = defineCollection({
  type: 'content',
  schema: z.object({
    titulo:     z.string(),
    tipo:       z.string(),              // "Sobre un relato" | "Proceso" | "Mirada" | etc.
    fecha:      z.string(),              // "Febrero 2026"
    imagen:     z.string().optional(),   // URL de imagen
    imagenAlt:  z.string().optional(),   // Alt text
    pintura:    z.boolean().default(false),  // true = Goya/Mantegna, object-fit:contain
    fragmento:  z.string().optional(),   // Nombre del relato para el libro-lector
    coleccion:  z.string().optional(),   // "Egixi · Matias J. Ortiz · Rosario"
    draft:      z.boolean().default(false),  // true = no publicar
    orden:      z.number().optional(),   // orden manual si se necesita
  })
});

export const collections = { articulos };
