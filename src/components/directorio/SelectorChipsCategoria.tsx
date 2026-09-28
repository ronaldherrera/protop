import { ChevronDown, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Categoria, Familia } from '../../types/profesional'
import { cn } from '../../lib/cn'
import { IconoCategoria } from './IconoCategoria'

type Props = {
  familias: Familia[]
  categorias: Categoria[]
  valores: string[]
  onChange: (valores: string[]) => void
}

function SelectorFamilia({
  disponibles,
  placeholder,
  onSeleccionar,
}: {
  disponibles: Familia[]
  placeholder: string
  onSeleccionar: (familiaId: string) => void
}) {
  const [abierto, setAbierto] = useState(false)
  const contenedorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function alClicarFuera(evento: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target as Node)) {
        setAbierto(false)
      }
    }
    function alPulsarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('mousedown', alClicarFuera)
    document.addEventListener('keydown', alPulsarTecla)
    return () => {
      document.removeEventListener('mousedown', alClicarFuera)
      document.removeEventListener('keydown', alPulsarTecla)
    }
  }, [])

  return (
    <div ref={contenedorRef} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-left text-sm text-neutral-700 hover:border-neutral-400"
      >
        {placeholder}
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-neutral-500 transition-transform', abierto && 'rotate-180')} />
      </button>

      {abierto && (
        <ul
          role="listbox"
          aria-label={placeholder}
          className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {disponibles.map((familia) => (
            <li key={familia.id} role="option" aria-selected={false}>
              <button
                type="button"
                onClick={() => {
                  onSeleccionar(familia.id)
                  setAbierto(false)
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-brand-50 hover:text-brand-700"
              >
                <IconoCategoria iconoUrl={familia.iconoUrl} nombre={familia.nombre} className="h-5 w-5" />
                {familia.nombre}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
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

  function anadirFamilia(familiaId: string) {
    if (!familiaId) return
    const idsFamilia = categorias.filter((c) => c.familiaId === familiaId).map((c) => c.id)
    setAbiertas((actuales) => [...actuales, familiaId])
    onChange([...valores, ...idsFamilia.filter((id) => !valores.includes(id))])
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
        <SelectorFamilia
          disponibles={disponibles}
          placeholder={abiertas.length === 0 ? 'Elige una categoría…' : 'Añadir otra categoría…'}
          onSeleccionar={anadirFamilia}
        />
      )}
    </div>
  )
}
