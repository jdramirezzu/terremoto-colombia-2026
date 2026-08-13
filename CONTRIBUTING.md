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
   - Si no puedes confirmarlo contra la fuente oficial todavía, dilo
     explícitamente en `verificadoPor` — un dato marcado como "sin
     verificar" es mucho mejor que uno que aparenta estar verificado sin
     estarlo.
4. Abre el Pull Request (GitHub te guía). Alguien del equipo lo revisa
   antes de publicarlo — por el riesgo de canales de donación falsos,
   **el contenido de `donar-dinero` y `donar-especie` siempre pasa por
   revisión humana antes de mergear**, sin excepción.

¿No tienes cuenta de GitHub o prefieres no usarla? Abre un
[issue](../../issues/new/choose) describiendo el dato a corregir — alguien
del equipo lo traslada.

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
