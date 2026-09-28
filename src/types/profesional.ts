export type Familia = {
  id: string
  nombre: string
  slug: string
  iconoUrl: string | null
}

export type Categoria = {
  id: string
  nombre: string
  slug: string
  iconoUrl: string | null
  familiaId: string
}

export type Zona = {
  id: string
  nombre: string
  slug: string
  tipo: 'comunidad' | 'municipio'
  /** Para un municipio, el slug de su comunidad autónoma; null en una comunidad. */
  comunidadSlug: string | null
}

/** Conceptos estructurados de valoración (sección 7 del documento de producto). */
export type ConceptoValoracion =
  | 'calidad_acabado'
  | 'puntualidad'
  | 'cumplimiento_plazos'
  | 'limpieza_cuidado'
  | 'comunicacion'
  | 'respeto_presupuesto'

export const CONCEPTOS_VALORACION: { id: ConceptoValoracion; etiqueta: string }[] = [
  { id: 'calidad_acabado', etiqueta: 'Calidad del acabado' },
  { id: 'puntualidad', etiqueta: 'Puntualidad' },
  { id: 'cumplimiento_plazos', etiqueta: 'Cumplimiento de plazos' },
  { id: 'limpieza_cuidado', etiqueta: 'Limpieza y cuidado' },
  { id: 'comunicacion', etiqueta: 'Comunicación' },
  { id: 'respeto_presupuesto', etiqueta: 'Respeto del presupuesto' },
]

/** Media de respuestas aplicables por concepto; "No aplica" queda fuera del cálculo. */
export type DesgloseValoracion = Partial<Record<ConceptoValoracion, number>>

export type Distintivo = {
  id: string
  etiqueta: string
  explicacion: string
}

export type Especialidad = {
  nombre: string
  descripcion: string
}

export type MediosContacto = {
  telefono?: string
  whatsapp?: string
  email?: string
  web?: string
}

export type OficioProfesional = {
  id: string
  slug: string
  nombre: string
  iconoUrl: string | null
}

export type Profesional = {
  id: string
  slug: string
  nombreComercial: string
  oficioPrincipal: string
  categoriaNombre: string
  categoriaIconoUrl: string | null
  /** Todos los oficios del profesional (chips); el primero es el oficio principal. */
  oficios: OficioProfesional[]
  especialidades: Especialidad[]
  localidad: string
  zonasTrabajo: string[]
  zonasTrabajoNombres: string[]
  descripcionBreve: string
  descripcion: string
  fotoPerfilUrl?: string
  fotosTrabajos: string[]
  contacto: MediosContacto
  /** null cuando el perfil todavía no tiene valoraciones aprobadas. */
  puntuacionGlobal: number | null
  trabajosValorados: number
  desglosePorConcepto: DesgloseValoracion
  distintivos: Distintivo[]
  patrocinado: boolean
  esDemo: boolean
}
