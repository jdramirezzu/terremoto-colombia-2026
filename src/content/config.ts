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
      'revisar-danos',
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
    // Solo para mostrar el nombre bonito (con tildes) del municipio en el
    // título/breadcrumb. NO es la fuente de verdad de a qué departamento o
    // ciudad pertenece la entrada — eso lo define la ruta del archivo
    // (src/lib/wiki.ts), para que nunca puedan desincronizarse.
    municipio: z.string().optional(),
    // Guía paso a paso opcional — solo para trámites donde exista un
    // proceso oficial real y documentado (no se inventan pasos). Cuando
    // existe, se renderiza como una lista numerada antes del resto del
    // contenido.
    pasos: z
      .array(
        z.object({
          titulo: z.string(),
          detalle: z.string(),
        }),
      )
      .optional(),
  }),
});

export const collections = { wiki };

// Espejo del enum `categoria` de arriba — mantener ambos en sync.
export const CATEGORIAS = [
  { slug: 'revisar-danos', label: 'Revisar daños en tu vivienda' },
  { slug: 'reportar', label: 'Reportar daños o desaparecidos' },
  { slug: 'pedir-ayuda', label: 'Pedir ayuda' },
  { slug: 'donar-dinero', label: 'Donar dinero' },
  { slug: 'donar-especie', label: 'Donar en especie' },
  { slug: 'voluntariado', label: 'Ser voluntario' },
] as const;
