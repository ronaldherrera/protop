import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabaseClient'
import type { MediosContacto } from '../../types/profesional'

export type NegocioCandidato = {
  id: string
  nombre: string
  categoriaId: string | null
  zonaId: string | null
  localidad: string
  descripcionBreve: string
  contacto: MediosContacto
  direccion: string | null
  fuenteDatos: string
  enlaceFuente: string | null
  avisos: string | null
}

export type DatosPublicacion = {
  id: string
  nombre: string
  categoriaId: string
  zonaId: string | null
  localidad: string
  descripcionBreve: string
  contacto: MediosContacto
}

/** Cuántos candidatos se revisan a la vez: según se publican o descartan, entran los siguientes. */
export const CANDIDATOS_POR_TANDA = 50

/** Candidatos pendientes de revisar. Si la tabla aún no existe (migración sin aplicar), lista vacía. */
async function obtenerCandidatosPendientes(): Promise<NegocioCandidato[]> {
  const { data, error } = await supabase
    .from('negocios_candidatos')
    .select('id, nombre, categoria_id, zona_id, localidad, descripcion_breve, contacto, direccion, fuente_datos, enlace_fuente, avisos')
    .eq('estado', 'pendiente')
    .order('localidad')
    .order('nombre')
    .limit(CANDIDATOS_POR_TANDA)
  if (error) {
    if (error.code === '42P01' || error.code === 'PGRST205') return []
    throw error
  }
  return data.map((fila) => ({
    id: fila.id,
    nombre: fila.nombre,
    categoriaId: fila.categoria_id,
    zonaId: fila.zona_id,
    localidad: fila.localidad,
    descripcionBreve: fila.descripcion_breve,
    contacto: (fila.contacto ?? {}) as MediosContacto,
    direccion: fila.direccion,
    fuenteDatos: fila.fuente_datos,
    enlaceFuente: fila.enlace_fuente,
    avisos: fila.avisos,
  }))
}

async function publicarCandidato(datos: DatosPublicacion): Promise<string> {
  const { data, error } = await supabase.rpc('publicar_negocio_candidato', {
    p_id: datos.id,
    p_nombre: datos.nombre,
    p_categoria_id: datos.categoriaId,
    p_zona_id: datos.zonaId,
    p_localidad: datos.localidad,
    p_descripcion_breve: datos.descripcionBreve,
    p_contacto: datos.contacto,
  })
  if (error) throw error
  return data
}

async function descartarCandidato(id: string): Promise<void> {
  const { error } = await supabase
    .from('negocios_candidatos')
    .update({ estado: 'descartado', revisado_en: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export function useCandidatosPendientes() {
  return useQuery({ queryKey: ['negocios-candidatos'], queryFn: obtenerCandidatosPendientes })
}

function useAlTerminar() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['negocios-candidatos'] })
    queryClient.invalidateQueries({ queryKey: ['admin-pendientes'] })
    queryClient.invalidateQueries({ queryKey: ['profesionales'] })
  }
}

export function usePublicarCandidato() {
  const alTerminar = useAlTerminar()
  return useMutation({ mutationFn: publicarCandidato, onSuccess: alTerminar })
}

export function useDescartarCandidato() {
  const alTerminar = useAlTerminar()
  return useMutation({ mutationFn: descartarCandidato, onSuccess: alTerminar })
}
