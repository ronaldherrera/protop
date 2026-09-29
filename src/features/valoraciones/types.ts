import type { DesgloseValoracion } from '../../types/profesional'

export type EstadoValoracion = 'pendiente' | 'aprobada' | 'rechazada'

export type MiValoracion = {
  id: string
  profesionalNombre: string
  profesionalSlug: string
  estado: EstadoValoracion
  motivoRevision: string | null
  creadoEn: string
}

export type ValoracionPublica = {
  id: string
  descripcionTrabajo: string | null
  conceptos: DesgloseValoracion
  creadoEn: string
}

export type ValoracionParaRevision = {
  id: string
  profesionalId: string
  profesionalNombre: string
  particularNombre: string
  conceptos: DesgloseValoracion
  descripcionTrabajo: string | null
  facturaRuta: string
  estado: EstadoValoracion
  motivoRevision: string | null
  creadoEn: string
}
