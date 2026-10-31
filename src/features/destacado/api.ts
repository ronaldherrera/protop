import { supabase } from '../../lib/supabaseClient'

export type PrecioDestacado = {
  categoriaId: string
  precioMensualCentimos: number
  activo: boolean
}

/** Precios del Plan Destacado por oficio. La administración ve también los inactivos. */
export async function obtenerPreciosDestacado(): Promise<PrecioDestacado[]> {
  const { data, error } = await supabase.from('precios_destacado').select('categoria_id, precio_mensual_centimos, activo')
  if (error) throw error
  return data.map((fila) => ({
    categoriaId: fila.categoria_id,
    precioMensualCentimos: fila.precio_mensual_centimos,
    activo: fila.activo,
  }))
}

export type InteresDestacado = { email: string; nombreNegocio: string; categoriaId: string | null; zona: string }

/** La tabla todavía no existe en la base (migración sin aplicar): el formulario ofrece escribir por email. */
export class SinListaDestacado extends Error {}

export async function apuntarseDestacado(interes: InteresDestacado): Promise<void> {
  const { error } = await supabase.from('interes_destacado').insert({
    email: interes.email.trim(),
    nombre_negocio: interes.nombreNegocio.trim() || null,
    categoria_id: interes.categoriaId,
    zona: interes.zona.trim() || null,
  })
  if (error?.code === '42P01' || error?.code === 'PGRST205') throw new SinListaDestacado()
  if (error) throw error
}

export async function guardarPrecioDestacado(precio: PrecioDestacado): Promise<void> {
  const { error } = await supabase.from('precios_destacado').upsert({
    categoria_id: precio.categoriaId,
    precio_mensual_centimos: precio.precioMensualCentimos,
    activo: precio.activo,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}
