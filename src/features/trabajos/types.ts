export type ComentarioTrabajo = {
  id: string
  autorNombre: string
  comentario: string
  creadoEn: string
}

export type TrabajoPublicado = {
  id: string
  profesionalId: string
  titulo: string
  descripcion: string | null
  fotos: string[]
  realizadoEn: string | null
  clienteId: string | null
  comentario: ComentarioTrabajo | null
  creadoEn: string
}

export type TrabajoVinculado = TrabajoPublicado & {
  profesionalNombre: string
  profesionalSlug: string
}

export type DatosTrabajo = {
  titulo: string
  descripcion: string
  fotos: string[]
  realizadoEn: string
}
