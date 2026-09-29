import { Pencil, Trash2 } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { EmptyState } from '../estado/EmptyState'
import { ErrorState } from '../estado/ErrorState'
import { LoadingState } from '../estado/LoadingState'
import { Button } from '../ui/Button'
import { Lightbox } from '../ui/Lightbox'
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
  const [fotoAbierta, setFotoAbierta] = useState<number | null>(null)

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
    <li className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-neutral-900">{trabajo.titulo}</p>
          {trabajo.descripcion && <p className="mt-1 text-sm text-neutral-600">{trabajo.descripcion}</p>}
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={onEditar}
            aria-label="Editar trabajo"
            className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => borrar.mutate(trabajo.id)}
            aria-label="Borrar trabajo"
            className="rounded-lg p-1.5 text-neutral-500 hover:bg-danger-100 hover:text-danger-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {trabajo.fotos.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {trabajo.fotos.map((url, indice) => (
            <button
              type="button"
              key={url}
              onClick={() => setFotoAbierta(indice)}
              className="group aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {fotoAbierta !== null && (
        <Lightbox
          fotos={trabajo.fotos}
          indiceInicial={fotoAbierta}
          onCerrar={() => setFotoAbierta(null)}
          titulo={trabajo.titulo}
          descripcion={trabajo.descripcion}
        />
      )}

      <div className="mt-3 border-t border-neutral-100 pt-3">
        {trabajo.comentario ? (
          <blockquote className="rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
            "{trabajo.comentario.comentario}"
            <footer className="mt-1 text-xs text-neutral-500">— {trabajo.comentario.autorNombre}, cliente</footer>
          </blockquote>
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
              className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-900"
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
