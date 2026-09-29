import { ImagePlus, X } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { useAuth } from '../../features/auth/useAuth'
import { useActualizarTrabajo, useCrearTrabajo } from '../../features/trabajos/queries'
import type { TrabajoPublicado } from '../../features/trabajos/types'
import { subirFoto } from '../../lib/storage'
import { cn } from '../../lib/cn'
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
      evento.target.value = ''
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
    <form onSubmit={guardar} className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Título del trabajo</span>
        <input
          type="text"
          required
          placeholder="Ej. Reforma de baño completo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900"
        />
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Descripción (opcional)</span>
        <textarea
          rows={2}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900"
        />
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Fecha (opcional)</span>
        <input
          type="date"
          value={realizadoEn}
          onChange={(e) => setRealizadoEn(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 sm:w-48"
        />
      </label>

      <div className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Fotos</span>
        <div className="flex flex-wrap gap-3">
          {fotos.map((url) => (
            <div key={url} className="group relative h-24 w-24 overflow-hidden rounded-lg">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setFotos(fotos.filter((f) => f !== url))}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                aria-label="Quitar foto"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          <label
            htmlFor="foto-trabajo-nueva"
            className={cn(
              'flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 text-neutral-500 hover:border-brand-400 hover:text-brand-600',
              subiendo && 'pointer-events-none opacity-50',
            )}
          >
            <ImagePlus className="h-5 w-5" />
            <span className="text-xs font-medium">{subiendo ? 'Subiendo…' : 'Añadir'}</span>
          </label>
          <input
            id="foto-trabajo-nueva"
            type="file"
            accept="image/*"
            onChange={subirFotoNueva}
            disabled={subiendo}
            className="hidden"
          />
        </div>
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
