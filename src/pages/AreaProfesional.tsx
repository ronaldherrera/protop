import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorState } from '../components/estado/ErrorState'
import { LoadingState } from '../components/estado/LoadingState'
import { SelectorModo } from '../components/layout/SelectorModo'
import { GestionTrabajos } from '../components/trabajos/GestionTrabajos'
import { cerrarSesion } from '../features/auth/api'
import { usePerfil } from '../features/auth/queries'
import { useAuth } from '../features/auth/useAuth'
import { cn } from '../lib/cn'
import { useCategorias, useFamilias, useMiProfesional, useZonas } from '../features/directorio/queries'
import type { Profesional } from '../types/profesional'
import { TarjetaPerfilLateral } from '../components/profesional/TarjetaPerfilLateral'
import { SolicitudesDisponibles } from '../components/profesional/SolicitudesDisponibles'
import { MisPropuestas } from '../components/profesional/MisPropuestas'
import { FormularioFicha } from '../components/profesional/FormularioFicha'
import { GestionarPerfil } from '../components/profesional/GestionarPerfil'

type Seccion = 'solicitudes' | 'propuestas' | 'trabajos'

export function AreaProfesional() {
  const { user } = useAuth()
  const perfil = usePerfil()
  const miProfesional = useMiProfesional()
  const familias = useFamilias()
  const categorias = useCategorias()
  const zonas = useZonas()
  const navigate = useNavigate()
  const [editando, setEditando] = useState(false)
  const [seccion, setSeccion] = useState<Seccion>('solicitudes')

  async function salir() {
    await cerrarSesion()
    navigate('/')
  }

  if (miProfesional.isLoading || familias.isLoading || categorias.isLoading || zonas.isLoading) {
    return <LoadingState etiqueta="Cargando tu ficha…" />
  }

  if (miProfesional.isError || familias.isError || categorias.isError || zonas.isError || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <ErrorState descripcion="No hemos podido cargar tu área profesional. Inténtalo de nuevo en unos segundos." />
      </div>
    )
  }

  const tieneFicha = Boolean(miProfesional.data)

  if (!tieneFicha) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-neutral-900">Tu perfil de profesional</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Rellena estos datos para aparecer en el directorio de Protop. Gratis, sin comisión por el trabajo.
        </p>
        <FormularioFicha
          key="nueva"
          userId={user.id}
          familias={familias.data ?? []}
          categorias={categorias.data ?? []}
          zonas={zonas.data ?? []}
          profesional={null}
        />
      </div>
    )
  }

  const profesional = miProfesional.data as Profesional

  if (editando) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-neutral-900">Gestionar perfil profesional</h1>
        <p className="mt-1 text-sm text-neutral-600">Edita los datos que ven los particulares en el directorio.</p>

        <button
          type="button"
          onClick={() => setEditando(false)}
          className="mt-4 text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          ← Volver a mi perfil
        </button>

        <GestionarPerfil
          userId={user.id}
          familias={familias.data ?? []}
          categorias={categorias.data ?? []}
          zonas={zonas.data ?? []}
          profesional={profesional}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
          <SelectorModo />

          <TarjetaPerfilLateral profesional={profesional} onEditar={() => setEditando(true)} />

          <nav className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-2">
            {perfil.data?.esAdmin && (
              <Link
                to="/admin"
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-50"
              >
                Administración
              </Link>
            )}
            <button
              type="button"
              onClick={salir}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-50"
            >
              Cerrar sesión
            </button>
          </nav>
        </aside>

        <div>
          <div className="flex gap-1 overflow-x-auto border-b border-neutral-200">
            {(['solicitudes', 'propuestas', 'trabajos'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeccion(s)}
                className={cn(
                  '-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium',
                  seccion === s
                    ? 'border-brand-600 text-brand-700'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700',
                )}
              >
                {s === 'solicitudes' && 'Solicitudes de presupuesto'}
                {s === 'propuestas' && 'Mis propuestas'}
                {s === 'trabajos' && 'Mis trabajos'}
              </button>
            ))}
          </div>

          {seccion === 'solicitudes' && (
            <div className="mt-6">
              <SolicitudesDisponibles
                familias={familias.data ?? []}
                categorias={categorias.data ?? []}
                zonas={zonas.data ?? []}
                categoriaIdsProfesional={profesional.oficios.map((o) => o.id)}
                zonaSlugsProfesional={profesional.zonasTrabajo}
              />
            </div>
          )}

          {seccion === 'propuestas' && (
            <div className="mt-6">
              <MisPropuestas profesionalId={profesional.id} />
            </div>
          )}

          {seccion === 'trabajos' && (
            <div className="mt-6">
              <p className="text-sm text-neutral-600">
                Muestra trabajos reales en tu perfil. Puedes vincular al cliente para que, si quiere, deje un comentario
                — es opcional y no afecta a tu puntuación oficial.
              </p>
              <div className="mt-3">
                <GestionTrabajos profesionalId={profesional.id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
