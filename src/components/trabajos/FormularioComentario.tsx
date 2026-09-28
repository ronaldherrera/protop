import { type FormEvent, useState } from 'react'
import { useComentarTrabajo } from '../../features/trabajos/queries'
import { Button } from '../ui/Button'

export function FormularioComentario({ trabajoId, profesionalId }: { trabajoId: string; profesionalId?: string }) {
  const comentar = useComentarTrabajo()
  const [comentario, setComentario] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    if (!comentario.trim()) return
    setError(null)
    try {
      await comentar.mutateAsync({ trabajoId, comentario, profesionalId })
      setEnviado(true)
    } catch {
      setError('No se ha podido enviar. Inténtalo de nuevo.')
    }
  }

  if (enviado) {
    return <p className="text-sm text-success-500">Gracias, tu comentario ya es visible.</p>
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-2 rounded-lg bg-brand-50 p-3">
      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">
          Este profesional te ha vinculado a este trabajo. Si quieres, deja un comentario (opcional, público):
        </span>
        <textarea
          rows={2}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900"
        />
      </label>
      {error && <p className="text-sm text-danger-500">{error}</p>}
      <Button type="submit" tamano="md" disabled={comentar.isPending} className="self-start">
        {comentar.isPending ? 'Enviando…' : 'Publicar comentario'}
      </Button>
    </form>
  )
}
