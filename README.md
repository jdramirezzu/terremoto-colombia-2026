# Terremoto Colombia 2026 — Dashboard y Wiki de Ayuda

Proyecto de código abierto con dos objetivos:

1. **Dashboard** con cifras oficiales actualizadas del terremoto de magnitud
   7.4 del 10 de agosto de 2026 (epicentro en San José del Palmar, Chocó),
   que afecta principalmente a Valle del Cauca, Risaralda, Chocó y Caldas.
2. **Wiki** de canales oficiales, verificados y con fecha, para reportar
   daños, pedir ayuda, donar dinero, donar en especie y ofrecerte como
   voluntario/a.

No reemplaza a las entidades oficiales (UNGRD, SGC, Cruz Roja, Defensa
Civil, alcaldías) — las **agrega, verifica y mantiene en un solo lugar**,
optimizado para gente con datos móviles limitados en zonas afectadas.

## Estado actual

🟡 **Fase 0 — recién arrancando.** El contenido de la wiki es un borrador
inicial construido a partir de cobertura de prensa; **todavía no está
verificado directamente contra las fuentes oficiales.** Ver el aviso en cada
página y en `verificadoPor` dentro de cada archivo de contenido. Esa
verificación es, ahora mismo, la contribución de mayor impacto posible.

## Cómo está construido

- [Astro](https://astro.build) — sitio 100% estático, sin backend, liviano
  (páginas ~8KB) para cargar rápido en conexiones débiles.
- Contenido de la wiki en Markdown con front-matter tipado
  (`src/content/wiki/*.md`, schema en `src/content/config.ts`) — se puede
  editar directamente en la interfaz web de GitHub, sin instalar nada.
- Cifras del dashboard en `data/cifras.json`, versionadas por corte de
  fecha — nunca se sobrescribe un corte anterior, se agrega uno nuevo.

## Correr el proyecto localmente

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera /dist, valida tipos de contenido
```

## Cómo contribuir

Hay dos formas de ayudar, ninguna requiere las dos habilidades a la vez —
ver [`CONTRIBUTING.md`](./CONTRIBUTING.md) para el detalle:

- **Contribuir contenido** (sin programar): verificar/actualizar una entrada
  de la wiki o una cifra, editando el `.md` o el `.json` directamente desde
  GitHub.
- **Contribuir código**: dashboard, automatización de datos, accesibilidad,
  nuevas vistas.

## Licencia

- Código: [MIT](./LICENSE)
- Contenido y datos (wiki, cifras): [CC BY 4.0](./LICENSE-CONTENT.md)

## Aviso importante

La información de este sitio se ofrece de buena fe pero puede contener
errores, especialmente mientras la wiki está en fase de verificación.
**Nunca hagas una donación económica basándote solo en este sitio** sin
confirmar el canal en la fuente oficial de la entidad.
