import { supabase } from '../../lib/supabaseClient'
import type {
  Aclaracion,
  DatosPropuesta,
  DatosSolicitud,
  EstadoSolicitud,
  Propuesta,
  Solicitud,
  TipoPropuesta,
} from './types'

const SELECT_SOLICITUD = `
  id, particular_id, titulo, descripcion, medidas_cantidades, fecha_deseada, informacion_adicional,
  fotos, estado, created_at,
  categorias ( id, nombre, slug ),
  zonas ( id, nombre, slug )
`

type FilaSolicitud = {
  id: string
  particular_id: string
  titulo: string
  descripcion: string
  medidas_cantidades: string | null
  fecha_deseada: string | null
  informacion_adicional: string | null
  fotos: string[]
  estado: string
  created_at: string
  categorias: { id: string; nombre: string; slug: string } | null
  zonas: { id: string; nombre: string; slug: string } | null
}

function mapearSolicitud(fila: FilaSolicitud): Solicitud {
  return {
    id: fila.id,
    particularId: fila.particular_id,
    titulo: fila.titulo,
    categoriaId: fila.categorias?.id ?? '',
    categoriaNombre: fila.categorias?.nombre ?? '',
    categoriaSlug: fila.categorias?.slug ?? '',
    zonaId: fila.zonas?.id ?? '',
    zonaNombre: fila.zonas?.nombre ?? '',
    zonaSlug: fila.zonas?.slug ?? '',
    descripcion: fila.descripcion,
    medidasCantidades: fila.medidas_cantidades,
    fechaDeseada: fila.fecha_deseada,
    informacionAdicional: fila.informacion_adicional,
    fotos: fila.fotos,
    estado: fila.estado as EstadoSolicitud,
    creadoEn: fila.created_at,
  }
}

export async function crearBorradorSolicitud(userId: string, datos: DatosSolicitud): Promise<string> {
  const { data, error } = await supabase
    .from('solicitudes')
    .insert({
      particular_id: userId,
      titulo: datos.titulo,
      categoria_id: datos.categoriaId,
      zona_id: datos.zonaId,
      descripcion: datos.descripcion,
      medidas_cantidades: datos.medidasCantidades || null,
      fecha_deseada: datos.fechaDeseada || null,
      informacion_adicional: datos.informacionAdicional || null,
      fotos: datos.fotos,
    })
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

export async function obtenerMisSolicitudes(userId: string): Promise<Solicitud[]> {
  const { data, error } = await supabase
    .from('solicitudes')
    .select(SELECT_SOLICITUD)
    .eq('particular_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as unknown as FilaSolicitud[]).map(mapearSolicitud)
}

export async function obtenerSolicitud(id: string): Promise<Solicitud | null> {
  const { data, error } = await supabase.from('solicitudes').select(SELECT_SOLICITUD).eq('id', id).maybeSingle()
  if (error) throw error
  return data ? mapearSolicitud(data as unknown as FilaSolicitud) : null
}

export async function obtenerSolicitudesDisponibles(): Promise<Solicitud[]> {
  const { data, error } = await supabase
    .from('solicitudes')
    .select(SELECT_SOLICITUD)
    .eq('estado', 'abierta')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as unknown as FilaSolicitud[]).map(mapearSolicitud)
}

export async function obtenerSolicitudesPendientesPago(): Promise<Solicitud[]> {
  const { data, error } = await supabase
    .from('solicitudes')
    .select(SELECT_SOLICITUD)
    .eq('estado', 'pendiente_pago')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data as unknown as FilaSolicitud[]).map(mapearSolicitud)
}

export async function enviarAPago(id: string): Promise<void> {
  const { error } = await supabase.from('solicitudes').update({ estado: 'pendiente_pago' }).eq('id', id)
  if (error) throw error
}

export async function cerrarSolicitud(id: string): Promise<void> {
  const { error } = await supabase.from('solicitudes').update({ estado: 'cerrada' }).eq('id', id)
  if (error) throw error
}

/** Acción manual de administración mientras no exista el cobro real (Fase 6). */
export async function abrirSolicitudManualmente(id: string): Promise<void> {
  const { error } = await supabase.from('solicitudes').update({ estado: 'abierta' }).eq('id', id)
  if (error) throw error
}

const SELECT_PROPUESTA = `
  id, solicitud_id, profesional_id, alcance_trabajo, importe_orientativo, desglose,
  materiales_incluidos, mano_obra, tratamiento_impuestos, exclusiones, plazo_aproximado,
  necesita_visita, aspectos_pendientes, valida_hasta, tipo, created_at,
  profesionales ( nombre_comercial, slug, puntuacion_global, trabajos_valorados )
`

type FilaPropuesta = {
  id: string
  solicitud_id: string
  profesional_id: string
  alcance_trabajo: string
  importe_orientativo: number
  desglose: string | null
  materiales_incluidos: string | null
  mano_obra: string | null
  tratamiento_impuestos: string
  exclusiones: string | null
  plazo_aproximado: string
  necesita_visita: boolean
  aspectos_pendientes: string | null
  valida_hasta: string
  tipo: string
  created_at: string
  profesionales: {
    nombre_comercial: string
    slug: string
    puntuacion_global: number | null
    trabajos_valorados: number
  } | null
}

function mapearPropuesta(fila: FilaPropuesta): Propuesta {
  return {
    id: fila.id,
    solicitudId: fila.solicitud_id,
    profesionalId: fila.profesional_id,
    profesionalNombre: fila.profesionales?.nombre_comercial ?? '',
    profesionalSlug: fila.profesionales?.slug ?? '',
    profesionalPuntuacion: fila.profesionales?.puntuacion_global ?? null,
    profesionalTrabajosValorados: fila.profesionales?.trabajos_valorados ?? 0,
    alcanceTrabajo: fila.alcance_trabajo,
    importeOrientativo: fila.importe_orientativo,
    desglose: fila.desglose,
    materialesIncluidos: fila.materiales_incluidos,
    manoObra: fila.mano_obra,
    tratamientoImpuestos: fila.tratamiento_impuestos,
    exclusiones: fila.exclusiones,
    plazoAproximado: fila.plazo_aproximado,
    necesitaVisita: fila.necesita_visita,
    aspectosPendientes: fila.aspectos_pendientes,
    validaHasta: fila.valida_hasta,
    tipo: fila.tipo as TipoPropuesta,
    creadoEn: fila.created_at,
  }
}

export async function obtenerPropuestasDeSolicitud(solicitudId: string): Promise<Propuesta[]> {
  const { data, error } = await supabase
    .from('propuestas')
    .select(SELECT_PROPUESTA)
    .eq('solicitud_id', solicitudId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data as unknown as FilaPropuesta[]).map(mapearPropuesta)
}

export async function obtenerMiPropuesta(solicitudId: string, profesionalId: string): Promise<Propuesta | null> {
  const { data, error } = await supabase
    .from('propuestas')
    .select(SELECT_PROPUESTA)
    .eq('solicitud_id', solicitudId)
    .eq('profesional_id', profesionalId)
    .maybeSingle()
  if (error) throw error
  return data ? mapearPropuesta(data as unknown as FilaPropuesta) : null
}

export async function enviarPropuesta(
  solicitudId: string,
  profesionalId: string,
  datos: DatosPropuesta,
): Promise<void> {
  const { error } = await supabase.from('propuestas').insert({
    solicitud_id: solicitudId,
    profesional_id: profesionalId,
    alcance_trabajo: datos.alcanceTrabajo,
    importe_orientativo: datos.importeOrientativo,
    desglose: datos.desglose || null,
    materiales_incluidos: datos.materialesIncluidos || null,
    mano_obra: datos.manoObra || null,
    tratamiento_impuestos: datos.tratamientoImpuestos,
    exclusiones: datos.exclusiones || null,
    plazo_aproximado: datos.plazoAproximado,
    necesita_visita: datos.necesitaVisita,
    aspectos_pendientes: datos.aspectosPendientes || null,
    valida_hasta: datos.validaHasta,
    tipo: datos.tipo,
  })
  if (error) throw error
}

export async function obtenerAclaraciones(solicitudId: string): Promise<Aclaracion[]> {
  const { data, error } = await supabase
    .from('aclaraciones')
    .select('id, autor_id, mensaje, created_at, perfiles ( nombre )')
    .eq('solicitud_id', solicitudId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data.map((fila) => ({
    id: fila.id,
    autorId: fila.autor_id,
    autorNombre: fila.perfiles?.nombre ?? '',
    mensaje: fila.mensaje,
    creadoEn: fila.created_at,
  }))
}

export async function enviarAclaracion(solicitudId: string, userId: string, mensaje: string): Promise<void> {
  const { error } = await supabase
    .from('aclaraciones')
    .insert({ solicitud_id: solicitudId, autor_id: userId, mensaje })
  if (error) throw error
}
