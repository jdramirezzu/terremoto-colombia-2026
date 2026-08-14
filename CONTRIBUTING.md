# Cómo contribuir

Gracias por sumarte. Hay tres rutas separadas — elige la que corresponda a
lo que quieres aportar, no necesitas saber programar para ayudar.

## Ruta 0 — Reportar algo sin cuenta de GitHub

Si solo quieres avisar de un dato mal o desactualizado, sin crear una
cuenta ni hacer un PR: usa el formulario en [`/reportar/`](https://terremoto-colombia-2026.vercel.app/reportar/)
del sitio, o el que aparece al final de cada página de la wiki. Esto crea
automáticamente un Issue en este repositorio, que alguien del equipo
revisa igual que cualquier otro reporte.

## Ruta 1 — Contribuir contenido (no requiere código)

Esto es lo más urgente ahora mismo: verificar y mantener actualizada la
wiki y las cifras. Son dos flujos distintos:

- **Wiki** (`src/content/wiki/*.md`) — sigue leyendo acá abajo.
- **Cifras del dashboard** (`data/cifras.json`) — ver
  [Actualizar las cifras](#actualizar-las-cifras-datacifrasjson), tiene sus
  propias reglas.

### Editar una entrada de la wiki

1. Ve a `src/content/wiki/` en GitHub.
2. Haz clic en el lápiz (✏️ "Edit this file") — GitHub crea automáticamente
   una copia (fork) y una rama para ti.
3. Edita el contenido. **Reglas no negociables:**
   - Todo dato debe tener una fuente verificable en el campo `fuente` (URL
     directa a la entidad oficial, no un artículo de prensa que la
     mencione, cuando sea posible).
   - Actualiza `verificadoPor` con tu nombre/usuario y `fechaVerificacion`
     con la fecha en que lo confirmaste.
   - Cambia `estado` a `"verificado"` **solo** si confirmaste el dato
     directamente en el canal oficial de la entidad (no un artículo de
     prensa). Si no, déjalo en `"sin-verificar"` — ese campo es lo que
     controla el badge que ve la persona visitante (✅ vs ⚠️), así que nunca
     lo cambies "para que se vea mejor".
4. Abre el Pull Request (GitHub te guía). Alguien del equipo lo revisa
   antes de publicarlo — por el riesgo de canales de donación falsos,
   **el contenido de `donar-dinero` y `donar-especie` siempre pasa por
   revisión humana antes de mergear**, sin excepción. Esto aplica igual a
   contenido regional — una cuenta hiperlocal de una gobernación o
   alcaldía es exactamente el mismo riesgo de estafa que una nacional.

¿No tienes cuenta de GitHub o prefieres no usarla? Abre un
[issue](../../issues/new/choose) describiendo el dato a corregir — alguien
del equipo lo traslada.

### Checklist antes de marcar algo como `"verificado"` (especialmente `donar-dinero`)

- [ ] El dato aparece en el sitio web oficial de la entidad, no solo en prensa.
- [ ] El número de cuenta/llave coincide en al menos dos fuentes independientes.
- [ ] Se registró quién lo verificó y cuándo (`verificadoPor`, `fechaVerificacion`).
- [ ] Si no lograste confirmarlo directamente, se queda en `"sin-verificar"` — no pasa nada, es mejor ser honestos que optimistas.

### Actualizar las cifras (`data/cifras.json`)

Las cifras van por su propio camino: **no tienen campo `estado` ni badge**.
Lo que sostiene su credibilidad es que cada bloque guarda su fuente, su fecha
y su hora de corte. El archivo tiene cuatro bloques (`evento`, `cortes`,
`desgloseRegional`, `identificacionVictimas`) y cada uno cita fuente aparte.

#### Agregar un balance nuevo (un "corte")

1. **Busca una fuente que declare fecha y hora de corte.** Prefiere un
   artículo fechado del día. Evita los "minuto a minuto" (ver la advertencia
   abajo).
2. **Copia el último objeto del array `cortes` y pégalo al final**, cambiando
   los valores. Conserva **todas** las claves aunque no las reportaran: las
   que falten van en `null`, no se borran ni se ponen en `0`.
3. **Verifica que quede en orden cronológico.** El sitio toma el **último
   elemento del array** como "cifras actuales" — un corte fuera de orden
   cambia el titular del dashboard.
4. **Nunca edites un corte anterior.** La serie completa es lo que muestra la
   evolución. Que una cifra baje entre un corte y el siguiente es información
   real (reclasificaciones, censos que avanzan), no un error a corregir.
5. **Escribe `verificadoPor` como si le explicaras a un desconocido por qué
   creerte**: qué fuentes cruzaste, qué no cuadró, qué quedó pendiente. Es el
   campo más valioso del archivo.

#### Reglas no negociables

- **`null` no es `0`.** `null` = "no lo tenemos". `0` = "afirmamos que no
  ocurrió". Confundirlos ya produjo un error real: Risaralda figuraba con `0`
  viviendas destruidas siendo el departamento con más fallecidos del país,
  cuando lo que pasaba es que el censo no había empezado. Ante la duda,
  `null`.
- **Si dos fuentes se contradicen, no promedies ni elijas en silencio.** Deja
  el campo en `null` y documenta el conflicto en `verificadoPor`. Publicar una
  de las dos sin más es inventar una precisión que no tenemos.
- ⚠️ **Cuidado con los artículos "en vivo".** Varios medios reescriben el
  balance sobre la misma URL: el enlace deja de mostrar las cifras que
  documenta (hemos visto titulares que ya no coinciden ni con su propio slug).
  Si usas uno, anótalo en `verificadoPor`. Ver `$avisoFuentes` en el archivo.
- **Guarda `horaCorte` cuando la fuente la declare.** Hay días con varios
  cortes y cifras distintas; la fecha sola no los identifica.
- **Si una fecha no cuadra, dilo en vez de asumirla.** Ya pasó que un medio
  rotulara mal el día de un corte; se dedujo por la hora de publicación y se
  dejó escrito el razonamiento.

#### Cifras por departamento (`desgloseRegional`)

- **Cada métrica tiene su propia `fuente` y `fechaCorte`**, no hay una sola
  para todo el bloque. No mezcles cifras de momentos distintos bajo la misma
  fecha, y no las sumes esperando que den el total nacional.
- **Una cifra de la ciudad capital NO es la cifra del departamento.** Si solo
  tienes el dato municipal, déjalo fuera: rellenar el departamento con él
  subestima el resto de municipios y la interfaz lo mostraría como si fuera
  departamental.
- **Usa `notas` para explicar por qué falta un dato.** "No lo encontramos" y
  "la autoridad dice que el conteo todavía no existe" no son lo mismo; la
  interfaz muestra esa diferencia en el tile. También sirve para marcar un
  dato que sí existe pero sabemos que es un subconteo.

#### Checklist antes del PR de cifras

- [ ] El corte nuevo está al final del array y en orden cronológico.
- [ ] Tiene todas las claves; lo no reportado quedó en `null`, no en `0`.
- [ ] No se modificó ningún corte anterior.
- [ ] `fuente`, `fuenteUrl` y (si existe) `horaCorte` están llenos.
- [ ] `verificadoPor` explica qué se cruzó y qué quedó sin resolver.

> `npm run build` valida tipos, **no** verifica que un número sea correcto.
> Una cifra mal transcrita pasa CI sin problema — por eso la revisión humana
> del PR es el control real.

### Registro de sismos (`data/sismos.json`) — no lo edites a mano

Este archivo lo genera `scripts/actualizar-sismos.mjs` desde el feed del SGC,
y lo actualiza una GitHub Action cada 3 horas. Si ves un dato raro ahí, el
arreglo va en el script o se reporta al SGC, no editando el JSON: la siguiente
corrida sobrescribiría tu cambio.

**Nunca borres entradas.** El feed del SGC solo conserva 5 días; este archivo
es la única memoria de los eventos anteriores.

Para correrlo localmente:

```bash
node scripts/actualizar-sismos.mjs --dry   # reporta qué cambiaría, sin escribir
npm run sismos:actualizar                  # actualiza el archivo
```

### Agregar contenido de un departamento o ciudad

El contenido regional vive bajo `src/content/wiki/departamentos/` y su
**alcance se define por la carpeta**, no por un campo dentro del archivo:

```
src/content/wiki/departamentos/
  <departamento-slug>/
    <categoria>.md              # canal departamental (ej. cuenta de una gobernación)
    <municipio-slug>/
      <categoria>.md            # canal local de esa ciudad (ej. un punto de acopio)
```

Para agregar una **ciudad nueva** dentro de un departamento que ya existe
(ej. Tuluá dentro de Valle del Cauca):
1. En GitHub, ve a `src/content/wiki/departamentos/valle-del-cauca/`.
2. "Add file" → "Create new file" y escribe `tulua/donar-especie.md` como
   nombre — GitHub crea la carpeta `tulua/` automáticamente por la barra.
3. Llena el frontmatter igual que cualquier otra entrada, agregando
   `municipio: "Tuluá"` (nombre con tildes, es solo para mostrar en
   pantalla). No hace falta tocar ningún archivo de código ni una lista
   central de "ciudades válidas" — la página se genera sola en el
   siguiente deploy si la carpeta tiene al menos un archivo.

Para agregar un **departamento nuevo** (una decisión de alcance, no solo
de contenido — implica que confirmamos afectación real): agrega una
entrada a `data/regiones.json` además de crear los archivos de contenido.
La revisión del PR es el filtro real de "¿esto de verdad fue afectado?".

## Ruta 2 — Contribuir código

Ideas de por dónde empezar (ver también los issues etiquetados
`good-first-issue`):

- Mapa interactivo de municipios/departamentos afectados.
- Mapa de los epicentros de la secuencia de réplicas (los datos ya están en
  `data/sismos.json`, con latitud y longitud por evento).
- Vista de tabla accesible como alternativa a los stat tiles (WCAG).
- Toggle de tema. El modo oscuro **ya funciona** por `prefers-color-scheme`, y
  el CSS ya responde a `:root[data-theme="dark"|"light"]`; lo que falta es el
  control que fije ese atributo y recuerde la preferencia.
- Tests para el schema de contenido.

Antes de un PR de código grande, abre un issue describiendo el cambio —
evita trabajo duplicado o que choque con la dirección del proyecto.

```bash
npm install
npm run dev
```

`npm run build` corre `astro check` — un PR con errores de tipos no pasa CI.

## Código de conducta

Este proyecto sigue el [Código de Conducta](./CODE_OF_CONDUCT.md).
Estamos construyendo esto en medio de una emergencia real — sé amable,
asume buena intención, y prioriza la precisión sobre la velocidad cuando
se trate de cifras de vidas humanas o canales de donación.
