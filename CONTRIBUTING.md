# Cómo contribuir

Gracias por sumarte. Hay dos rutas separadas — elige la que corresponda a
lo que quieres aportar, no necesitas saber programar para ayudar.

## Ruta 1 — Contribuir contenido (no requiere código)

Esto es lo más urgente ahora mismo: verificar y mantener actualizada la
wiki y las cifras.

1. Ve a `src/content/wiki/` (para la wiki) o `data/cifras.json` (para
   cifras) en GitHub.
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

- Automatizar la ingesta de réplicas desde el SGC.
- Mapa interactivo de municipios/departamentos afectados.
- Vista de tabla accesible como alternativa a los stat tiles (WCAG).
- Modo oscuro / toggle de tema.
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
