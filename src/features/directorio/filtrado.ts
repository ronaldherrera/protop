import { calcularCompletitud } from './completitud'
import type { Profesional } from '../../types/profesional'

export type FiltrosDirectorio = {
  categoria?: string
  /** Slugs de todas las categorías de una familia; se combina con `categoria` (AND). */
  categoriaSlugsFamilia?: string[]
  zona?: string
  texto?: string
}

export function filtrarProfesionales(
  profesionales: Profesional[],
  filtros: FiltrosDirectorio,
): Profesional[] {
  const texto = filtros.texto?.trim().toLowerCase()

  return profesionales.filter((profesional) => {
    const slugsOficios = profesional.oficios.map((oficio) => oficio.slug)

    if (filtros.categoria && !slugsOficios.includes(filtros.categoria)) {
      return false
    }

    if (filtros.categoriaSlugsFamilia && !slugsOficios.some((slug) => filtros.categoriaSlugsFamilia?.includes(slug))) {
      return false
    }

    if (filtros.zona && !profesional.zonasTrabajo.includes(filtros.zona)) {
      return false
    }

    if (texto) {
      const enNombre = profesional.nombreComercial.toLowerCase().includes(texto)
      const enEspecialidades = profesional.especialidades.some((especialidad) =>
        especialidad.toLowerCase().includes(texto),
      )
      if (!enNombre && !enEspecialidades) {
        return false
      }
    }

    return true
  })
}

/**
 * Orden por defecto: patrocinados primero (dejando hueco suficiente para
 * resultados orgánicos), después por puntuación y nº de trabajos valorados.
 * Los perfiles sin valoraciones se muestran al final, no penalizados a cero.
 * En cada empate (incluido entre perfiles nuevos, que empatan a 0 trabajos),
 * desempata quién tiene el perfil más completo — así "cuanto más completo,
 * más visibilidad" es real, no solo un mensaje motivacional.
 */
export function ordenarProfesionales(profesionales: Profesional[]): Profesional[] {
  return [...profesionales].sort((a, b) => {
    if (a.patrocinado !== b.patrocinado) {
      return a.patrocinado ? -1 : 1
    }

    if (a.puntuacionGlobal === null && b.puntuacionGlobal === null) {
      if (b.trabajosValorados !== a.trabajosValorados) return b.trabajosValorados - a.trabajosValorados
      return calcularCompletitud(b) - calcularCompletitud(a)
    }
    if (a.puntuacionGlobal === null) return 1
    if (b.puntuacionGlobal === null) return -1

    if (b.puntuacionGlobal !== a.puntuacionGlobal) {
      return b.puntuacionGlobal - a.puntuacionGlobal
    }
    if (b.trabajosValorados !== a.trabajosValorados) return b.trabajosValorados - a.trabajosValorados
    return calcularCompletitud(b) - calcularCompletitud(a)
  })
}
