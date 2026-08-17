# Terremoto Colombia 2026 — Dashboard y Wiki de Ayuda

Proyecto de código abierto con dos objetivos:

1. **Dashboard** con cifras oficiales actualizadas del terremoto de magnitud
   7.4 del 10 de agosto de 2026 (epicentro en San José del Palmar, Chocó).
   La UNGRD reporta afectación en 15 departamentos; el sitio cubre en detalle
   los 5 más golpeados (Valle del Cauca, Risaralda, Chocó, Caldas y Quindío),
   que son para los que existen cifras desagregadas.
2. **Wiki** de canales oficiales, verificados y con fecha, para reportar
   daños, pedir ayuda, donar dinero, donar en especie y ofrecerte como
   voluntario/a — más guías de procedimiento (revisar grietas en tu
   vivienda, censo de damnificados, seguro).

No reemplaza a las entidades oficiales (UNGRD, SGC, Cruz Roja, Defensa
Civil, alcaldías) — las **agrega, verifica y mantiene en un solo lugar**,
optimizado para gente con datos móviles limitados en zonas afectadas.

## Estado actual

**Fase 0 — la mayor parte del contenido sigue sin verificar.** La wiki
nació como borrador armado desde cobertura de prensa, y esa sigue siendo la
situación de casi todas las entradas: revisa el badge de verificación y el
campo `verificadoPor` de cada archivo antes de confiar en un dato.

Lo que ya está confirmado en primera fuente, a modo de ejemplo de lo que
buscamos:

- **Datos de contacto de la UNGRD** (línea 01-8000-113200 y correos), tomados
  del portal de la propia entidad y no de prensa.
- **Datos técnicos del sismo** (magnitud 7,4, profundidad 103 km, hora
  07:34:27), del Servicio Geológico Colombiano vía el Informe de Situación de
  OPS/OMS.

### Los tres huecos más grandes ahora mismo

Si quieres ayudar y no sabes por dónde, esto es lo de mayor impacto:

1. **El desglose por departamento va días atrás de las cifras nacionales**, y
   solo cubre 5 de los 15 departamentos con afectación reportada. Ver
   `desgloseRegional` en `data/cifras.json`.
2. **No tenemos el boletín de la UNGRD.** La entidad produce uno con hora de
   corte —la prensa lo cita textualmente— pero no lo publica en su portal.
   Conseguirlo eliminaría nuestra dependencia de medios.
3. **Verificar entradas de la wiki contra la fuente oficial**, sobre todo las
   de `donar-dinero`.

## Cómo está construido

- [Astro](https://astro.build) en modo **híbrido**: casi todo el sitio es
  HTML estático, salvo `/reportar/` y `/api/reportar` (ver abajo), que son
  las dos únicas rutas dinámicas. El peso importa: mucha gente lo abre con
  datos móviles limitados desde zonas afectadas. Hoy las páginas de la wiki
  pesan entre **5 y 9 KB con gzip** (la portada, que carga el dashboard
  completo, ~11 KB). Sin dependencias de JavaScript de terceros.
- Contenido de la wiki en Markdown con front-matter tipado
  (`src/content/wiki/*.md`, schema en `src/content/config.ts`) — se puede
  editar directamente en la interfaz web de GitHub, sin instalar nada.
- Cifras del dashboard en `data/cifras.json` (ver abajo).

## Cómo funcionan las cifras (`data/cifras.json`)

Un solo archivo con cuatro bloques, cada uno con **su propia fuente y fecha**:

| Bloque | Qué guarda |
|---|---|
| `evento` | Datos técnicos del sismo (SGC). |
| `cortes` | Serie histórica de balances nacionales de la UNGRD. |
| `desgloseRegional` | Cifras por departamento, **una fuente y fecha por métrica**. |
| `identificacionVictimas` | Avance forense de Medicina Legal. |

Las reglas que sostienen la credibilidad del sitio — respétalas al agregar
datos:

- **Nunca sobrescribas un corte anterior**, agrega uno nuevo. La serie
  completa es lo que permite ver la evolución, y que una cifra baje entre
  cortes es información real, no un error a corregir.
- **`null` no es `0`.** `null` significa "no lo tenemos"; `0` afirma que no
  ocurrió. Confundirlos ya produjo un error real: Risaralda aparecía con `0`
  viviendas destruidas siendo el departamento con más fallecidos, cuando lo
  que pasaba es que el censo no había empezado.
- **Usa `notas` para explicar por qué falta un dato.** "No lo encontramos" y
  "la autoridad dice que el conteo todavía no existe" no son lo mismo, y la
  interfaz muestra esa diferencia.
- **Guarda `horaCorte` cuando la fuente la declare.** Hay días con varios
  cortes y cifras distintas; la fecha sola no los identifica.
- **Cuidado con los artículos "en vivo".** Varios medios reescriben el
  balance sobre la misma URL, así que el enlace deja de mostrar las cifras
  que documenta (a veces el titular ya no coincide ni con su propio slug).
  Prefiere un artículo fechado del día sobre un minuto a minuto, y anota en
  `verificadoPor` si la URL todavía muestra lo mismo. Ver `$avisoFuentes` en
  el archivo.
- **Cuando dos fuentes se contradigan, no promedies ni elijas en silencio.**
  Deja el campo en `null` y documenta el conflicto en `verificadoPor`.

El paso a paso para agregar un corte, con checklist, está en
[`CONTRIBUTING.md`](./CONTRIBUTING.md#actualizar-las-cifras-datacifrasjson).

## Registro de sismos (`data/sismos.json`)

A diferencia de las cifras, este archivo **se genera solo y no se edita a
mano**. Alimenta la página `/sismos/`.

- **Fuente:** el feed público del Servicio Geológico Colombiano
  (`archive.sgc.gov.co/feed/v1.0.1/summary/five_days_all.json`) — JSON
  estático, sin autenticación ni cuota. El SGC es la autoridad sísmica
  oficial del país.
- **Por qué se acumula en el repo y no se consulta en vivo:** el feed es una
  **ventana rodante de 5 días**; un evento desaparece de ahí al sexto día. Si
  el sitio solo consultara el feed, perdería el sismo principal y la
  secuencia completa de réplicas. `data/sismos.json` es la única memoria de
  los eventos viejos, así que **nunca borres entradas**.
- **Cómo se actualiza:** `.github/workflows/actualizar-sismos.yml` corre cada
  3 horas, ejecuta el script y commitea solo si hubo cambios. También se
  puede correr a mano:

  ```bash
  npm run sismos:actualizar        # actualiza el archivo
  node scripts/actualizar-sismos.mjs --dry   # solo reporta, no escribe
  ```

- **Se descartó USGS como fuente principal.** Su API es más cómoda (GeoJSON
  por GET, bien documentada), pero su catálogo global no es completo para
  Colombia: para el mismo periodo registraba **4 sismos donde el SGC
  registraba cientos**. Sirve como contraste, no como fuente.

### Lo que la página no hace, a propósito

- **No es un sistema de alertas** y lo dice explícitamente. Los datos van con
  horas de retraso y ningún sistema avisa de un sismo antes de que ocurra.
- **No mezcla la sismicidad de fondo del país con las réplicas.** Colombia
  tiene sismos todas las semanas sin relación con este terremoto (el nido de
  Los Santos, en Santander, es el caso típico). Las cifras principales se
  calculan solo sobre la zona del epicentro; el resto se reporta aparte y
  etiquetado como lo que es. Sumarlos haría creer que tiembla en todo el país
  por causa de este evento.
- **No declara qué sismo es "réplica".** Esa es una determinación técnica que
  le corresponde al SGC; acá solo se usa un radio de cercanía al epicentro,
  documentado como criterio de lectura.

## Guías de la wiki

Además del directorio de canales por categoría (reportar, pedir ayuda, donar
dinero, donar en especie, voluntariado) y de las páginas por departamento y
ciudad, hay guías de procedimiento:

- **[Revisar grietas y daños en tu vivienda](src/content/wiki/revisar-grietas.md)** —
  qué señales obligan a salir de inmediato, cuáles hay que hacer revisar
  pronto y cómo documentarlas. Por diseño **no emite un veredicto de
  habitabilidad**: eso lo define un ingeniero o el evaluador de la alcaldía.
  Si eres ingeniero/a civil o estructural, revisarla es de las
  contribuciones más útiles que puede recibir el proyecto.
- **Reportar daños** — el camino de reporte → censo/RUD → valoración técnica.
- **Reclamar el seguro de tu vivienda.**

## Formulario de reportes (sin necesitar GitHub)

Cualquier persona puede reportar un dato desde `/reportar/` (o desde el
formulario al final de cada página de la wiki) sin tener cuenta de
GitHub — el endpoint `src/pages/api/reportar.ts` crea automáticamente un
[Issue en este repositorio](../../issues) con lo que la persona escribió.
Para que esto funcione en un despliegue propio, hace falta configurar una
variable de entorno — ver la sección siguiente.

### Configurar `GITHUB_TOKEN` (solo quien despliega)

1. Crea un **fine-grained personal access token** en
   [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new):
   - **Repository access:** solo este repositorio (`terremoto-colombia-2026`), no todos.
   - **Permisos:** `Issues` → `Read and write`. Ningún otro permiso.
2. En Vercel: Project Settings → Environment Variables → agrega
   `GITHUB_TOKEN` con el valor del token (marcar para Production).
3. Redeploy. Mientras no esté configurado, el formulario sigue
   funcionando sin romperse — solo muestra un mensaje pidiendo escribir
   por otro medio, en vez de crear el Issue.

**Nunca pegues el token en un commit, en un issue, ni se lo compartas a
nadie fuera de la configuración de variables de entorno de Vercel.**

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

- **Nunca hagas una donación económica basándote solo en este sitio** sin
  confirmar el canal en la fuente oficial de la entidad.
- **Ninguna guía de acá decide si tu vivienda es segura.** Eso lo define un
  ingeniero civil o estructural, o el evaluador que envía tu alcaldía. Si hay
  riesgo de colapso, gas o personas atrapadas, el número es el **123**.
- Las cifras son el último balance que pudimos verificar, no un dato en
  tiempo real: cada una muestra su fecha y hora de corte.
