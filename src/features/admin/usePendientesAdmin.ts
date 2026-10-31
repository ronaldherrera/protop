import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabaseClient'
import type { ClavePendiente } from './secciones'

// Si la tabla aún no existe (migración sin aplicar) cuenta 0 en vez de fallar.
const numero = ({ count, error }: { count: number | null; error: unknown }) => (error ? 0 : (count ?? 0))

/** Lo que espera a la administración: valoraciones, reclamaciones de fichas, peticiones de baja y negocios por revisar. */
export function usePendientesAdmin(activo: boolean) {
  return useQuery({
    queryKey: ['admin-pendientes'],
    enabled: activo,
    refetchInterval: 120_000,
    queryFn: async (): Promise<Record<ClavePendiente, number>> => {
      const [valoraciones, reclamaciones, bajas, candidatos] = await Promise.all([
        supabase.from('valoraciones').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
        supabase.from('reclamaciones_ficha').select('*', { count: 'exact', head: true }).eq('estado', 'revision'),
        supabase.from('bajas_ficha').select('*', { count: 'exact', head: true }),
        supabase.from('negocios_candidatos').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
      ])
      return {
        valoraciones: numero(valoraciones),
        reclamaciones: numero(reclamaciones),
        bajas: numero(bajas),
        candidatos: numero(candidatos),
      }
    },
  })
}
