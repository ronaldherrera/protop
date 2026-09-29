import { coincideZona } from '../directorio/filtrado'
import type { Zona } from '../../types/profesional'
import type { Solicitud } from './types'

/**
 * ¿Esta solicitud es de un oficio y una zona en los que trabaja el
 * profesional? (Para el chip "Para ti" del muro — no es una restricción de
 * acceso, esa la impone la base de datos al enviar la propuesta.)
 */
export function solicitudEncajaConProfesional(
  solicitud: Solicitud,
  categoriaIds: string[],
  zonaSlugsProfesional: string[],
  zonas: Zona[],
): boolean {
  if (!categoriaIds.includes(solicitud.categoriaId)) return false
  const zonasPorSlug = new Map(zonas.map((z) => [z.slug, z]))
  return coincideZona(solicitud.zonaSlug, zonaSlugsProfesional, zonasPorSlug)
}
