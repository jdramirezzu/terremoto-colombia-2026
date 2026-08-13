import { defineConfig } from 'astro/config';

// Sitio 100% estático, sin dependencias pesadas: prioriza tiempos de carga
// bajos para usuarios con datos móviles limitados en las zonas afectadas.
export default defineConfig({
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
});
