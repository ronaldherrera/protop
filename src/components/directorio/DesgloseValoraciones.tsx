import { CONCEPTOS_VALORACION, type DesgloseValoracion } from '../../types/profesional'
import { InfoTooltip } from '../ui/InfoTooltip'

export function DesgloseValoraciones({ desglose }: { desglose: DesgloseValoracion }) {
  const conceptosContestados = CONCEPTOS_VALORACION.filter((concepto) => desglose[concepto.id] !== undefined)

  if (conceptosContestados.length === 0) {
    return null
  }

  return (
    <dl className="grid gap-2 sm:grid-cols-3">
      {conceptosContestados.map((concepto) => {
        const valor = desglose[concepto.id] as number
        return (
          <div key={concepto.id} className="flex items-center justify-between gap-2 rounded-md bg-neutral-50 px-2.5 py-1.5">
            <dt className="flex items-center gap-1 text-xs text-neutral-600">
              {concepto.etiqueta}
              <InfoTooltip texto={concepto.explicacion} />
            </dt>
            <dd className="text-xs font-semibold text-neutral-900">
              {valor.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}/5
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
