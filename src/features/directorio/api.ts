import { supabase } from '../../lib/supabaseClient'
import type {
  Categoria,
  Distintivo,
  MediosContacto,
  Profesional,
  Zona,
} from '../../types/profesional'
import type { Database } from '../../types/database'

type FilaProfesional = Database['public']['Tables']['profesionales']['Row'] & {
  categorias: Pick<Database['public']['Tables']['categorias']['Row'], 'slug' | 'nombre'> | null
  profesional_zonas: { zonas: Pick<Database['public']['Tables']['zonas']['Row'], 'slug' | 'nombre'> | null }[]
}

const SELECT_PROFESIONAL = `
  id, slug, nombre_comercial, especialidades, localidad,
  descripcion_breve, descripcion, foto_perfil_url, fotos_trabajos,
  contacto, puntuacion_global, trabajos_valorados, desglose_por_concepto,
  distintivos, patrocinado, es_demo,
  categorias ( slug, nombre ),
  profesional_zonas ( zonas ( slug, nombre ) )
`

function mapearProfesional(fila: FilaProfesional): Profesional {
  const zonas = fila.profesional_zonas.map((pz) => pz.zonas).filter((zona): zona is { slug: string; nombre: string } => Boolean(zona))

  return {
    id: fila.id,
    slug: fila.slug,
    nombreComercial: fila.nombre_comercial,
    oficioPrincipal: fila.categorias?.slug ?? '',
    categoriaNombre: fila.categorias?.nombre ?? '',
    especialidades: fila.especialidades,
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

export async function obtenerCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase.from('categorias').select('id, nombre, slug').order('orden')
  if (error) throw error
  return data
}

export async function obtenerZonas(): Promise<Zona[]> {
  const { data, error } = await supabase.from('zonas').select('id, nombre, slug').order('orden')
  if (error) throw error
  return data
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
