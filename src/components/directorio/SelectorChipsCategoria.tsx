import { X } from 'lucide-react'
import { useState } from 'react'
import type { Categoria, Familia } from '../../types/profesional'
import { cn } from '../../lib/cn'
import { IconoCategoria } from './IconoCategoria'

type Props = {
  familias: Familia[]
  categorias: Categoria[]
  valores: string[]
  onChange: (valores: string[]) => void
}

export function SelectorChipsCategoria({ familias, categorias, valores, onChange }: Props) {
  const [abiertas, setAbiertas] = useState<string[]>(() =>
    familias
      .filter((f) => categorias.some((c) => c.familiaId === f.id && valores.includes(c.id)))
      .map((f) => f.id),
  )

  const disponibles = familias.filter((f) => !abiertas.includes(f.id))

  function alternar(id: string) {
    onChange(valores.includes(id) ? valores.filter((v) => v !== id) : [...valores, id])
  }

  function quitarFamilia(familiaId: string) {
    const idsFamilia = categorias.filter((c) => c.familiaId === familiaId).map((c) => c.id)
    setAbiertas((actuales) => actuales.filter((id) => id !== familiaId))
    onChange(valores.filter((v) => !idsFamilia.includes(v)))
  }

  return (
    <div className="flex flex-col gap-3">
      {abiertas.map((familiaId) => {
        const familia = familias.find((f) => f.id === familiaId)
        if (!familia) return null
        const categoriasFamilia = categorias.filter((c) => c.familiaId === familia.id)
        const seleccionadas = categoriasFamilia.filter((c) => valores.includes(c.id)).length
        return (
          <div key={familia.id} className="rounded-xl border border-neutral-200 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
                <IconoCategoria iconoUrl={familia.iconoUrl} nombre={familia.nombre} className="h-5 w-5" />
                {familia.nombre}
                <span className="text-xs font-normal text-neutral-500">
                  {seleccionadas === 0 ? 'ninguno marcado' : `${seleccionadas} marcado${seleccionadas > 1 ? 's' : ''}`}
                </span>
              </p>
              <button
                type="button"
                onClick={() => quitarFamilia(familia.id)}
                aria-label={`Quitar la categoría ${familia.nombre}`}
                className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {categoriasFamilia.map((categoria) => {
                const activa = valores.includes(categoria.id)
                return (
                  <button
                    type="button"
                    key={categoria.id}
                    onClick={() => alternar(categoria.id)}
                    aria-pressed={activa}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm',
                      activa ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-neutral-300 text-neutral-600',
                    )}
                  >
                    <IconoCategoria iconoUrl={categoria.iconoUrl} nombre={categoria.nombre} className="h-4 w-4" />
                    {categoria.nombre}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {disponibles.length > 0 && (
        <select
          value=""
          onChange={(e) => e.target.value && setAbiertas((actuales) => [...actuales, e.target.value])}
          aria-label="Añadir una categoría"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900"
        >
          <option value="">{abiertas.length === 0 ? 'Elige una categoría…' : 'Añadir otra categoría…'}</option>
          {disponibles.map((familia) => (
            <option key={familia.id} value={familia.id}>
              {familia.nombre}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
