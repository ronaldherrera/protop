import { X } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { useAuth } from '../../features/auth/useAuth'
import { useActualizarTrabajo, useCrearTrabajo } from '../../features/trabajos/queries'
import type { TrabajoPublicado } from '../../features/trabajos/types'
import { subirFoto } from '../../lib/storage'
import { Button } from '../ui/Button'

export function FormularioTrabajo({
  profesionalId,
  trabajo,
  onGuardado,
  onCancelar,
}: {
  profesionalId: string
  trabajo: TrabajoPublicado | null
  onGuardado: () => void
  onCancelar: () => void
}) {
  const { user } = useAuth()
  const crear = useCrearTrabajo(profesionalId)
  const actualizar = useActualizarTrabajo(profesionalId)

  const [titulo, setTitulo] = useState(trabajo?.titulo ?? '')
  const [descripcion, setDescripcion] = useState(trabajo?.descripcion ?? '')
  const [realizadoEn, setRealizadoEn] = useState(trabajo?.realizadoEn ?? '')
  const [fotos, setFotos] = useState<string[]>(trabajo?.fotos ?? [])
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const guardando = crear.isPending || actualizar.isPending

  async function subirFotoNueva(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0]
    if (!archivo || !user) return
    setSubiendo(true)
    try {
      const url = await subirFoto(user.id, archivo)
      setFotos((actuales) => [...actuales, url])
    } catch {
      setError('No se ha podido subir la foto.')
    } finally {
      setSubiendo(false)
    }
  }

  async function guardar(evento: FormEvent) {
    evento.preventDefault()
    setError(null)
    if (!titulo.trim()) {
      setError('Ponle un título al trabajo.')
      return
    }
    const datos = { titulo, descripcion, realizadoEn, fotos }
    try {
      if (trabajo) {
        await actualizar.mutateAsync({ id: trabajo.id, datos })
      } else {
        await crear.mutateAsync(datos)
      }
      onGuardado()
    } catch {
      setError('No se ha podido guardar. Inténtalo de nuevo.')
    }
  }

  return (
    <form onSubmit={guardar} className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4">
      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Título del trabajo</span>
        <input
          type="text"
          required
          placeholder="Ej. Reforma de baño completo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
        />
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Descripción (opcional)</span>
        <textarea
          rows={2}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
        />
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Fecha (opcional)</span>
        <input
          type="date"
          value={realizadoEn}
          onChange={(e) => setRealizadoEn(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 sm:w-48"
        />
      </label>

      <div className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Fotos</span>
        <div className="flex flex-wrap gap-2">
          {fotos.map((url) => (
            <div key={url} className="relative">
              <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => setFotos(fotos.filter((f) => f !== url))}
                className="absolute -right-2 -top-2 rounded-full bg-white p-0.5 shadow"
                aria-label="Quitar foto"
              >
                <X className="h-4 w-4 text-neutral-700" />
              </button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" onChange={subirFotoNueva} disabled={subiendo} className="mt-2" />
      </div>

      {error && <p className="text-sm text-danger-500">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={guardando || subiendo}>
          {guardando ? 'Guardando…' : 'Guardar trabajo'}
        </Button>
        <Button type="button" variante="secundario" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
