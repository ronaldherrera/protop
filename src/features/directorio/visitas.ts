import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabaseClient'

// Visitas y contactos de cada ficha (migración visitas_e_interes_destacado). Si la base todavía no tiene las
// funciones, no se registra nada y las estadísticas no se enseñan: la ficha funciona igual.

type TipoVisita = 'visita' | 'contacto'

/** Una visita por ficha y sesión del navegador, para no inflar el contador al recargar. */
function yaContada(slug: string): boolean {
  try {
    const clave = `protop-visto-${slug}`
    if (sessionStorage.getItem(clave)) return true
    sessionStorage.setItem(clave, '1')
  } catch {
    // Sin sessionStorage (modo privado estricto): se cuenta igualmente.
  }
  return false
}

export function registrarVisita(slug: string, tipo: TipoVisita = 'visita') {
  if (tipo === 'visita' && yaContada(slug)) return
  void supabase.rpc('registrar_visita_ficha', { p_slug: slug, p_tipo: tipo }).then(
    () => undefined,
    () => undefined,
  )
}

async function obtenerEstadisticas(slug: string): Promise<{ visitas: number; contactos: number } | null> {
  const { data, error } = await supabase.rpc('estadisticas_ficha', { p_slug: slug })
  if (error || !data?.[0]) return null
  return { visitas: Number(data[0].visitas), contactos: Number(data[0].contactos) }
}

/** Visitas y contactos de los últimos 30 días; null si no hay datos todavía. */
export function useEstadisticasFicha(slug: string | undefined) {
  return useQuery({
    queryKey: ['estadisticas-ficha', slug],
    queryFn: () => obtenerEstadisticas(slug as string),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  })
}
