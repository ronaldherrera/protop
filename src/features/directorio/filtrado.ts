import type { Profesional, Zona } from '../../types/profesional'

// El filtro y el orden orgánico del directorio están en la base (buscar_profesionales). Aquí queda la regla de
// zonas, que también usan las solicitudes, y la elección de patrocinados, que rota por visita.

/**
 * Un profesional que trabaja en una comunidad entera encaja con una búsqueda
 * por cualquiera de sus municipios, y viceversa: buscar por la comunidad
 * encuentra a quien solo ha marcado municipios sueltos de esa comunidad.
 */
export function coincideZona(filtroSlug: string, zonasProfesional: string[], zonasPorSlug: Map<string, Zona>): boolean {
  if (zonasProfesional.includes(filtroSlug)) return true
  const filtroZona = zonasPorSlug.get(filtroSlug)
  if (!filtroZona) return false
  if (filtroZona.tipo === 'municipio') {
    return filtroZona.comunidadSlug ? zonasProfesional.includes(filtroZona.comunidadSlug) : false
  }
  return zonasProfesional.some((slug) => zonasPorSlug.get(slug)?.comunidadSlug === filtroZona.slug)
}

/** Como mucho estos patrocinados encabezan una búsqueda: el resto del hueco es para resultados orgánicos. */
const MAXIMO_PATROCINADOS = 3

/** Semilla por visita: los patrocinados rotan entre visitas pero no saltan mientras navegas. */
function semillaDeRotacion(): number {
  try {
    const guardada = sessionStorage.getItem('protop-rotacion')
    if (guardada) return Number(guardada)
    const nueva = Math.floor(Math.random() * 1_000_000)
    sessionStorage.setItem('protop-rotacion', String(nueva))
    return nueva
  } catch {
    return 0
  }
}

function posicionRotada(id: string, semilla: number): number {
  let hash = semilla
  for (const caracter of id) hash = (hash * 31 + caracter.charCodeAt(0)) | 0
  return hash
}

/**
 * Solo cuenta como patrocinado quien tiene el Plan Destacado en alguno de los oficios buscados; sin oficio en la
 * búsqueda no hay patrocinados. Hasta MAXIMO_PATROCINADOS van delante, rotando entre visitas. Pagar nunca cambia
 * el orden orgánico de los demás.
 */
export function elegirPatrocinados(candidatos: Profesional[], oficiosBuscados: string[]): Profesional[] {
  const semilla = semillaDeRotacion()
  return candidatos
    .filter((profesional) => profesional.destacadoEn.some((slug) => oficiosBuscados.includes(slug)))
    .sort((a, b) => posicionRotada(a.id, semilla) - posicionRotada(b.id, semilla))
    .slice(0, MAXIMO_PATROCINADOS)
}
