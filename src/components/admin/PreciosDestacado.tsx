import { useState } from 'react'
import { useCategorias, useFamilias } from '../../features/directorio/queries'
import { useGuardarPrecioDestacado, usePreciosDestacado } from '../../features/destacado/queries'
import type { Categoria } from '../../types/profesional'
import { ErrorState } from '../estado/ErrorState'
import { LoadingState } from '../estado/LoadingState'
import { Button } from '../ui/Button'

/** Precio mensual del Plan Destacado en cada oficio. Un oficio sin precio activo no se puede contratar. */
export function PreciosDestacado() {
  const categorias = useCategorias()
  const familias = useFamilias()
  const precios = usePreciosDestacado()

  if (categorias.isLoading || familias.isLoading || precios.isLoading) return <LoadingState etiqueta="Cargando precios…" />
  if (precios.isError) {
    return (
      <ErrorState descripcion="No se han podido cargar los precios. Si acabas de actualizar, falta aplicar la migración del Plan Destacado (supabase db push)." />
    )
  }

  const porCategoria = new Map((precios.data ?? []).map((precio) => [precio.categoriaId, precio]))
  const ordenFamilia = new Map((familias.data ?? []).map((familia, indice) => [familia.id, indice]))
  const ordenadas = [...(categorias.data ?? [])].sort(
    (a, b) => (ordenFamilia.get(a.familiaId) ?? 99) - (ordenFamilia.get(b.familiaId) ?? 99),
  )

  return (
    <ul className="mt-4 divide-y divide-neutral-200 rounded-tarjeta bg-white ring-1 ring-neutral-200">
      {ordenadas.map((categoria) => (
        <FilaPrecio
          key={categoria.id}
          categoria={categoria}
          precioCentimos={porCategoria.get(categoria.id)?.precioMensualCentimos ?? null}
          activo={porCategoria.get(categoria.id)?.activo ?? false}
        />
      ))}
    </ul>
  )
}

function FilaPrecio({
  categoria,
  precioCentimos,
  activo,
}: {
  categoria: Categoria
  precioCentimos: number | null
  activo: boolean
}) {
  const guardar = useGuardarPrecioDestacado()
  const [euros, setEuros] = useState(precioCentimos ? String(precioCentimos / 100).replace('.', ',') : '')
  const [activado, setActivado] = useState(activo)
  const centimos = Math.round(Number(euros.replace(',', '.')) * 100)
  const valido = Number.isFinite(centimos) && centimos > 0
  const cambiado = centimos !== precioCentimos || activado !== activo

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
      <span className="min-w-[12rem] flex-1 text-sm font-medium text-neutral-900">{categoria.nombre}</span>
      <label className="flex items-center gap-2 text-sm text-neutral-600">
        <span className="sr-only">Precio mensual de {categoria.nombre} en euros</span>
        <input
          type="text"
          inputMode="decimal"
          value={euros}
          onChange={(evento) => setEuros(evento.target.value)}
          placeholder="—"
          className="h-9 w-20 rounded-[10px] border border-neutral-300 px-2 text-right text-neutral-900"
        />
        € / mes
      </label>
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={activado}
          onChange={(evento) => setActivado(evento.target.checked)}
          disabled={!valido}
          className="h-4 w-4 accent-brand-600"
        />
        Se puede contratar
      </label>
      <Button
        type="button"
        variante="secundario"
        disabled={!valido || !cambiado || guardar.isPending}
        onClick={() => guardar.mutate({ categoriaId: categoria.id, precioMensualCentimos: centimos, activo: activado })}
      >
        {guardar.isPending ? 'Guardando…' : guardar.isSuccess && !cambiado ? 'Guardado' : 'Guardar'}
      </Button>
      {guardar.isError && <span className="w-full text-sm text-danger-500">No se ha podido guardar el precio.</span>}
    </li>
  )
}
