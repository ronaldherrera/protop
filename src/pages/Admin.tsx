import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/estado/EmptyState'
import { ErrorState } from '../components/estado/ErrorState'
import { LoadingState } from '../components/estado/LoadingState'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useAbrirSolicitudManualmente, useSolicitudesPendientesPago } from '../features/solicitudes/queries'
import { useRevisarValoracion, useValoracionesParaRevision } from '../features/valoraciones/queries'
import type { ValoracionParaRevision } from '../features/valoraciones/types'
import { obtenerUrlFirmadaFactura } from '../lib/storage'
import { CONCEPTOS_VALORACION } from '../types/profesional'

export function Admin() {
  const valoraciones = useValoracionesParaRevision()

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Administración</h1>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900">Solicitudes pendientes de pago</h2>
        <p className="mt-1 text-sm text-neutral-600">
          El cobro real todavía no está activado (Fase 6). Ábrelas manualmente para que las vean los profesionales.
        </p>
        <SolicitudesPendientesPago />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900">Revisión de valoraciones</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Solo cuentan para la puntuación del profesional las valoraciones aprobadas. Revisa la factura antes de
          decidir.
        </p>
        <ValoracionesRevision valoraciones={valoraciones} />
      </section>
    </div>
  )
}

function SolicitudesPendientesPago() {
  const solicitudes = useSolicitudesPendientesPago()
  const abrir = useAbrirSolicitudManualmente()

  if (solicitudes.isLoading) {
    return <LoadingState etiqueta="Cargando…" />
  }

  if (solicitudes.isError) {
    return <ErrorState descripcion="No hemos podido cargar las solicitudes pendientes de pago." />
  }

  if (!solicitudes.data || solicitudes.data.length === 0) {
    return (
      <div className="mt-3">
        <EmptyState titulo="No hay solicitudes pendientes de pago" />
      </div>
    )
  }

  return (
    <ul className="mt-3 flex flex-col gap-2">
      {solicitudes.data.map((s) => (
        <li
          key={s.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-200 px-4 py-3"
        >
          <div>
            <Link to={`/solicitudes/${s.id}`} className="text-sm font-medium text-brand-700 hover:underline">
              {s.titulo}
            </Link>
            <p className="text-xs text-neutral-500">
              {s.categoriaNombre} · {s.zonaNombre}
            </p>
          </div>
          <Button type="button" onClick={() => abrir.mutate(s.id)} disabled={abrir.isPending}>
            Marcar como pagada y abrir
          </Button>
        </li>
      ))}
    </ul>
  )
}

function ValoracionesRevision({ valoraciones }: { valoraciones: ReturnType<typeof useValoracionesParaRevision> }) {
  if (valoraciones.isLoading) {
    return <LoadingState etiqueta="Cargando valoraciones…" />
  }

  if (valoraciones.isError) {
    return <ErrorState descripcion="No hemos podido cargar la cola de revisión." />
  }

  const pendientes = valoraciones.data?.filter((v) => v.estado === 'pendiente') ?? []
  const revisadas = valoraciones.data?.filter((v) => v.estado !== 'pendiente') ?? []

  return (
    <>
      <h3 className="mt-6 font-medium text-neutral-900">Pendientes ({pendientes.length})</h3>
      {pendientes.length === 0 ? (
        <div className="mt-3">
          <EmptyState titulo="No hay valoraciones pendientes" />
        </div>
      ) : (
        <ul className="mt-3 flex flex-col gap-4">
          {pendientes.map((valoracion) => (
            <TarjetaRevision key={valoracion.id} valoracion={valoracion} />
          ))}
        </ul>
      )}

      {revisadas.length > 0 && (
        <>
          <h3 className="mt-8 font-medium text-neutral-900">Revisadas recientemente</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {revisadas.slice(0, 20).map((valoracion) => (
              <li
                key={valoracion.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-2 text-sm"
              >
                <span>
                  {valoracion.profesionalNombre} · {valoracion.particularNombre}
                </span>
                <Badge tono={valoracion.estado === 'aprobada' ? 'exito' : 'error'}>
                  {valoracion.estado === 'aprobada' ? 'Aprobada' : 'Rechazada'}
                </Badge>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}

function TarjetaRevision({ valoracion }: { valoracion: ValoracionParaRevision }) {
  const revisar = useRevisarValoracion()
  const [motivo, setMotivo] = useState('')
  const [cargandoFactura, setCargandoFactura] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function verFactura() {
    setCargandoFactura(true)
    setError(null)
    try {
      const url = await obtenerUrlFirmadaFactura(valoracion.facturaRuta)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      setError('No se ha podido abrir la factura.')
    } finally {
      setCargandoFactura(false)
    }
  }

  async function aprobar() {
    try {
      await revisar.mutateAsync({ id: valoracion.id, estado: 'aprobada', motivo: null })
    } catch {
      setError('No se ha podido aprobar. Inténtalo de nuevo.')
    }
  }

  async function rechazar() {
    if (!motivo.trim()) {
      setError('Indica un motivo para rechazarla.')
      return
    }
    try {
      await revisar.mutateAsync({ id: valoracion.id, estado: 'rechazada', motivo })
    } catch {
      setError('No se ha podido rechazar. Inténtalo de nuevo.')
    }
  }

  return (
    <li className="rounded-xl border border-neutral-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-medium text-neutral-900">{valoracion.profesionalNombre}</p>
          <p className="text-sm text-neutral-500">Enviada por {valoracion.particularNombre}</p>
        </div>
        <Button type="button" variante="secundario" onClick={verFactura} disabled={cargandoFactura}>
          {cargandoFactura ? 'Abriendo…' : 'Ver factura'}
        </Button>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        {CONCEPTOS_VALORACION.filter((c) => valoracion.conceptos[c.id] !== undefined).map((c) => (
          <div key={c.id} className="flex justify-between gap-2 rounded bg-neutral-50 px-2 py-1">
            <dt className="text-neutral-600">{c.etiqueta}</dt>
            <dd className="font-medium text-neutral-900">{valoracion.conceptos[c.id]}/5</dd>
          </div>
        ))}
      </dl>

      {valoracion.descripcionTrabajo && (
        <p className="mt-3 text-sm text-neutral-600">
          <span className="font-medium text-neutral-700">Aclaración: </span>
          {valoracion.descripcionTrabajo}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button type="button" onClick={aprobar} disabled={revisar.isPending}>
          Aprobar
        </Button>
        <input
          type="text"
          placeholder="Motivo de rechazo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900"
        />
        <Button type="button" variante="secundario" onClick={rechazar} disabled={revisar.isPending}>
          Rechazar
        </Button>
      </div>

      {error && <p className="mt-2 text-sm text-danger-500">{error}</p>}
    </li>
  )
}
