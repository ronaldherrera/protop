import type { MediosContacto } from '../../types/profesional'

export type DatosCompletitud = {
  fotoPerfilUrl?: string | null
  descripcion: string
  especialidades: string[]
  fotosTrabajos: string[]
  contacto: MediosContacto
}

const TOTAL_PUNTOS = 5

/** 0-5: foto de perfil, descripción completa, especialidades, fotos de trabajos, más de un medio de contacto. */
export function calcularCompletitud(datos: DatosCompletitud): number {
  let puntos = 0
  if (datos.fotoPerfilUrl) puntos++
  if (datos.descripcion.trim().length > 0) puntos++
  if (datos.especialidades.length > 0) puntos++
  if (datos.fotosTrabajos.length > 0) puntos++
  if ([datos.contacto.telefono, datos.contacto.whatsapp, datos.contacto.email, datos.contacto.web].filter(Boolean).length > 1) {
    puntos++
  }
  return puntos
}

export function calcularCompletitudPorcentaje(datos: DatosCompletitud): number {
  return Math.round((calcularCompletitud(datos) / TOTAL_PUNTOS) * 100)
}
