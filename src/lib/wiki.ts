import type { CollectionEntry } from 'astro:content';

export type Ambito = 'nacional' | 'departamento' | 'municipio';

export interface ParsedWikiSlug {
  ambito: Ambito;
  categoriaSlug: string;
  departamentoSlug?: string;
  municipioSlug?: string;
}

// El alcance de una entrada (nacional/departamento/municipio) se deriva
// SIEMPRE de la ruta del archivo, nunca de un campo de frontmatter — mismo
// principio por el que `estado` es un campo explícito y no texto libre: una
// sola fuente de verdad, imposible de desincronizar.
export function parseWikiSlug(slug: string): ParsedWikiSlug {
  const parts = slug.split('/');

  if (parts[0] !== 'departamentos') {
    return { ambito: 'nacional', categoriaSlug: parts[0] };
  }
  if (parts.length === 3) {
    const [, departamentoSlug, categoriaSlug] = parts;
    return { ambito: 'departamento', departamentoSlug, categoriaSlug };
  }
  if (parts.length === 4) {
    const [, departamentoSlug, municipioSlug, categoriaSlug] = parts;
    return { ambito: 'municipio', departamentoSlug, municipioSlug, categoriaSlug };
  }
  throw new Error(`slug de wiki con forma inesperada: "${slug}"`);
}

export function entriesForDepartamento(
  entries: CollectionEntry<'wiki'>[],
  departamentoSlug: string,
) {
  const nacional = entries.filter((e) => parseWikiSlug(e.slug).ambito === 'nacional');
  const departamento = entries.filter((e) => {
    const p = parseWikiSlug(e.slug);
    return p.ambito === 'departamento' && p.departamentoSlug === departamentoSlug;
  });
  const municipiosSlugs = [
    ...new Set(
      entries
        .map((e) => parseWikiSlug(e.slug))
        .filter((p) => p.ambito === 'municipio' && p.departamentoSlug === departamentoSlug)
        .map((p) => p.municipioSlug!),
    ),
  ];
  return { nacional, departamento, municipiosSlugs };
}

export function entriesForMunicipio(
  entries: CollectionEntry<'wiki'>[],
  departamentoSlug: string,
  municipioSlug: string,
) {
  const nacional = entries.filter((e) => parseWikiSlug(e.slug).ambito === 'nacional');
  const departamento = entries.filter((e) => {
    const p = parseWikiSlug(e.slug);
    return p.ambito === 'departamento' && p.departamentoSlug === departamentoSlug;
  });
  const municipio = entries.filter((e) => {
    const p = parseWikiSlug(e.slug);
    return (
      p.ambito === 'municipio' &&
      p.departamentoSlug === departamentoSlug &&
      p.municipioSlug === municipioSlug
    );
  });
  return { nacional, departamento, municipio };
}
