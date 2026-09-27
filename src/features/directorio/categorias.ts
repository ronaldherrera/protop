import type { Categoria, Zona } from '../../types/profesional'

/**
 * En la Fase 1 viven como constantes locales. A partir de la Fase 2 pasan a
 * tablas de Supabase para que un administrador pueda gestionarlas sin tocar código.
 */
export const CATEGORIAS: Categoria[] = [
  { id: 'electricidad', nombre: 'Electricidad', slug: 'electricidad' },
  { id: 'fontaneria', nombre: 'Fontanería', slug: 'fontaneria' },
  { id: 'albanileria', nombre: 'Albañilería', slug: 'albanileria' },
  { id: 'pintura', nombre: 'Pintura', slug: 'pintura' },
  { id: 'carpinteria', nombre: 'Carpintería', slug: 'carpinteria' },
  { id: 'reformas-generales', nombre: 'Reformas generales', slug: 'reformas-generales' },
]

export const ZONAS: Zona[] = [
  { id: 'santander', nombre: 'Santander', slug: 'santander' },
  { id: 'camargo', nombre: 'Camargo', slug: 'camargo' },
  { id: 'el-astillero', nombre: 'El Astillero', slug: 'el-astillero' },
  { id: 'santa-cruz-de-bezana', nombre: 'Santa Cruz de Bezana', slug: 'santa-cruz-de-bezana' },
  { id: 'pielagos', nombre: 'Piélagos', slug: 'pielagos' },
  { id: 'castro-urdiales', nombre: 'Castro-Urdiales', slug: 'castro-urdiales' },
]

export function buscarCategoriaPorSlug(slug: string): Categoria | undefined {
  return CATEGORIAS.find((categoria) => categoria.slug === slug)
}

export function buscarZonaPorSlug(slug: string): Zona | undefined {
  return ZONAS.find((zona) => zona.slug === slug)
}
