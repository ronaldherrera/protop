import type { ValoracionPublica } from '../../features/valoraciones/types'

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}

export function ListaValoracionesPublicas({ valoraciones }: { valoraciones: ValoracionPublica[] }) {
  const conDescripcion = valoraciones.filter((v) => v.descripcionTrabajo?.trim())

  if (conDescripcion.length === 0) return null

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-neutral-700">Trabajos valorados</h3>
      <ul className="mt-2 flex flex-col gap-2">
        {conDescripcion.map((valoracion) => (
          <li key={valoracion.id} className="rounded-lg bg-neutral-50 px-3 py-2">
            <p className="text-sm text-neutral-700">{valoracion.descripcionTrabajo}</p>
            <p className="mt-1 text-xs text-neutral-500">{formatearFecha(valoracion.creadoEn)}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
