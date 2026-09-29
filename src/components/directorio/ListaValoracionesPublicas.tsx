import { useState } from 'react'
import { Modal } from '../ui/Modal'
import type { ValoracionPublica } from '../../features/valoraciones/types'

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}

export function ListaValoracionesPublicas({ valoraciones }: { valoraciones: ValoracionPublica[] }) {
  const [abierto, setAbierto] = useState(false)
  const conDescripcion = valoraciones.filter((v) => v.descripcionTrabajo?.trim())

  if (conDescripcion.length === 0) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="text-left text-sm font-medium text-brand-700 hover:underline"
      >
        Ver trabajos valorados ({conDescripcion.length})
      </button>

      {abierto && (
        <Modal titulo="Trabajos valorados" onCerrar={() => setAbierto(false)}>
          <ul className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto">
            {conDescripcion.map((valoracion) => (
              <li key={valoracion.id} className="rounded-lg bg-neutral-50 px-3 py-2">
                <p className="text-sm text-neutral-700">{valoracion.descripcionTrabajo}</p>
                <p className="mt-1 text-xs text-neutral-500">{formatearFecha(valoracion.creadoEn)}</p>
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </>
  )
}
