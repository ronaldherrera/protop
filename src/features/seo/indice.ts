import { useQuery } from '@tanstack/react-query'

/** /datos/oficios-por-lugar.json, que genera el build (scripts/generar-indice-oficios.mjs). */
export type IndiceOficios = {
  generado: string
  totalFichas: number
  totalMunicipios: number
  /** Nombre y comunidad de cada lugar del índice (comunidad null: es una comunidad autónoma). */
  zonas: Record<string, { nombre: string; comunidad: string | null }>
  oficios: Record<string, { total: number; lugares: Record<string, number> }>
}

export const CLAVE_INDICE = ['indice-oficios']

const VACIO: IndiceOficios = { generado: '', totalFichas: 0, totalMunicipios: 0, zonas: {}, oficios: {} }

async function obtenerIndice(): Promise<IndiceOficios> {
  try {
    const respuesta = await fetch('/datos/oficios-por-lugar.json')
    return respuesta.ok ? ((await respuesta.json()) as IndiceOficios) : VACIO
  } catch {
    return VACIO
  }
}

export function useIndiceOficios() {
  return useQuery({ queryKey: CLAVE_INDICE, queryFn: obtenerIndice, staleTime: Infinity })
}

/** Un municipio con un solo negocio es una página casi vacía: se puede visitar, pero no se ofrece a Google. */
export const MINIMO_FICHAS_PARA_INDEXAR = 2

export function lugarIndexable(indice: IndiceOficios, categoria: string, lugar: string): boolean {
  const fichas = indice.oficios[categoria]?.lugares[lugar] ?? 0
  const esComunidad = indice.zonas[lugar]?.comunidad === null
  return esComunidad ? fichas > 0 : fichas >= MINIMO_FICHAS_PARA_INDEXAR
}

/** «Real de Gandia, el» (formato del INE) se lee «El Real de Gandia». */
export function nombreLegible(nombre: string): string {
  const partes = nombre.match(/^(.*), (el|la|los|las|l'|o|a|os|as|es|sa|ses)$/i)
  if (!partes) return nombre
  const articulo = partes[2].charAt(0).toUpperCase() + partes[2].slice(1)
  return `${articulo}${articulo.endsWith("'") ? '' : ' '}${partes[1]}`
}
