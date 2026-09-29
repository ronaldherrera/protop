import { subirFactura } from '../../lib/storage'
import { supabase } from '../../lib/supabaseClient'
import type { DesgloseValoracion } from '../../types/profesional'
import type { EstadoValoracion, MiValoracion, ValoracionParaRevision, ValoracionPublica } from './types'

export async function enviarValoracion(
  userId: string,
  profesionalId: string,
  conceptos: DesgloseValoracion,
  descripcionTrabajo: string,
  factura: File,
): Promise<void> {
  const facturaRuta = await subirFactura(userId, factura)

  const { error } = await supabase.from('valoraciones').insert({
    profesional_id: profesionalId,
    particular_id: userId,
    factura_ruta: facturaRuta,
    descripcion_trabajo: descripcionTrabajo || null,
    ...conceptos,
  })
  if (error) throw error
}

export async function obtenerMisValoraciones(userId: string): Promise<MiValoracion[]> {
  const { data, error } = await supabase
    .from('valoraciones')
    .select('id, estado, motivo_revision, created_at, profesionales ( nombre_comercial, slug )')
    .eq('particular_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error

  return data.map((fila) => ({
    id: fila.id,
    profesionalNombre: fila.profesionales?.nombre_comercial ?? '',
    profesionalSlug: fila.profesionales?.slug ?? '',
    estado: fila.estado as EstadoValoracion,
    motivoRevision: fila.motivo_revision,
    creadoEn: fila.created_at,
  }))
}

const CONCEPTOS_DB = [
  'calidad_acabado',
  'puntualidad',
  'cumplimiento_plazos',
  'limpieza_cuidado',
  'comunicacion',
  'respeto_presupuesto',
] as const

export async function obtenerValoracionesParaRevision(): Promise<ValoracionParaRevision[]> {
  const { data, error } = await supabase
    .from('valoraciones')
    .select(
      `id, profesional_id, descripcion_trabajo, factura_ruta, estado, motivo_revision, created_at,
       calidad_acabado, puntualidad, cumplimiento_plazos, limpieza_cuidado, comunicacion, respeto_presupuesto,
       profesionales ( nombre_comercial ),
       perfiles ( nombre )`,
    )
    .order('created_at', { ascending: true })
  if (error) throw error

  return data.map((fila) => {
    const conceptos: DesgloseValoracion = {}
    for (const clave of CONCEPTOS_DB) {
      const valor = fila[clave]
      if (valor !== null) conceptos[clave] = valor
    }

    return {
      id: fila.id,
      profesionalId: fila.profesional_id,
      profesionalNombre: fila.profesionales?.nombre_comercial ?? '',
      particularNombre: fila.perfiles?.nombre ?? '',
      conceptos,
      descripcionTrabajo: fila.descripcion_trabajo,
      facturaRuta: fila.factura_ruta,
      estado: fila.estado as EstadoValoracion,
      motivoRevision: fila.motivo_revision,
      creadoEn: fila.created_at,
    }
  })
}

/**
 * Detalle público de las valoraciones aprobadas de un profesional (vista
 * `valoraciones_publicas`, que expone solo lo seguro: nunca quién la
 * escribió ni la factura).
 */
export async function obtenerValoracionesPublicas(profesionalId: string): Promise<ValoracionPublica[]> {
  const { data, error } = await supabase
    .from('valoraciones_publicas')
    .select(
      'id, descripcion_trabajo, created_at, calidad_acabado, puntualidad, cumplimiento_plazos, limpieza_cuidado, comunicacion, respeto_presupuesto',
    )
    .eq('profesional_id', profesionalId)
    .order('created_at', { ascending: false })
  if (error) throw error

  return data.map((fila) => {
    const conceptos: DesgloseValoracion = {}
    for (const clave of CONCEPTOS_DB) {
      const valor = fila[clave]
      if (valor !== null) conceptos[clave] = valor
    }
    return {
      // La vista marca todas las columnas como nullable (Postgres no lo sabe
      // de un view), pero id/created_at nunca lo son en la tabla base.
      id: fila.id as string,
      descripcionTrabajo: fila.descripcion_trabajo,
      conceptos,
      creadoEn: fila.created_at as string,
    }
  })
}

export async function revisarValoracion(
  id: string,
  userId: string,
  estado: 'aprobada' | 'rechazada',
  motivoRevision: string | null,
): Promise<void> {
  const { error } = await supabase
    .from('valoraciones')
    .update({
      estado,
      motivo_revision: motivoRevision,
      revisado_por: userId,
      revisado_en: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) throw error
}
