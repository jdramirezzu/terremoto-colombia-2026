// Acumula el registro de sismos en data/sismos.json a partir del feed del
// Servicio Geológico Colombiano.
//
// POR QUÉ ACUMULAR Y NO SOLO CONSULTAR:
// el feed del SGC es una ventana rodante de 5 días — un evento sale de ahí
// al sexto día. El sismo del 10 de agosto desaparece del feed el 15. Si el
// sitio solo consultara el feed en vivo, perdería el evento principal y toda
// la secuencia de réplicas. Por eso cada corrida hace UNIÓN con lo ya
// guardado: nunca borra eventos viejos.
//
// Uso:
//   node scripts/actualizar-sismos.mjs          (actualiza data/sismos.json)
//   node scripts/actualizar-sismos.mjs --dry    (no escribe, solo reporta)

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const ARCHIVO = join(RAIZ, 'data', 'sismos.json');

// Feed oficial del SGC: JSON estático, sin autenticación ni cuota. Se eligió
// 'five_days_all' (todas las magnitudes) sobre 'five_days_2' (M2+) porque en
// una secuencia de réplicas los eventos chicos son justamente los que
// muestran si la actividad está bajando.
const FEED = 'https://archive.sgc.gov.co/feed/v1.0.1/summary/five_days_all.json';

// Sismo principal, en hora UTC del feed. Todo lo anterior se descarta: este
// registro documenta ESTA emergencia, no la sismicidad de fondo del país.
const DESDE_UTC = '2026-08-10 12:34';

const dryRun = process.argv.includes('--dry');

/** El feed trae eventos de toda la región; nos quedamos con los de Colombia. */
function esDeColombia(feature) {
  return /,\s*Colombia\s*$/.test(feature?.properties?.place ?? '');
}

/**
 * OJO: el feed del SGC NO usa el orden estándar de GeoJSON. Sus coordenadas
 * vienen como [latitud, longitud, profundidad], no [lon, lat]. Verificado
 * contra eventos conocidos (el principal da 4.9N/-76.2W, que es Chocó; leído
 * al revés caería en el océano Índico).
 */
function normalizar(feature) {
  const p = feature.properties;
  const [lat, lon, profundidadKm] = feature.geometry.coordinates;
  return {
    id: feature.id,
    utc: p.utcTime,
    local: p.localTime,
    magnitud: p.mag,
    tipoMagnitud: p.magType ?? null,
    profundidadKm,
    lat,
    lon,
    lugar: p.place,
    // Cuántas personas reportaron haberlo sentido en sismosentido.sgc.gov.co.
    sentidoPor: p.felt ?? 0,
    agencia: p.agency ?? null,
    // 'manual' = revisado por un sismólogo; automático = solución preliminar
    // que puede cambiar. Se guarda para poder mostrar la diferencia.
    estado: p.status ?? null,
    actualizado: p.updated ?? null,
  };
}

async function main() {
  const respuesta = await fetch(FEED, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(60_000),
  });
  if (!respuesta.ok) {
    throw new Error(`El feed del SGC respondió ${respuesta.status} ${respuesta.statusText}`);
  }
  const feed = await respuesta.json();
  if (!Array.isArray(feed?.features)) {
    throw new Error('El feed no trae un array "features" — ¿cambió el formato?');
  }

  const entrantes = feed.features
    .filter(esDeColombia)
    .map(normalizar)
    .filter((s) => s.utc >= DESDE_UTC && Number.isFinite(s.magnitud));

  // Lectura del archivo existente. Si no existe todavía, se arranca vacío;
  // cualquier otro error (JSON corrupto, permisos) se propaga en vez de
  // silenciarse, para no sobrescribir el histórico con una versión a medias.
  let previo = { sismos: [] };
  try {
    previo = JSON.parse(await readFile(ARCHIVO, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const porId = new Map((previo.sismos ?? []).map((s) => [s.id, s]));
  let nuevos = 0;
  let revisados = 0;

  for (const sismo of entrantes) {
    const guardado = porId.get(sismo.id);
    if (!guardado) {
      porId.set(sismo.id, sismo);
      nuevos++;
      continue;
    }
    // El SGC revisa sus soluciones: una magnitud automática puede cambiar
    // cuando un sismólogo la reprocesa. Solo se pisa el registro si la
    // versión entrante es más nueva.
    if ((sismo.actualizado ?? '') > (guardado.actualizado ?? '')) {
      porId.set(sismo.id, sismo);
      if (sismo.magnitud !== guardado.magnitud) revisados++;
    }
  }

  const sismos = [...porId.values()].sort((a, b) => b.utc.localeCompare(a.utc));

  const salida = {
    $schema:
      'Registro acumulado de sismos en Colombia desde el terremoto del 10 de agosto de 2026, ' +
      'construido con scripts/actualizar-sismos.mjs a partir del feed del SGC. NO se edita a mano. ' +
      'El feed de origen es una ventana rodante de 5 días, así que este archivo es la única memoria ' +
      'de los eventos más viejos: nunca borres entradas. Orden: del más reciente al más antiguo.',
    fuente: {
      nombre: 'Servicio Geológico Colombiano (SGC)',
      feed: FEED,
      portal: 'https://sgc.gov.co/sismos',
      reportarSismoSentido: 'https://sismosentido.sgc.gov.co',
      nota:
        'El SGC es la autoridad sísmica oficial de Colombia. El feed incluye además eventos ' +
        'de otras agencias (USGS, IGEPN…) para sismos fuera del país; acá solo se guardan los ' +
        'que ocurrieron en Colombia.',
    },
    ventana: {
      desdeUtc: DESDE_UTC,
      criterio: 'Eventos con epicentro en Colombia ocurridos desde el sismo principal (inclusive).',
    },
    ultimaActualizacion: new Date().toISOString(),
    totalSismos: sismos.length,
    sismos,
  };

  if (dryRun) {
    console.log(
      `[dry] ${entrantes.length} eventos en el feed · ${nuevos} nuevos · ${revisados} con magnitud revisada · total quedaría en ${sismos.length}`,
    );
    return;
  }

  await writeFile(ARCHIVO, JSON.stringify(salida, null, 2) + '\n');
  console.log(
    `${entrantes.length} eventos en el feed · ${nuevos} nuevos · ${revisados} con magnitud revisada · total ${sismos.length}`,
  );
}

main().catch((error) => {
  // Salir con error deja data/sismos.json intacto: es preferible mostrar
  // datos de hace unas horas a mostrar un archivo truncado.
  console.error('No se pudo actualizar el registro de sismos:', error.message);
  process.exit(1);
});
