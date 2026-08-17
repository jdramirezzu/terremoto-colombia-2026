import type { APIRoute } from 'astro';

// Único endpoint no-estático del sitio: crea un Issue en GitHub a partir
// del formulario público, para que alguien pueda pedir una verificación o
// reportar un dato sin necesitar cuenta de GitHub. Todo lo demás del sitio
// sigue siendo HTML estático (ver astro.config.mjs).
export const prerender = false;

const REPO = 'jdramirezzu/terremoto-colombia-2026';

const TIPOS: Record<string, string> = {
  'canal-no-verificado': 'Canal no verificado / posible estafa',
  'actualizar-cifra': 'Actualizar cifra oficial',
  'agregar-centro-acopio': 'Agregar/actualizar centro de acopio',
  otro: 'Otro',
};

const MAX_LEN = { descripcion: 4000, fuente: 300, pagina: 300, contacto: 300 };

function truncar(valor: string, max: number) {
  return valor.trim().slice(0, max);
}

function paginaDestino(request: Request, formPagina: string) {
  // Preferimos el Referer real (de dónde vino el envío) sobre el campo
  // oculto del formulario, que es más fácil de falsificar o de dejar
  // desactualizado si alguien reusa el componente en otro contexto.
  const referer = request.headers.get('referer');
  if (referer && referer.startsWith(new URL(request.url).origin)) {
    return truncar(referer, MAX_LEN.pagina);
  }
  return truncar(formPagina, MAX_LEN.pagina) || '(no especificada)';
}

function quiereJson(request: Request) {
  return request.headers.get('x-requested-with') === 'fetch';
}

function responder(request: Request, status: number, ok: boolean, mensaje: string) {
  if (quiereJson(request)) {
    return new Response(JSON.stringify({ ok, mensaje }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const destino = ok ? '/reportar/?enviado=1' : '/reportar/?error=1';
  return new Response(null, { status: 303, headers: { Location: destino } });
}

export const POST: APIRoute = async ({ request }) => {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return responder(request, 400, false, 'No se pudo leer el formulario.');
  }

  // Honeypot: campo invisible para personas (oculto por CSS, no por
  // `hidden`/`display:none`, que algunos bots ya saben ignorar), que los
  // bots de spam suelen rellenar igual. Si viene lleno, respondemos
  // "éxito" (para no delatar el mecanismo) pero no creamos el Issue. Es
  // el único filtro anti-spam — funciona sin JavaScript, a diferencia de
  // un control por tiempo transcurrido, que hubiera dejado sin protección
  // a quien tenga JS desactivado.
  if (truncar(String(data.get('sitio_web') ?? ''), 50) !== '') {
    return responder(request, 200, true, 'Gracias por tu reporte.');
  }

  const tipo = String(data.get('tipo') ?? 'otro');
  const descripcion = truncar(String(data.get('descripcion') ?? ''), MAX_LEN.descripcion);
  const fuente = truncar(String(data.get('fuente') ?? ''), MAX_LEN.fuente);
  const contacto = truncar(String(data.get('contacto') ?? ''), MAX_LEN.contacto);
  const pagina = paginaDestino(request, String(data.get('pagina') ?? ''));

  if (!descripcion) {
    return responder(request, 400, false, 'La descripción es obligatoria.');
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN no configurado — no se puede crear el Issue.');
    return responder(
      request,
      500,
      false,
      'El formulario no está configurado todavía. Escríbenos por otro medio mientras tanto.',
    );
  }

  const tipoLabel = TIPOS[tipo] ?? TIPOS.otro;
  const title = `[Web] ${tipoLabel} — ${pagina}`;
  const body = [
    `**Tipo:** ${tipoLabel}`,
    `**Página relacionada:** ${pagina}`,
    '',
    '**Descripción:**',
    descripcion,
    '',
    fuente ? `**Fuente/evidencia aportada:** ${fuente}` : '',
    contacto ? `**Contacto de quien reporta:** ${contacto}` : '',
    '',
    '---',
    '_Enviado automáticamente desde el formulario público del sitio (no requirió cuenta de GitHub). Revisar y verificar antes de actuar sobre esta información._',
  ]
    .filter((linea) => linea !== '')
    .join('\n');

  try {
    const resp = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ title, body }),
    });

    if (!resp.ok) {
      const detalle = await resp.text();
      console.error('Error creando Issue en GitHub:', resp.status, detalle);
      return responder(request, 502, false, 'No pudimos enviar tu reporte. Intenta de nuevo en un momento.');
    }
  } catch (err) {
    console.error('Error de red creando Issue en GitHub:', err);
    return responder(request, 502, false, 'No pudimos enviar tu reporte. Intenta de nuevo en un momento.');
  }

  return responder(request, 200, true, '¡Gracias! Tu reporte quedó registrado y alguien del equipo lo va a revisar.');
};
