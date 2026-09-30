import { Phone } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/estado/EmptyState'
import { ErrorState } from '../components/estado/ErrorState'
import { LoadingState } from '../components/estado/LoadingState'
import { SelectorModo } from '../components/layout/SelectorModo'
import { FormularioComentario } from '../components/trabajos/FormularioComentario'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { actualizarPerfil, type Perfil } from '../features/auth/api'
import { useInvalidarPerfil, usePerfil } from '../features/auth/queries'
import { useAuth } from '../features/auth/useAuth'
import { useMisSolicitudes } from '../features/solicitudes/queries'
import type { EstadoSolicitud } from '../features/solicitudes/types'
import { useTrabajosVinculados } from '../features/trabajos/queries'
import { useMisValoraciones } from '../features/valoraciones/queries'
import type { EstadoValoracion } from '../features/valoraciones/types'
import { cn } from '../lib/cn'

type Seccion = 'solicitudes' | 'valoraciones' | 'trabajos'

const PESTANAS: { id: Seccion; etiqueta: string }[] = [
  { id: 'solicitudes', etiqueta: 'Mis solicitudes' },
  { id: 'valoraciones', etiqueta: 'Mis valoraciones' },
  { id: 'trabajos', etiqueta: 'Trabajos vinculados' },
]

export function AreaParticular() {
  const { user } = useAuth()
  const perfil = usePerfil()
  const [editando, setEditando] = useState(false)
  const [seccion, setSeccion] = useState<Seccion>('solicitudes')

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

  if (editando) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-neutral-900">Gestionar cuenta</h1>
        <p className="mt-1 text-sm text-neutral-600">{user.email}</p>

        <button
          type="button"
          onClick={() => setEditando(false)}
          className="mt-4 text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          ← Volver a mi cuenta
        </button>

        <FormularioPerfil key={perfil.data.id} userId={user.id} perfil={perfil.data} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
          <SelectorModo />

          <TarjetaCuentaLateral perfil={perfil.data} email={user.email ?? ''} onEditar={() => setEditando(true)} />

          <nav className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-2">
            {PESTANAS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSeccion(p.id)}
                className={cn(
                  'rounded-lg px-3 py-2 text-left text-sm font-medium',
                  seccion === p.id ? 'bg-brand-50 text-brand-700' : 'text-neutral-600 hover:bg-neutral-50',
                )}
              >
                {p.etiqueta}
              </button>
            ))}
            {perfil.data.esAdmin && (
              <>
                <div className="my-1 border-t border-neutral-100" />
                <Link
                  to="/admin"
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-50"
                >
                  Administración
                </Link>
              </>
            )}
          </nav>
        </aside>

        <div>
          {seccion === 'solicitudes' && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-600">Solicitudes de presupuesto que has creado.</p>
                <Link to="/solicitar-presupuesto" className="text-sm font-medium text-brand-700 hover:underline">
                  + Nueva solicitud
                </Link>
              </div>
              <MisSolicitudes />
            </div>
          )}

          {seccion === 'valoraciones' && (
            <div className="mt-6">
              <MisValoraciones />
            </div>
          )}

          {seccion === 'trabajos' && (
            <div className="mt-6">
              <p className="text-sm text-neutral-600">
                Trabajos que un profesional ha publicado y en los que te ha vinculado como cliente. Comentar es
                opcional.
              </p>
              <TrabajosVinculados />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TarjetaCuentaLateral({
  perfil,
  email,
  onEditar,
}: {
  perfil: Perfil
  email: string
  onEditar: () => void
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-col items-center text-center">
        <Avatar nombre={perfil.nombre} className="h-20 w-20 rounded-2xl text-2xl" />
        <h2 className="mt-3 text-lg font-bold text-neutral-900">{perfil.nombre}</h2>
        <p className="text-sm text-neutral-500">{email}</p>
      </div>

      {perfil.telefono && (
        <div className="mt-4 flex items-center gap-2 border-t border-neutral-100 pt-3 text-sm text-neutral-600">
          <Phone className="h-4 w-4 shrink-0" aria-hidden="true" /> {perfil.telefono}
        </div>
      )}

      <div className="mt-4 border-t border-neutral-100 pt-3">
        <Button type="button" variante="secundario" onClick={onEditar} className="w-full">
          Gestionar cuenta
        </Button>
      </div>
    </div>
  )
}

function TrabajosVinculados() {
  const trabajos = useTrabajosVinculados()

  if (trabajos.isLoading) {
    return <LoadingState etiqueta="Cargando…" />
  }

  if (trabajos.isError) {
    return <ErrorState descripcion="No hemos podido cargar tus trabajos vinculados." />
  }

  if (!trabajos.data || trabajos.data.length === 0) {
    return (
      <div className="mt-3">
        <EmptyState titulo="Todavía no te han vinculado a ningún trabajo" />
      </div>
    )
  }

  return (
    <ul className="mt-3 flex flex-col gap-3">
      {trabajos.data.map((trabajo) => (
        <li key={trabajo.id} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <Link to={`/profesionales/${trabajo.profesionalSlug}`} className="text-sm font-medium text-brand-700 hover:underline">
            {trabajo.profesionalNombre}
          </Link>
          <p className="mt-0.5 text-sm text-neutral-800">{trabajo.titulo}</p>
          {trabajo.comentario ? (
            <p className="mt-2 text-sm text-neutral-600">Tu comentario: "{trabajo.comentario.comentario}"</p>
          ) : (
            <div className="mt-2">
              <FormularioComentario trabajoId={trabajo.id} />
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

const ETIQUETA_ESTADO_SOLICITUD: Record<EstadoSolicitud, { texto: string; tono: 'neutro' | 'aviso' | 'exito' | 'error' }> = {
  borrador: { texto: 'Borrador', tono: 'neutro' },
  pendiente_pago: { texto: 'Pendiente de pago', tono: 'aviso' },
  abierta: { texto: 'Abierta', tono: 'exito' },
  cerrada: { texto: 'Cerrada', tono: 'error' },
}

function MisSolicitudes() {
  const solicitudes = useMisSolicitudes()

  if (solicitudes.isLoading) {
    return <LoadingState etiqueta="Cargando tus solicitudes…" />
  }

  if (solicitudes.isError) {
    return <ErrorState descripcion="No hemos podido cargar tus solicitudes." />
  }

  if (!solicitudes.data || solicitudes.data.length === 0) {
    return (
      <div className="mt-3">
        <EmptyState
          titulo="Todavía no has creado ninguna solicitud"
          descripcion="Describe el trabajo que necesitas y recibe propuestas de varios profesionales."
        />
      </div>
    )
  }

  return (
    <ul className="mt-3 flex flex-col gap-2">
      {solicitudes.data.map((s) => {
        const estado = ETIQUETA_ESTADO_SOLICITUD[s.estado]
        return (
          <li key={s.id}>
            <Link
              to={`/solicitudes/${s.id}`}
              className="flex flex-col gap-1 rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm hover:bg-neutral-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-neutral-900">{s.titulo}</p>
                <p className="text-xs text-neutral-500">
                  {s.categoriaNombre} · {s.zonaNombre}
                </p>
              </div>
              <Badge tono={estado.tono}>{estado.texto}</Badge>
            </Link>
          </li>
        )
      })}
    </ul>
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
            className="flex flex-col gap-1 rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
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
    <form onSubmit={guardar} className="mt-6 flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Nombre</span>
        <input
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900"
        />
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Teléfono (opcional)</span>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900"
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
