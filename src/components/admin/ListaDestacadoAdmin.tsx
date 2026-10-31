import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabaseClient'
import { useCategorias } from '../../features/directorio/queries'
import { EmptyState } from '../estado/EmptyState'
import { LoadingState } from '../estado/LoadingState'

type Apuntado = {
  id: string
  email: string
  nombreNegocio: string | null
  categoriaId: string | null
  zona: string | null
  creado: string
}

/** null: la tabla todavía no existe (migración visitas_e_interes_destacado sin aplicar). */
async function obtenerApuntados(): Promise<Apuntado[] | null> {
  const { data, error } = await supabase
    .from('interes_destacado')
    .select('id, email, nombre_negocio, categoria_id, zona, created_at')
    .order('created_at', { ascending: false })
  if (error?.code === '42P01' || error?.code === 'PGRST205') return null
  if (error) throw error
  return data.map((fila) => ({
    id: fila.id,
    email: fila.email,
    nombreNegocio: fila.nombre_negocio,
    categoriaId: fila.categoria_id,
    zona: fila.zona,
    creado: fila.created_at,
  }))
}

const formatoFecha = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' })

/** Profesionales que han pedido que se les avise cuando se pueda contratar el Plan Destacado. */
export function ListaDestacadoAdmin() {
  const apuntados = useQuery({ queryKey: ['interes-destacado'], queryFn: obtenerApuntados })
  const categorias = useCategorias()
  const nombreOficio = (id: string | null) => categorias.data?.find((c) => c.id === id)?.nombre ?? '—'

  if (apuntados.isLoading) return <LoadingState etiqueta="Cargando la lista…" />
  if (apuntados.data === null) {
    return (
      <p className="mt-3 text-sm text-neutral-600">
        La lista se abre al aplicar la migración <code>20261028210000_visitas_e_interes_destacado.sql</code>.
      </p>
    )
  }
  if (!apuntados.data?.length) return <EmptyState titulo="Todavía no se ha apuntado nadie" />

  return (
    <div className="mt-3 overflow-x-auto rounded-xl ring-1 ring-neutral-200">
      <table className="w-full min-w-[36rem] bg-white text-left text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            <th className="px-3 py-2 font-semibold">Email</th>
            <th className="px-3 py-2 font-semibold">Negocio</th>
            <th className="px-3 py-2 font-semibold">Oficio</th>
            <th className="px-3 py-2 font-semibold">Zona</th>
            <th className="px-3 py-2 font-semibold">Fecha</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {apuntados.data.map((apuntado) => (
            <tr key={apuntado.id}>
              <td className="px-3 py-2">
                <a href={`mailto:${apuntado.email}`} className="text-brand-700 hover:underline">
                  {apuntado.email}
                </a>
              </td>
              <td className="px-3 py-2">{apuntado.nombreNegocio ?? '—'}</td>
              <td className="px-3 py-2">{nombreOficio(apuntado.categoriaId)}</td>
              <td className="px-3 py-2">{apuntado.zona ?? '—'}</td>
              <td className="px-3 py-2 text-neutral-500">{formatoFecha.format(new Date(apuntado.creado))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
