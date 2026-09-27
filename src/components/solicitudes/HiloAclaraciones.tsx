import { type FormEvent, useState } from 'react'
import { useAclaraciones, useEnviarAclaracion } from '../../features/solicitudes/queries'
import { Button } from '../ui/Button'

export function HiloAclaraciones({ solicitudId, puedeEscribir }: { solicitudId: string; puedeEscribir: boolean }) {
  const aclaraciones = useAclaraciones(solicitudId)
  const enviar = useEnviarAclaracion()
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function enviarMensaje(evento: FormEvent) {
    evento.preventDefault()
    if (!mensaje.trim()) return
    setError(null)
    try {
      await enviar.mutateAsync({ solicitudId, mensaje })
      setMensaje('')
    } catch {
      setError('No se ha podido enviar. Inténtalo de nuevo.')
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-neutral-900">Aclaraciones sobre el trabajo</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Espacio para resolver dudas puntuales de esta solicitud, no es un chat general.
      </p>

      {aclaraciones.isLoading ? (
        <p className="mt-3 text-sm text-neutral-500">Cargando…</p>
      ) : aclaraciones.data && aclaraciones.data.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2">
          {aclaraciones.data.map((a) => (
            <li key={a.id} className="rounded-lg bg-neutral-50 px-3 py-2 text-sm">
              <span className="font-medium text-neutral-800">{a.autorNombre}: </span>
              <span className="text-neutral-700">{a.mensaje}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-neutral-500">Todavía no hay aclaraciones.</p>
      )}

      {puedeEscribir && (
        <form onSubmit={enviarMensaje} className="mt-3 flex gap-2">
          <input
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe una aclaración…"
            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900"
          />
          <Button type="submit" disabled={enviar.isPending}>
            Enviar
          </Button>
        </form>
      )}
      {error && <p className="mt-1 text-sm text-danger-500">{error}</p>}
    </div>
  )
}
