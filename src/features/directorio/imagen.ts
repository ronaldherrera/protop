import type { Profesional } from '../../types/profesional'

const VARIANTES_CARTEL = 3

/**
 * Imagen que representa al profesional: su primera foto de trabajos o, si no ha subido ninguna, el cartel de su
 * oficio principal (public/fotos/oficios). Hay tres variantes por oficio para que dos negocios del mismo oficio no
 * salgan iguales; cada ficha usa siempre la misma, según su slug.
 */
export function imagenDeProfesional(profesional: Pick<Profesional, 'slug' | 'fotosTrabajos' | 'oficios'>): string {
  if (profesional.fotosTrabajos[0]) return profesional.fotosTrabajos[0]
  const oficio = profesional.oficios[0]?.slug
  if (!oficio) return '/compartir.png'
  const variante = [...profesional.slug].reduce((suma, letra) => suma + letra.charCodeAt(0), 0) % VARIANTES_CARTEL
  return `/fotos/oficios/${oficio}-${variante}.webp`
}

/** Si la imagen es el cartel genérico del oficio (y no una foto del propio negocio). */
export const esCartelDeOficio = (imagen: string) => imagen.startsWith('/fotos/oficios/')

export type Portada = { src: string; tipo: 'foto' | 'logo' | 'cartel' }

/**
 * Portada de la tarjeta y de la ficha: una foto de trabajos si hay; si no, el logotipo del negocio; y solo si
 * tampoco hay logotipo, el cartel del oficio.
 */
export function portadaDeProfesional(
  profesional: Pick<Profesional, 'slug' | 'fotosTrabajos' | 'oficios' | 'fotoPerfilUrl'>,
): Portada {
  if (profesional.fotosTrabajos[0]) return { src: profesional.fotosTrabajos[0], tipo: 'foto' }
  if (profesional.fotoPerfilUrl) return { src: profesional.fotoPerfilUrl, tipo: 'logo' }
  return { src: imagenDeProfesional(profesional), tipo: 'cartel' }
}
