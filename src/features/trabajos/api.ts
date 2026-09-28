import { supabase } from '../../lib/supabaseClient'
import type { DatosTrabajo, TrabajoPublicado, TrabajoVinculado } from './types'

const SELECT_TRABAJO = `
  id, profesional_id, titulo, descripcion, fotos, realizado_en, cliente_id, created_at,
  trabajo_comentarios ( id, comentario, created_at, perfiles ( nombre ) )
`

type FilaTrabajo = {
  id: string
  profesional_id: string
  titulo: string
  descripcion: string | null
  fotos: string[]
  realizado_en: string | null
  cliente_id: string | null
  created_at: string
  trabajo_comentarios:
    | { id: string; comentario: string; created_at: string; perfiles: { nombre: string } | null }[]
    | null
}

function mapearTrabajo(fila: FilaTrabajo): TrabajoPublicado {
  const comentario = fila.trabajo_comentarios?.[0]
  return {
    id: fila.id,
    profesionalId: fila.profesional_id,
    titulo: fila.titulo,
    descripcion: fila.descripcion,
    fotos: fila.fotos,
    realizadoEn: fila.realizado_en,
    clienteId: fila.cliente_id,
    comentario: comentario
      ? {
          id: comentario.id,
          autorNombre: comentario.perfiles?.nombre ?? '',
          comentario: comentario.comentario,
          creadoEn: comentario.created_at,
        }
      : null,
    creadoEn: fila.created_at,
  }
}

export async function obtenerTrabajosDeProfesional(profesionalId: string): Promise<TrabajoPublicado[]> {
  const { data, error } = await supabase
    .from('trabajos_publicados')
    .select(SELECT_TRABAJO)
    .eq('profesional_id', profesionalId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as unknown as FilaTrabajo[]).map(mapearTrabajo)
}

export async function crearTrabajo(profesionalId: string, datos: DatosTrabajo): Promise<void> {
  const { error } = await supabase.from('trabajos_publicados').insert({
    profesional_id: profesionalId,
    titulo: datos.titulo,
    descripcion: datos.descripcion || null,
    fotos: datos.fotos,
    realizado_en: datos.realizadoEn || null,
  })
  if (error) throw error
}

export async function actualizarTrabajo(id: string, datos: DatosTrabajo): Promise<void> {
  const { error } = await supabase
    .from('trabajos_publicados')
    .update({
      titulo: datos.titulo,
      descripcion: datos.descripcion || null,
      fotos: datos.fotos,
      realizado_en: datos.realizadoEn || null,
    })
    .eq('id', id)
  if (error) throw error
}

export async function borrarTrabajo(id: string): Promise<void> {
  const { error } = await supabase.from('trabajos_publicados').delete().eq('id', id)
  if (error) throw error
}

export async function vincularClientePorEmail(trabajoId: string, email: string): Promise<void> {
  const { error } = await supabase.rpc('vincular_cliente_trabajo', {
    trabajo_id_param: trabajoId,
    email_cliente: email,
  })
  if (error) throw error
}

export async function obtenerTrabajosVinculados(userId: string): Promise<TrabajoVinculado[]> {
  const { data, error } = await supabase
    .from('trabajos_publicados')
    .select(`${SELECT_TRABAJO}, profesionales ( nombre_comercial, slug )`)
    .eq('cliente_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as unknown as (FilaTrabajo & { profesionales: { nombre_comercial: string; slug: string } | null })[]).map(
    (fila) => ({
      ...mapearTrabajo(fila),
      profesionalNombre: fila.profesionales?.nombre_comercial ?? '',
      profesionalSlug: fila.profesionales?.slug ?? '',
    }),
  )
}

export async function comentarTrabajo(trabajoId: string, userId: string, comentario: string): Promise<void> {
  const { error } = await supabase
    .from('trabajo_comentarios')
    .insert({ trabajo_id: trabajoId, autor_id: userId, comentario })
  if (error) throw error
}
