import { Link } from 'react-router-dom'
import { EmptyState } from '../estado/EmptyState'
import { ErrorState } from '../estado/ErrorState'
import { LoadingState } from '../estado/LoadingState'
import { Badge } from '../ui/Badge'
import { useMisPropuestas } from '../../features/solicitudes/queries'
import { ETIQUETA_ESTADO_SOLICITUD, formatearFecha, formatearImporte } from '../../features/solicitudes/formato'

export function MisPropuestas({ profesionalId }: { profesionalId: string }) {
  const propuestas = useMisPropuestas(profesionalId)

  if (propuestas.isLoading) {
    return <LoadingState etiqueta="Cargando tus propuestas…" />
  }

  if (propuestas.isError) {
    return <ErrorState descripcion="No hemos podido cargar tus propuestas enviadas." />
  }

  if (!propuestas.data || propuestas.data.length === 0) {
    return (
      <div className="mt-3">
        <EmptyState
          titulo="Todavía no has enviado ninguna propuesta"
          descripcion="Cuando respondas a una solicitud de presupuesto, aparecerá aquí para que puedas hacerle seguimiento."
        />
      </div>
    )
  }

  const hoy = new Date().toISOString().slice(0, 10)

  return (
    <ul className="flex flex-col gap-2">
      {propuestas.data.map((p) => {
        const estado = ETIQUETA_ESTADO_SOLICITUD[p.solicitudEstado]
        const caducada = p.solicitudEstado === 'abierta' && p.validaHasta < hoy
        return (
          <li key={p.id}>
            <Link
              to={`/solicitudes/${p.solicitudId}`}
              className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-neutral-900">{p.solicitudTitulo}</p>
                <p className="text-xs text-neutral-500">
                  {p.solicitudCategoriaNombre} · {p.solicitudZonaNombre} · enviada el {formatearFecha(p.creadoEn)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900">{formatearImporte(p.importeOrientativo)}</span>
                {caducada && <Badge tono="aviso">Caducada</Badge>}
                <Badge tono={estado.tono}>{estado.texto}</Badge>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
