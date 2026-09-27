import { type FormEvent, useState } from 'react'
import { ErrorState } from '../components/estado/ErrorState'
import { LoadingState } from '../components/estado/LoadingState'
import { Button } from '../components/ui/Button'
import { actualizarPerfil, type Perfil } from '../features/auth/api'
import { useInvalidarPerfil, usePerfil } from '../features/auth/queries'
import { useAuth } from '../features/auth/useAuth'

export function AreaParticular() {
  const { user } = useAuth()
  const perfil = usePerfil()

  if (perfil.isLoading) {
    return <LoadingState etiqueta="Cargando tu perfil…" />
  }

  if (perfil.isError || !user || !perfil.data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <ErrorState descripcion="No hemos podido cargar tu perfil. Inténtalo de nuevo en unos segundos." />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Tu cuenta</h1>
      <p className="mt-1 text-sm text-neutral-600">{user.email}</p>

      <FormularioPerfil key={perfil.data.id} userId={user.id} perfil={perfil.data} />

      <div className="mt-10 rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-500">
        Aquí verás tus solicitudes de presupuesto, las propuestas recibidas y tus valoraciones enviadas cuando esas
        funciones estén disponibles, en próximas fases.
      </div>
    </div>
  )
}

function FormularioPerfil({ userId, perfil }: { userId: string; perfil: Perfil }) {
  const invalidarPerfil = useInvalidarPerfil()
  const [nombre, setNombre] = useState(perfil.nombre)
  const [telefono, setTelefono] = useState(perfil.telefono ?? '')
  const [guardando, setGuardando] = useState(false)
  const [guardadoOk, setGuardadoOk] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function guardar(evento: FormEvent) {
    evento.preventDefault()
    setGuardando(true)
    setError(null)
    setGuardadoOk(false)
    try {
      await actualizarPerfil(userId, { nombre, telefono: telefono || null })
      invalidarPerfil()
      setGuardadoOk(true)
    } catch {
      setError('No se ha podido guardar. Inténtalo de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={guardar} className="mt-6 flex flex-col gap-4">
      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Nombre</span>
        <input
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
        />
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Teléfono (opcional)</span>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
        />
      </label>

      {error && <p className="text-sm text-danger-500">{error}</p>}
      {guardadoOk && <p className="text-sm text-success-500">Perfil actualizado.</p>}

      <Button type="submit" disabled={guardando} className="sm:w-auto">
        {guardando ? 'Guardando…' : 'Guardar'}
      </Button>
    </form>
  )
}
