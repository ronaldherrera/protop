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
  function alternar(id: string) {
    onChange(valores.includes(id) ? valores.filter((v) => v !== id) : [...valores, id])
  }

  return (
    <div className="flex flex-col gap-3">
      {familias.map((familia) => {
        const categoriasFamilia = categorias.filter((c) => c.familiaId === familia.id)
        if (categoriasFamilia.length === 0) return null
        return (
          <div key={familia.id}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">{familia.nombre}</p>
            <div className="flex flex-wrap gap-2">
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
    </div>
  )
}
