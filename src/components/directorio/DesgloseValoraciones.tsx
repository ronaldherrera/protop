import { CONCEPTOS_VALORACION, type DesgloseValoracion } from '../../types/profesional'

export function DesgloseValoraciones({ desglose }: { desglose: DesgloseValoracion }) {
  const conceptosContestados = CONCEPTOS_VALORACION.filter((concepto) => desglose[concepto.id] !== undefined)

  if (conceptosContestados.length === 0) {
    return null
  }

  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {conceptosContestados.map((concepto) => {
        const valor = desglose[concepto.id] as number
        return (
          <div key={concepto.id} className="flex items-center justify-between gap-3 rounded-lg bg-neutral-50 px-3 py-2">
            <dt className="text-sm text-neutral-600">{concepto.etiqueta}</dt>
            <dd className="text-sm font-semibold text-neutral-900">
              {valor.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}/5
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
