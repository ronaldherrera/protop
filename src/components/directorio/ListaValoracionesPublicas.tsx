import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/cn'
import type { ValoracionPublica } from '../../features/valoraciones/types'

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}

export function ListaValoracionesPublicas({ valoraciones }: { valoraciones: ValoracionPublica[] }) {
  const [abierto, setAbierto] = useState(false)
  const conDescripcion = valoraciones.filter((v) => v.descripcionTrabajo?.trim())

  if (conDescripcion.length === 0) return null

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        className="flex items-center gap-1.5 text-sm font-semibold text-neutral-700 hover:text-neutral-900"
      >
        <ChevronDown className={cn('h-4 w-4 transition-transform', abierto && 'rotate-180')} />
        Trabajos valorados ({conDescripcion.length})
      </button>

      {abierto && (
        <ul className="mt-2 flex flex-col gap-2">
          {conDescripcion.map((valoracion) => (
            <li key={valoracion.id} className="rounded-lg bg-neutral-50 px-3 py-2">
              <p className="text-sm text-neutral-700">{valoracion.descripcionTrabajo}</p>
              <p className="mt-1 text-xs text-neutral-500">{formatearFecha(valoracion.creadoEn)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
