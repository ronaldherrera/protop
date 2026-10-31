import { Link } from 'react-router-dom'
import {
  useBorrarFichaSinReclamar,
  useDescartarPeticionBaja,
  usePeticionesBaja,
  useReclamacionesPendientes,
  useResolverReclamacion,
} from '../../features/reclamaciones/queries'
import { EmptyState } from '../estado/EmptyState'
import { ErrorState } from '../estado/ErrorState'
import { LoadingState } from '../estado/LoadingState'
import { Button } from '../ui/Button'

function fecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Reclamaciones que no se aprobaron solas: el email de la cuenta no es el de la ficha. */
export function ReclamacionesPendientes() {
  const reclamaciones = useReclamacionesPendientes()
  const resolver = useResolverReclamacion()

  if (reclamaciones.isLoading) return <LoadingState etiqueta="Cargando…" />
  if (reclamaciones.isError) return <ErrorState descripcion="No se han podido cargar las reclamaciones." />
  if (!reclamaciones.data?.length) {
    return (
      <div className="mt-3">
        <EmptyState titulo="No hay reclamaciones por revisar" />
      </div>
    )
  }

  return (
    <ul className="mt-3 flex flex-col gap-3">
      {reclamaciones.data.map((r) => (
        <li key={r.id} className="rounded-tarjeta bg-white p-4 ring-1 ring-neutral-200">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <Link to={`/profesionales/${r.slug}`} className="font-semibold text-brand-700 hover:underline">
              {r.nombreComercial}
            </Link>
            <span className="text-xs text-neutral-500">{fecha(r.creadaEn)}</span>
          </div>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="text-neutral-500">Email de la cuenta</dt>
            <dd className="text-neutral-900">{r.emailCuenta}</dd>
            <dt className="text-neutral-500">Email de la ficha</dt>
            <dd className="text-neutral-900">{r.emailFicha ?? 'Sin email'}</dd>
          </dl>
          {r.mensaje && <p className="mt-2 rounded-md bg-neutral-50 px-3 py-2 text-sm text-neutral-700">{r.mensaje}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" disabled={resolver.isPending} onClick={() => resolver.mutate({ id: r.id, aprobar: true })}>
              Darle la ficha
            </Button>
            <Button
              type="button"
              variante="secundario"
              disabled={resolver.isPending}
              onClick={() => resolver.mutate({ id: r.id, aprobar: false, motivo: 'No se ha podido comprobar' })}
            >
              Rechazar
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Peticiones de borrar fichas creadas por Protop. */
export function PeticionesBaja() {
  const peticiones = usePeticionesBaja()
  const borrar = useBorrarFichaSinReclamar()
  const descartar = useDescartarPeticionBaja()

  if (peticiones.isLoading) return <LoadingState etiqueta="Cargando…" />
  if (peticiones.isError) return <ErrorState descripcion="No se han podido cargar las peticiones de baja." />
  if (!peticiones.data?.length) {
    return (
      <div className="mt-3">
        <EmptyState titulo="No hay peticiones de baja" />
      </div>
    )
  }

  return (
    <ul className="mt-3 flex flex-col gap-3">
      {peticiones.data.map((p) => (
        <li key={p.id} className="rounded-tarjeta bg-white p-4 ring-1 ring-neutral-200">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <Link to={`/profesionales/${p.slug}`} className="font-semibold text-brand-700 hover:underline">
              {p.nombreComercial}
            </Link>
            <span className="text-xs text-neutral-500">{fecha(p.creadaEn)}</span>
          </div>
          <p className="mt-1 text-sm text-neutral-700">Contacto: {p.contacto}</p>
          {p.motivo && <p className="mt-2 rounded-md bg-neutral-50 px-3 py-2 text-sm text-neutral-700">{p.motivo}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" disabled={borrar.isPending} onClick={() => borrar.mutate(p.profesionalId)}>
              Borrar la ficha
            </Button>
            <Button type="button" variante="secundario" disabled={descartar.isPending} onClick={() => descartar.mutate(p.id)}>
              Descartar
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
