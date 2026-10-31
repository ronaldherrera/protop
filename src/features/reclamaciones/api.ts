import { supabase } from '../../lib/supabaseClient'
import type { MediosContacto } from '../../types/profesional'

export type DatosFichaSinReclamar = {
  nombreComercial: string
  categoriaIds: string[]
  zonaIds: string[]
  localidad: string
  descripcionBreve: string
  contacto: MediosContacto
  /** De dónde salen los datos (web propia, Google Maps…): el RGPD obliga a poder decirlo. */
  fuenteDatos: string
}

/** Administración: crea la ficha de un negocio que aún no está en Protop. Devuelve su slug. */
export async function crearFichaSinReclamar(datos: DatosFichaSinReclamar): Promise<string> {
  const { data, error } = await supabase.rpc('crear_ficha_sin_reclamar', {
    p_nombre_comercial: datos.nombreComercial,
    p_categoria_ids: datos.categoriaIds,
    p_zona_ids: datos.zonaIds,
    p_localidad: datos.localidad,
    p_descripcion_breve: datos.descripcionBreve,
    p_contacto: datos.contacto,
    p_fuente_datos: datos.fuenteDatos,
  })
  if (error) throw error
  return data
}

export type ResultadoReclamacion =
  | 'reclamada'
  | 'en_revision'
  | 'ya_es_tuya'
  | 'ya_reclamada'
  | 'ya_tienes_ficha'
  | 'no_reclamable'

export async function reclamarFicha(profesionalId: string, mensaje?: string): Promise<ResultadoReclamacion> {
  const { data, error } = await supabase.rpc('reclamar_ficha', { p_profesional_id: profesionalId, p_mensaje: mensaje })
  if (error) throw error
  return data as ResultadoReclamacion
}

export type ReclamacionPendiente = {
  id: string
  nombreComercial: string
  slug: string
  emailFicha: string | null
  emailCuenta: string
  mensaje: string | null
  creadaEn: string
}

type FilaReclamacion = {
  id: string
  email_cuenta: string
  mensaje: string | null
  created_at: string
  profesionales: { nombre_comercial: string; slug: string; contacto: unknown } | null
}

export async function obtenerReclamacionesPendientes(): Promise<ReclamacionPendiente[]> {
  const { data, error } = await supabase
    .from('reclamaciones_ficha')
    .select('id, email_cuenta, mensaje, created_at, profesionales ( nombre_comercial, slug, contacto )')
    .eq('estado', 'revision')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data as unknown as FilaReclamacion[]).map((fila) => ({
    id: fila.id,
    nombreComercial: fila.profesionales?.nombre_comercial ?? '—',
    slug: fila.profesionales?.slug ?? '',
    emailFicha: (fila.profesionales?.contacto as MediosContacto | null)?.email ?? null,
    emailCuenta: fila.email_cuenta,
    mensaje: fila.mensaje,
    creadaEn: fila.created_at,
  }))
}

export async function resolverReclamacion(id: string, aprobar: boolean, motivo?: string): Promise<void> {
  const { error } = await supabase.rpc('resolver_reclamacion', {
    p_reclamacion_id: id,
    p_aprobar: aprobar,
    p_motivo: motivo,
  })
  if (error) throw error
}

/** Cualquiera (sin cuenta) puede pedir que se borre una ficha creada por Protop. */
export async function pedirBajaFicha(profesionalId: string, contacto: string, motivo: string): Promise<void> {
  const { error } = await supabase
    .from('bajas_ficha')
    .insert({ profesional_id: profesionalId, contacto: contacto.trim(), motivo: motivo.trim() || null })
  if (error) throw error
}

export type PeticionBaja = {
  id: string
  profesionalId: string
  nombreComercial: string
  slug: string
  contacto: string
  motivo: string | null
  creadaEn: string
}

type FilaBaja = {
  id: string
  profesional_id: string
  contacto: string
  motivo: string | null
  created_at: string
  profesionales: { nombre_comercial: string; slug: string } | null
}

export async function obtenerPeticionesBaja(): Promise<PeticionBaja[]> {
  const { data, error } = await supabase
    .from('bajas_ficha')
    .select('id, profesional_id, contacto, motivo, created_at, profesionales ( nombre_comercial, slug )')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data as unknown as FilaBaja[]).map((fila) => ({
    id: fila.id,
    profesionalId: fila.profesional_id,
    nombreComercial: fila.profesionales?.nombre_comercial ?? '—',
    slug: fila.profesionales?.slug ?? '',
    contacto: fila.contacto,
    motivo: fila.motivo,
    creadaEn: fila.created_at,
  }))
}

/** Atiende una petición de baja: borra la ficha (y con ella la petición). */
export async function borrarFichaSinReclamar(profesionalId: string): Promise<void> {
  const { error } = await supabase.rpc('borrar_ficha_sin_reclamar', { p_profesional_id: profesionalId })
  if (error) throw error
}

/** Descarta una petición de baja sin borrar la ficha (por ejemplo, si la pide alguien ajeno al negocio). */
export async function descartarPeticionBaja(id: string): Promise<void> {
  const { error } = await supabase.from('bajas_ficha').delete().eq('id', id)
  if (error) throw error
}
