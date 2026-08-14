// Agregados del registro de sismos (data/sismos.json). Todo se calcula en
// build time: la página que llega al navegador es HTML plano, sin JS de
// gráficos ni la lista completa de eventos — son cientos y el sitio lo abre
// gente con datos móviles contados.

export interface Sismo {
  id: string;
  utc: string;
  local: string;
  magnitud: number;
  tipoMagnitud: string | null;
  profundidadKm: number;
  lat: number;
  lon: number;
  lugar: string;
  sentidoPor: number;
  agencia: string | null;
  estado: string | null;
  actualizado: string | null;
}

// Epicentro del sismo principal, según la solución revisada del SGC.
export const EPICENTRO = { lat: 4.990934719865107, lon: -76.291741067906 };

// Radio para contar "cerca del epicentro". 100 km es una convención de
// lectura, no un criterio sismológico: sirve para separar la secuencia de
// réplicas del Chocó de la sismicidad normal del resto del país. Decir si un
// sismo es réplica o no es una determinación técnica que no nos corresponde.
export const RADIO_CERCANIA_KM = 100;

export function distanciaKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 6371;
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function cercaDelEpicentro(s: Sismo): boolean {
  return distanciaKm(EPICENTRO, s) <= RADIO_CERCANIA_KM;
}

/** El de mayor magnitud es el principal; el resto son los posteriores. */
export function separarPrincipal(sismos: Sismo[]) {
  const principal = sismos.reduce((max, s) => (s.magnitud > max.magnitud ? s : max), sismos[0]);
  const posteriores = sismos.filter((s) => s.id !== principal.id);
  return { principal, posteriores };
}

/**
 * Conteo por día calendario local. Se agrupa por el prefijo de la fecha en
 * hora de Colombia que ya trae el feed, en vez de convertir desde UTC: menos
 * aritmética de zonas horarias, menos formas de equivocarse.
 */
export function conteoPorDia(sismos: Sismo[]): { dia: string; total: number }[] {
  const mapa = new Map<string, number>();
  for (const s of sismos) {
    const dia = s.local.slice(0, 10);
    mapa.set(dia, (mapa.get(dia) ?? 0) + 1);
  }
  return [...mapa.entries()]
    .map(([dia, total]) => ({ dia, total }))
    .sort((a, b) => a.dia.localeCompare(b.dia));
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/**
 * "2026-08-10" → "10 ago". Se arma a mano en vez de con toLocaleDateString
 * porque es-CO devuelve "10 de ago", y ese "de" extra desborda las etiquetas
 * del eje X cuando hay muchos días.
 */
export function etiquetaDia(dia: string): string {
  const [, mes, d] = dia.split('-').map(Number);
  return `${d} ${MESES[mes - 1]}`;
}

/** "2026-08-10 07:34" → "10 ago, 7:34 a. m." */
export function fechaHoraLegible(local: string): string {
  const [fecha, hora] = local.split(' ');
  const [h, m] = hora.split(':').map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${etiquetaDia(fecha)}, ${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'a. m.' : 'p. m.'}`;
}

/**
 * IMPORTANTE — por qué se separa por cercanía y no se cuenta todo junto:
 * Colombia tiene sismicidad de fondo permanente que NO tiene nada que ver con
 * este terremoto. El nido sísmico de Los Santos (Santander) produce decenas
 * de eventos por semana desde siempre, y también aparecen Cundinamarca,
 * Tolima o Antioquia en el mismo feed. Sumarlos bajo el título "actividad
 * desde el terremoto" inflaría la cifra y le haría creer a la gente que
 * tiembla en todo el país por causa del sismo del Chocó.
 *
 * Por eso las cifras principales se calculan solo sobre los eventos cercanos
 * al epicentro, y el resto del país se reporta aparte y etiquetado como lo
 * que es: sismicidad normal del territorio.
 */
export function resumen(sismos: Sismo[]) {
  const { principal, posteriores } = separarPrincipal(sismos);
  const secuencia = posteriores.filter(cercaDelEpicentro);
  const restoDelPais = posteriores.filter((s) => !cercaDelEpicentro(s));

  const masFuerte = secuencia.length
    ? secuencia.reduce((max, s) => (s.magnitud > max.magnitud ? s : max), secuencia[0])
    : null;
  // Ordenados de más reciente a más antiguo por el script, así que el
  // primero es el último ocurrido.
  const ultimo = sismos[0];

  return {
    principal,
    // Eventos cercanos al epicentro: la secuencia que sí corresponde a este
    // terremoto. Es sobre esto que se calcula todo lo demás.
    secuencia,
    restoDelPais,
    ultimo,
    masFuerte,
    totalSecuencia: secuencia.length,
    totalRestoDelPais: restoDelPais.length,
    magnitud4oMas: secuencia.filter((s) => s.magnitud >= 4).length,
    // Perceptibles por la gente: a partir de M3 empiezan a sentirse cerca
    // del epicentro. Es una referencia divulgativa, no un umbral oficial.
    magnitud3oMas: secuencia.filter((s) => s.magnitud >= 3).length,
    reportadosPorGente: secuencia.filter((s) => s.sentidoPor > 0).length,
  };
}
