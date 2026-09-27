import { Star } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { useEnviarValoracion } from '../../features/valoraciones/queries'
import { CONCEPTOS_VALORACION, type ConceptoValoracion, type DesgloseValoracion } from '../../types/profesional'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

function SelectorConcepto({
  etiqueta,
  valor,
  onCambiar,
}: {
  etiqueta: string
  valor: number | undefined
  onCambiar: (valor: number | undefined) => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-1.5">
      <span className="text-sm text-neutral-700">{etiqueta}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} de 5`}
            onClick={() => onCambiar(n)}
            className="p-0.5"
          >
            <Star
              className={`h-5 w-5 ${valor && n <= valor ? 'fill-brand-500 text-brand-500' : 'text-neutral-300'}`}
            />
          </button>
        ))}
        <button
          type="button"
          onClick={() => onCambiar(undefined)}
          className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
            valor === undefined ? 'bg-neutral-200 text-neutral-700' : 'text-neutral-400 hover:bg-neutral-100'
          }`}
        >
          No aplica
        </button>
      </div>
    </div>
  )
}

export function FormularioValoracion({
  profesionalId,
  onCerrar,
}: {
  profesionalId: string
  onCerrar: () => void
}) {
  const enviar = useEnviarValoracion()
  const [conceptos, setConceptos] = useState<DesgloseValoracion>({})
  const [descripcionTrabajo, setDescripcionTrabajo] = useState('')
  const [factura, setFactura] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [enviado, setEnviado] = useState(false)

  function cambiarConcepto(concepto: ConceptoValoracion, valor: number | undefined) {
    setConceptos((actuales) => ({ ...actuales, [concepto]: valor }))
  }

  async function alEnviar(evento: FormEvent) {
    evento.preventDefault()
    setError(null)

    const hayAlMenosUno = Object.values(conceptos).some((v) => v !== undefined)
    if (!hayAlMenosUno) {
      setError('Puntúa al menos un concepto.')
      return
    }
    if (!factura) {
      setError('Adjunta la factura del trabajo.')
      return
    }

    try {
      await enviar.mutateAsync({ profesionalId, conceptos, descripcionTrabajo, factura })
      setEnviado(true)
    } catch {
      setError('No se ha podido enviar la valoración. Inténtalo de nuevo.')
    }
  }

  if (enviado) {
    return (
      <Modal titulo="Valoración enviada" onCerrar={onCerrar}>
        <p className="text-sm text-neutral-700">
          Gracias. Tu valoración quedará pendiente de revisión y solo contará para la puntuación del profesional
          cuando la aprobemos.
        </p>
        <Button type="button" onClick={onCerrar} className="mt-4">
          Cerrar
        </Button>
      </Modal>
    )
  }

  return (
    <Modal titulo="Valorar este trabajo" onCerrar={onCerrar}>
      <form onSubmit={alEnviar} className="flex flex-col gap-4">
        <p className="text-sm text-neutral-600">
          Solo se publica si presentas la factura del trabajo y supera la revisión de Protop. No hay comentarios
          libres, solo puntuaciones por concepto.
        </p>

        <div className="divide-y divide-neutral-100">
          {CONCEPTOS_VALORACION.map((concepto) => (
            <SelectorConcepto
              key={concepto.id}
              etiqueta={concepto.etiqueta}
              valor={conceptos[concepto.id]}
              onCambiar={(valor) => cambiarConcepto(concepto.id, valor)}
            />
          ))}
        </div>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">
            Aclaración sobre el trabajo (opcional, solo para la revisión)
          </span>
          <textarea
            rows={2}
            value={descripcionTrabajo}
            onChange={(e) => setDescripcionTrabajo(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Factura (imagen o PDF)</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            required
            onChange={(e) => setFactura(e.target.files?.[0] ?? null)}
          />
          <span className="mt-1 block text-xs text-neutral-500">
            Se almacena de forma privada. Nunca aparece en tu ficha pública.
          </span>
        </label>

        {error && <p className="text-sm text-danger-500">{error}</p>}

        <Button type="submit" disabled={enviar.isPending}>
          {enviar.isPending ? 'Enviando…' : 'Enviar valoración'}
        </Button>
      </form>
    </Modal>
  )
}
