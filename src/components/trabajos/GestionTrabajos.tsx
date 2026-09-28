import { type FormEvent, useState } from 'react'
import { EmptyState } from '../estado/EmptyState'
import { ErrorState } from '../estado/ErrorState'
import { LoadingState } from '../estado/LoadingState'
import { Button } from '../ui/Button'
import {
  useBorrarTrabajo,
  useTrabajosDeProfesional,
  useVincularCliente,
} from '../../features/trabajos/queries'
import type { TrabajoPublicado } from '../../features/trabajos/types'
import { FormularioTrabajo } from './FormularioTrabajo'

export function GestionTrabajos({ profesionalId }: { profesionalId: string }) {
  const trabajos = useTrabajosDeProfesional(profesionalId)
  const [creando, setCreando] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)

  if (trabajos.isLoading) {
    return <LoadingState etiqueta="Cargando tus trabajos…" />
  }

  if (trabajos.isError) {
    return <ErrorState descripcion="No hemos podido cargar tus trabajos publicados." />
  }

  return (
    <div>
      {!creando && (
        <Button type="button" variante="secundario" onClick={() => setCreando(true)}>
          + Publicar un trabajo
        </Button>
      )}

      {creando && (
        <div className="mt-3">
          <FormularioTrabajo
            profesionalId={profesionalId}
            trabajo={null}
            onGuardado={() => setCreando(false)}
            onCancelar={() => setCreando(false)}
          />
        </div>
      )}

      {(!trabajos.data || trabajos.data.length === 0) && !creando && (
        <div className="mt-3">
          <EmptyState
            titulo="Todavía no has publicado ningún trabajo"
            descripcion="Muestra trabajos reales y, si quieres, vincula al cliente para que deje un comentario."
          />
        </div>
      )}

      <ul className="mt-3 flex flex-col gap-3">
        {(trabajos.data ?? []).map((trabajo) =>
          editandoId === trabajo.id ? (
            <li key={trabajo.id}>
              <FormularioTrabajo
                profesionalId={profesionalId}
                trabajo={trabajo}
                onGuardado={() => setEditandoId(null)}
                onCancelar={() => setEditandoId(null)}
              />
            </li>
          ) : (
            <TarjetaGestionTrabajo
              key={trabajo.id}
              trabajo={trabajo}
              profesionalId={profesionalId}
              onEditar={() => setEditandoId(trabajo.id)}
            />
          ),
        )}
      </ul>
    </div>
  )
}

function TarjetaGestionTrabajo({
  trabajo,
  profesionalId,
  onEditar,
}: {
  trabajo: TrabajoPublicado
  profesionalId: string
  onEditar: () => void
}) {
  const borrar = useBorrarTrabajo(profesionalId)
  const vincular = useVincularCliente(profesionalId)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function alVincular(evento: FormEvent) {
    evento.preventDefault()
    setError(null)
    try {
      await vincular.mutateAsync({ trabajoId: trabajo.id, email })
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido vincular.')
    }
  }

  return (
    <li className="rounded-xl border border-neutral-200 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-neutral-900">{trabajo.titulo}</p>
          {trabajo.descripcion && <p className="mt-0.5 text-sm text-neutral-600">{trabajo.descripcion}</p>}
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={onEditar} className="text-sm font-medium text-brand-700 hover:underline">
            Editar
          </button>
          <button
            type="button"
            onClick={() => borrar.mutate(trabajo.id)}
            className="text-sm font-medium text-danger-500 hover:underline"
          >
            Borrar
          </button>
        </div>
      </div>

      {trabajo.fotos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {trabajo.fotos.map((url) => (
            <img key={url} src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
          ))}
        </div>
      )}

      <div className="mt-3 border-t border-neutral-100 pt-3">
        {trabajo.comentario ? (
          <p className="text-sm text-neutral-600">
            <span className="font-medium text-neutral-800">{trabajo.comentario.autorNombre}: </span>"
            {trabajo.comentario.comentario}"
          </p>
        ) : trabajo.clienteId ? (
          <p className="text-sm text-neutral-500">Cliente vinculado, todavía sin comentario.</p>
        ) : (
          <form onSubmit={alVincular} className="flex flex-wrap gap-2">
            <input
              type="email"
              required
              placeholder="Email del cliente para vincularlo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900"
            />
            <Button type="submit" tamano="md" disabled={vincular.isPending}>
              Vincular
            </Button>
          </form>
        )}
        {error && <p className="mt-1 text-sm text-danger-500">{error}</p>}
      </div>
    </li>
  )
}
