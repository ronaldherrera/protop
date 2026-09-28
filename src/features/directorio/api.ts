import { supabase } from '../../lib/supabaseClient'
import type {
  Categoria,
  Distintivo,
  Especialidad,
  Familia,
  MediosContacto,
  Profesional,
  Zona,
} from '../../types/profesional'
import type { Database } from '../../types/database'

type CategoriaEmbebida = Pick<Database['public']['Tables']['categorias']['Row'], 'id' | 'slug' | 'nombre' | 'icono_url'>

type FilaProfesional = Database['public']['Tables']['profesionales']['Row'] & {
  categorias: Pick<Database['public']['Tables']['categorias']['Row'], 'slug' | 'nombre' | 'icono_url'> | null
  profesional_zonas: { zonas: Pick<Database['public']['Tables']['zonas']['Row'], 'slug' | 'nombre'> | null }[]
  profesional_categorias: { categorias: CategoriaEmbebida | null }[]
}

const SELECT_PROFESIONAL = `
  id, slug, nombre_comercial, especialidades, localidad,
  descripcion_breve, descripcion, foto_perfil_url, fotos_trabajos,
  contacto, puntuacion_global, trabajos_valorados, desglose_por_concepto,
  distintivos, patrocinado, es_demo,
  categorias!profesionales_categoria_id_fkey ( slug, nombre, icono_url ),
  profesional_zonas ( zonas ( slug, nombre ) ),
  profesional_categorias ( categorias!profesional_categorias_categoria_id_fkey ( id, slug, nombre, icono_url ) )
`

function mapearProfesional(fila: FilaProfesional): Profesional {
  const zonas = fila.profesional_zonas.map((pz) => pz.zonas).filter((zona): zona is { slug: string; nombre: string } => Boolean(zona))

  const oficiosSinOrdenar = fila.profesional_categorias
    .map((pc) => pc.categorias)
    .filter((categoria): categoria is CategoriaEmbebida => Boolean(categoria))
    .map((categoria) => ({
      id: categoria.id,
      slug: categoria.slug,
      nombre: categoria.nombre,
      iconoUrl: categoria.icono_url,
    }))
  // El oficio principal (categoria_id) siempre va primero, si está entre los oficios.
  const oficios = [
    ...oficiosSinOrdenar.filter((o) => o.slug === fila.categorias?.slug),
    ...oficiosSinOrdenar.filter((o) => o.slug !== fila.categorias?.slug),
  ]

  return {
    id: fila.id,
    slug: fila.slug,
    nombreComercial: fila.nombre_comercial,
    oficioPrincipal: fila.categorias?.slug ?? '',
    categoriaNombre: fila.categorias?.nombre ?? '',
    categoriaIconoUrl: fila.categorias?.icono_url ?? null,
    oficios,
    especialidades: fila.especialidades as unknown as Especialidad[],
    localidad: fila.localidad,
    zonasTrabajo: zonas.map((zona) => zona.slug),
    zonasTrabajoNombres: zonas.map((zona) => zona.nombre),
    descripcionBreve: fila.descripcion_breve,
    descripcion: fila.descripcion,
    fotoPerfilUrl: fila.foto_perfil_url ?? undefined,
    fotosTrabajos: fila.fotos_trabajos,
    contacto: (fila.contacto ?? {}) as MediosContacto,
    puntuacionGlobal: fila.puntuacion_global,
    trabajosValorados: fila.trabajos_valorados,
    desglosePorConcepto: fila.desglose_por_concepto as Profesional['desglosePorConcepto'],
    distintivos: fila.distintivos as Distintivo[],
    patrocinado: fila.patrocinado,
    esDemo: fila.es_demo,
  }
}

export async function obtenerFamilias(): Promise<Familia[]> {
  const { data, error } = await supabase.from('familias').select('id, nombre, slug, icono_url').order('orden')
  if (error) throw error
  return data.map((f) => ({ id: f.id, nombre: f.nombre, slug: f.slug, iconoUrl: f.icono_url }))
}

export async function obtenerCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nombre, slug, icono_url, familia_id')
    .order('orden')
  if (error) throw error
  return data.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    slug: c.slug,
    iconoUrl: c.icono_url,
    familiaId: c.familia_id,
  }))
}

const TAMANO_PAGINA_ZONAS = 1000

export async function obtenerZonas(): Promise<Zona[]> {
  // Son más de 8000 (todas las comunidades y municipios de España): PostgREST
  // limita cada respuesta a 1000 filas, así que hay que paginar para traerlas todas.
  const filas: Pick<Database['public']['Tables']['zonas']['Row'], 'id' | 'nombre' | 'slug' | 'tipo' | 'comunidad_slug'>[] = []
  for (let desde = 0; ; desde += TAMANO_PAGINA_ZONAS) {
    const { data, error } = await supabase
      .from('zonas')
      .select('id, nombre, slug, tipo, comunidad_slug')
      .order('orden')
      .range(desde, desde + TAMANO_PAGINA_ZONAS - 1)
    if (error) throw error
    filas.push(...data)
    if (data.length < TAMANO_PAGINA_ZONAS) break
  }
  return filas.map((z) => ({
    id: z.id,
    nombre: z.nombre,
    slug: z.slug,
    tipo: z.tipo as 'comunidad' | 'municipio',
    comunidadSlug: z.comunidad_slug,
  }))
}

export async function obtenerProfesionales(): Promise<Profesional[]> {
  const { data, error } = await supabase.from('profesionales').select(SELECT_PROFESIONAL)
  if (error) throw error
  return (data as unknown as FilaProfesional[]).map(mapearProfesional)
}

export async function obtenerProfesionalPorSlug(slug: string): Promise<Profesional | null> {
  const { data, error } = await supabase
    .from('profesionales')
    .select(SELECT_PROFESIONAL)
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data ? mapearProfesional(data as unknown as FilaProfesional) : null
}

export async function obtenerMiProfesional(userId: string): Promise<Profesional | null> {
  const { data, error } = await supabase
    .from('profesionales')
    .select(SELECT_PROFESIONAL)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data ? mapearProfesional(data as unknown as FilaProfesional) : null
}

export type DatosFormularioProfesional = {
  nombreComercial: string
  /** Oficios del profesional (chips); el primero se guarda como oficio principal. */
  categoriaIds: string[]
  especialidades: Especialidad[]
  localidad: string
  zonaIds: string[]
  descripcionBreve: string
  descripcion: string
  fotoPerfilUrl: string | null
  fotosTrabajos: string[]
  contacto: MediosContacto
}

function slugificar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function guardarMiProfesional(
  userId: string,
  idExistente: string | null,
  datos: DatosFormularioProfesional,
): Promise<void> {
  const fila = {
    nombre_comercial: datos.nombreComercial,
    categoria_id: datos.categoriaIds[0],
    especialidades: datos.especialidades,
    localidad: datos.localidad,
    descripcion_breve: datos.descripcionBreve,
    descripcion: datos.descripcion,
    foto_perfil_url: datos.fotoPerfilUrl,
    fotos_trabajos: datos.fotosTrabajos,
    contacto: datos.contacto,
  }

  let profesionalId = idExistente

  if (profesionalId) {
    const { error } = await supabase.from('profesionales').update(fila).eq('id', profesionalId)
    if (error) throw error
  } else {
    const slugBase = slugificar(datos.nombreComercial) || 'profesional'
    const slug = `${slugBase}-${Math.random().toString(36).slice(2, 7)}`
    const { data, error } = await supabase
      .from('profesionales')
      .insert({ ...fila, slug, user_id: userId })
      .select('id')
      .single()
    if (error) throw error
    profesionalId = data.id
  }

  const { error: errorBorrado } = await supabase.from('profesional_zonas').delete().eq('profesional_id', profesionalId)
  if (errorBorrado) throw errorBorrado

  if (datos.zonaIds.length > 0) {
    const { error: errorInsercion } = await supabase
      .from('profesional_zonas')
      .insert(datos.zonaIds.map((zonaId) => ({ profesional_id: profesionalId as string, zona_id: zonaId })))
    if (errorInsercion) throw errorInsercion
  }

  const { error: errorBorradoCategorias } = await supabase
    .from('profesional_categorias')
    .delete()
    .eq('profesional_id', profesionalId)
  if (errorBorradoCategorias) throw errorBorradoCategorias

  if (datos.categoriaIds.length > 0) {
    const { error: errorInsercionCategorias } = await supabase
      .from('profesional_categorias')
      .insert(datos.categoriaIds.map((categoriaId) => ({ profesional_id: profesionalId as string, categoria_id: categoriaId })))
    if (errorInsercionCategorias) throw errorInsercionCategorias
  }
}
