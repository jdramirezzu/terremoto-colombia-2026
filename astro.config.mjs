import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

// Sitio estático por defecto (prioriza tiempos de carga bajos para
// usuarios con datos móviles limitados en las zonas afectadas). Modo
// 'hybrid': cada página sigue siendo estática salvo que explícitamente
// exporte `prerender = false` — hoy eso solo aplica a src/pages/api/reportar.ts,
// el endpoint que crea Issues en GitHub desde el formulario público.
export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
});
