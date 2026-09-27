import { type FormEvent, useState } from 'react'
import { useEnviarPropuesta } from '../../features/solicitudes/queries'
import type { TipoPropuesta } from '../../features/solicitudes/types'
import { Button } from '../ui/Button'

export function FormularioPropuesta({
  solicitudId,
  profesionalId,
}: {
  solicitudId: string
  profesionalId: string
}) {
  const enviar = useEnviarPropuesta()
  const [alcanceTrabajo, setAlcanceTrabajo] = useState('')
  const [importeOrientativo, setImporteOrientativo] = useState('')
  const [desglose, setDesglose] = useState('')
  const [materialesIncluidos, setMaterialesIncluidos] = useState('')
  const [manoObra, setManoObra] = useState('')
  const [tratamientoImpuestos, setTratamientoImpuestos] = useState('IVA incluido')
  const [exclusiones, setExclusiones] = useState('')
  const [plazoAproximado, setPlazoAproximado] = useState('')
  const [necesitaVisita, setNecesitaVisita] = useState(false)
  const [aspectosPendientes, setAspectosPendientes] = useState('')
  const [validaHasta, setValidaHasta] = useState('')
  const [tipo, setTipo] = useState<TipoPropuesta>('estimacion')
  const [error, setError] = useState<string | null>(null)

  async function enviarFormulario(evento: FormEvent) {
    evento.preventDefault()
    setError(null)

    const importe = Number(importeOrientativo)
    if (!importe || importe <= 0) {
      setError('Indica un importe orientativo válido.')
      return
    }
    if (!validaHasta) {
      setError('Indica hasta cuándo es válida la propuesta.')
      return
    }

    try {
      await enviar.mutateAsync({
        solicitudId,
        profesionalId,
        datos: {
          alcanceTrabajo,
          importeOrientativo: importe,
          desglose,
          materialesIncluidos,
          manoObra,
          tratamientoImpuestos,
          exclusiones,
          plazoAproximado,
          necesitaVisita,
          aspectosPendientes,
          validaHasta,
          tipo,
        },
      })
    } catch {
      setError('No se ha podido enviar la propuesta. Inténtalo de nuevo.')
    }
  }

  return (
    <form onSubmit={enviarFormulario} className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-4">
      <h3 className="font-semibold text-neutral-900">Enviar propuesta</h3>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Alcance del trabajo</span>
        <textarea
          required
          rows={2}
          value={alcanceTrabajo}
          onChange={(e) => setAlcanceTrabajo(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Importe orientativo (€)</span>
          <input
            type="number"
            required
            min={1}
            value={importeOrientativo}
            onChange={(e) => setImporteOrientativo(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Plazo aproximado</span>
          <input
            type="text"
            required
            placeholder="Ej. 1-2 semanas"
            value={plazoAproximado}
            onChange={(e) => setPlazoAproximado(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
          />
        </label>
      </div>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Desglose (opcional)</span>
        <textarea
          rows={2}
          value={desglose}
          onChange={(e) => setDesglose(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Materiales incluidos (opcional)</span>
          <input
            type="text"
            value={materialesIncluidos}
            onChange={(e) => setMaterialesIncluidos(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Mano de obra (opcional)</span>
          <input
            type="text"
            value={manoObra}
            onChange={(e) => setManoObra(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
          />
        </label>
      </div>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Tratamiento de impuestos</span>
        <select
          value={tratamientoImpuestos}
          onChange={(e) => setTratamientoImpuestos(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
        >
          <option>IVA incluido</option>
          <option>IVA no incluido</option>
          <option>No aplica</option>
        </select>
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Exclusiones (opcional)</span>
        <input
          type="text"
          value={exclusiones}
          onChange={(e) => setExclusiones(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
        />
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Aspectos pendientes de comprobar (opcional)</span>
        <input
          type="text"
          value={aspectosPendientes}
          onChange={(e) => setAspectosPendientes(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Válida hasta</span>
          <input
            type="date"
            required
            value={validaHasta}
            onChange={(e) => setValidaHasta(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Tipo de propuesta</span>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoPropuesta)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
          >
            <option value="estimacion">Estimación orientativa</option>
            <option value="confirmada">Presupuesto confirmado</option>
          </select>
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" checked={necesitaVisita} onChange={(e) => setNecesitaVisita(e.target.checked)} />
        Necesito visitar el lugar antes de confirmar
      </label>

      {error && <p className="text-sm text-danger-500">{error}</p>}

      <Button type="submit" disabled={enviar.isPending} className="sm:w-auto">
        {enviar.isPending ? 'Enviando…' : 'Enviar propuesta'}
      </Button>
    </form>
  )
}
