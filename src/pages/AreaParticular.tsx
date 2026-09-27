import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/estado/EmptyState'
import { ErrorState } from '../components/estado/ErrorState'
import { LoadingState } from '../components/estado/LoadingState'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { actualizarPerfil, type Perfil } from '../features/auth/api'
import { useInvalidarPerfil, usePerfil } from '../features/auth/queries'
import { useAuth } from '../features/auth/useAuth'
import { useMisValoraciones } from '../features/valoraciones/queries'
import type { EstadoValoracion } from '../features/valoraciones/types'

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

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900">Mis valoraciones</h2>
        <MisValoraciones />
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-500">
        Aquí verás tus solicitudes de presupuesto y las propuestas recibidas cuando esas funciones estén disponibles,
        en próximas fases.
      </div>
    </div>
  )
}

const ETIQUETA_ESTADO: Record<EstadoValoracion, { texto: string; tono: 'aviso' | 'exito' | 'error' }> = {
  pendiente: { texto: 'Pendiente de revisión', tono: 'aviso' },
  aprobada: { texto: 'Aprobada', tono: 'exito' },
  rechazada: { texto: 'Rechazada', tono: 'error' },
}

function MisValoraciones() {
  const valoraciones = useMisValoraciones()

  if (valoraciones.isLoading) {
    return <LoadingState etiqueta="Cargando tus valoraciones…" />
  }

  if (valoraciones.isError) {
    return <ErrorState descripcion="No hemos podido cargar tus valoraciones." />
  }

  if (!valoraciones.data || valoraciones.data.length === 0) {
    return (
      <div className="mt-3">
        <EmptyState
          titulo="Todavía no has valorado ningún trabajo"
          descripcion="Entra en la ficha de un profesional que hayas contratado para valorarlo."
        />
      </div>
    )
  }

  return (
    <ul className="mt-3 flex flex-col gap-2">
      {valoraciones.data.map((valoracion) => {
        const estado = ETIQUETA_ESTADO[valoracion.estado]
        return (
          <li
            key={valoracion.id}
            className="flex flex-col gap-1 rounded-lg border border-neutral-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <Link
                to={`/profesionales/${valoracion.profesionalSlug}`}
                className="text-sm font-medium text-brand-700 hover:underline"
              >
                {valoracion.profesionalNombre}
              </Link>
              {valoracion.estado === 'rechazada' && valoracion.motivoRevision && (
                <p className="mt-0.5 text-xs text-neutral-500">Motivo: {valoracion.motivoRevision}</p>
              )}
            </div>
            <Badge tono={estado.tono}>{estado.texto}</Badge>
          </li>
        )
      })}
    </ul>
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
