import { defineCollection, z } from 'astro:content';

// Cada entrada de la wiki es una "fuente de ayuda" verificada. Los tres
// campos obligatorios (fuente, verificadoPor, fechaVerificacion) existen
// a propósito: son lo que separa este proyecto de un post de redes sociales
// que nadie vuelve a actualizar, y la mejor defensa contra canales falsos
// de donación que circulan durante emergencias.
const wiki = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    categoria: z.enum([
      'reportar',
      'pedir-ayuda',
      'donar-dinero',
      'donar-especie',
      'voluntariado',
    ]),
    resumen: z.string(),
    fuente: z.string().url(),
    // Estado explícito, no inferido del texto libre de verificadoPor — así
    // la plantilla nunca puede mostrar "Verificado" para algo que no lo está.
    estado: z.enum(['sin-verificar', 'verificado']).default('sin-verificar'),
    verificadoPor: z.string(),
    fechaVerificacion: z.coerce.date(),
    orden: z.number().default(0),
  }),
});

export const collections = { wiki };
