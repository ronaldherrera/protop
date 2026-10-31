import { CONCEPTOS_VALORACION, type DesgloseValoracion } from '../../types/profesional'
import { InfoTooltip } from '../ui/InfoTooltip'
import { formatearPuntuacion } from '../../lib/formatoPuntuacion'

/** Una barra por concepto: se compara de un vistazo dónde destaca y dónde flojea. */
export function DesgloseValoraciones({ desglose }: { desglose: DesgloseValoracion }) {
  const conceptosContestados = CONCEPTOS_VALORACION.filter((concepto) => desglose[concepto.id] !== undefined)

  if (conceptosContestados.length === 0) {
    return null
  }

  return (
    <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
      {conceptosContestados.map((concepto) => {
        const valor = desglose[concepto.id] as number
        return (
          <div key={concepto.id}>
            <div className="flex items-center justify-between gap-2">
              <dt className="flex items-center gap-1 text-sm text-neutral-700">
                {concepto.etiqueta}
                <InfoTooltip texto={concepto.explicacion} />
              </dt>
              <dd className="cifras text-sm font-semibold text-neutral-900">{formatearPuntuacion(valor)}</dd>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-200" aria-hidden="true">
              <div className="h-full rounded-full bg-accent-500" style={{ width: `${(valor / 5) * 100}%` }} />
            </div>
          </div>
        )
      })}
    </dl>
  )
}
