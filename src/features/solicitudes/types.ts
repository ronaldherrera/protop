export type EstadoSolicitud = 'borrador' | 'pendiente_pago' | 'abierta' | 'cerrada'
export type TipoPropuesta = 'estimacion' | 'confirmada'

export type Solicitud = {
  id: string
  particularId: string
  titulo: string
  categoriaId: string
  categoriaNombre: string
  categoriaSlug: string
  zonaId: string
  zonaNombre: string
  zonaSlug: string
  descripcion: string
  medidasCantidades: string | null
  fechaDeseada: string | null
  informacionAdicional: string | null
  fotos: string[]
  estado: EstadoSolicitud
  creadoEn: string
}

export type DatosSolicitud = {
  titulo: string
  categoriaId: string
  zonaId: string
  descripcion: string
  medidasCantidades: string
  fechaDeseada: string
  informacionAdicional: string
  fotos: string[]
}

export type Propuesta = {
  id: string
  solicitudId: string
  profesionalId: string
  profesionalNombre: string
  profesionalSlug: string
  profesionalPuntuacion: number | null
  profesionalTrabajosValorados: number
  alcanceTrabajo: string
  importeOrientativo: number
  desglose: string | null
  materialesIncluidos: string | null
  manoObra: string | null
  tratamientoImpuestos: string
  exclusiones: string | null
  plazoAproximado: string
  necesitaVisita: boolean
  aspectosPendientes: string | null
  validaHasta: string
  tipo: TipoPropuesta
  creadoEn: string
}

export type PropuestaConSolicitud = Propuesta & {
  solicitudTitulo: string
  solicitudEstado: EstadoSolicitud
  solicitudCategoriaNombre: string
  solicitudZonaNombre: string
}

export type DatosPropuesta = {
  alcanceTrabajo: string
  importeOrientativo: number
  desglose: string
  materialesIncluidos: string
  manoObra: string
  tratamientoImpuestos: string
  exclusiones: string
  plazoAproximado: string
  necesitaVisita: boolean
  aspectosPendientes: string
  validaHasta: string
  tipo: TipoPropuesta
}

export type Aclaracion = {
  id: string
  autorId: string
  autorNombre: string
  mensaje: string
  creadoEn: string
}
