import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HiloAclaraciones } from '../components/solicitudes/HiloAclaraciones'
import { FormularioPropuesta } from '../components/solicitudes/FormularioPropuesta'
import { TarjetaPropuesta } from '../components/solicitudes/TarjetaPropuesta'
import { EmptyState } from '../components/estado/EmptyState'
import { ErrorState } from '../components/estado/ErrorState'
import { LoadingState } from '../components/estado/LoadingState'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useAuth } from '../features/auth/useAuth'
import { useMiProfesional } from '../features/directorio/queries'
import {
  useCerrarSolicitud,
  usePublicarSolicitud,
  useMiPropuesta,
  usePropuestasDeSolicitud,
  useSolicitud,
} from '../features/solicitudes/queries'
import type { EstadoSolicitud } from '../features/solicitudes/types'
import { obtenerUrlFirmadaFotoSolicitud } from '../lib/storage'

const ETIQUETA_ESTADO: Record<EstadoSolicitud, { texto: string; tono: 'neutro' | 'aviso' | 'exito' | 'error' }> = {
  borrador: { texto: 'Borrador', tono: 'neutro' },
  pendiente_pago: { texto: 'Pendiente de pago', tono: 'aviso' },
  abierta: { texto: 'Abierta', tono: 'exito' },
  cerrada: { texto: 'Cerrada', tono: 'error' },
}

function FotosSolicitud({ rutas }: { rutas: string[] }) {
  const [urls, setUrls] = useState<string[]>([])

  useEffect(() => {
    let cancelado = false
    Promise.all(rutas.map((ruta) => obtenerUrlFirmadaFotoSolicitud(ruta).catch(() => null))).then((resultado) => {
      if (!cancelado) setUrls(resultado.filter((url): url is string => Boolean(url)))
    })
    return () => {
      cancelado = true
    }
  }, [rutas])

  if (rutas.length === 0 || urls.length === 0) return null

  return (
    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {urls.map((url) => (
        <img key={url} src={url} alt="Foto del trabajo" className="aspect-4/3 w-full rounded-lg object-cover" />
      ))}
    </div>
  )
}

export function SolicitudDetalle() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const solicitud = useSolicitud(id)
  const miProfesional = useMiProfesional()
  const propuestas = usePropuestasDeSolicitud(id)
  const miPropuesta = useMiPropuesta(id, miProfesional.data?.id)
  const publicar = usePublicarSolicitud()
  const cerrar = useCerrarSolicitud()

  if (solicitud.isLoading) {
    return <LoadingState etiqueta="Cargando solicitud…" />
  }

  if (solicitud.isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <ErrorState descripcion="No hemos podido cargar esta solicitud. Inténtalo de nuevo en unos segundos." />
      </div>
    )
  }

  if (!solicitud.data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <EmptyState
          titulo="No encontramos esta solicitud"
          descripcion="Puede que ya no exista o que no tengas acceso a ella."
        />
      </div>
    )
  }

  const s = solicitud.data
  const esPropietario = user?.id === s.particularId
  const esProfesionalConFicha = Boolean(miProfesional.data) && !esPropietario
  const estado = ETIQUETA_ESTADO[s.estado]

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{s.titulo}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {s.categoriaNombre} · {s.zonaNombre}
          </p>
        </div>
        <Badge tono={estado.tono}>{estado.texto}</Badge>
      </div>

      <p className="mt-4 whitespace-pre-line text-neutral-700">{s.descripcion}</p>
      {s.medidasCantidades && <p className="mt-2 text-sm text-neutral-600">Medidas/cantidades: {s.medidasCantidades}</p>}
      {s.fechaDeseada && <p className="mt-1 text-sm text-neutral-600">Cuándo: {s.fechaDeseada}</p>}
      {s.informacionAdicional && <p className="mt-2 text-sm text-neutral-600">{s.informacionAdicional}</p>}
      <FotosSolicitud rutas={s.fotos} />

      {esPropietario && s.estado === 'borrador' && (
        <div className="mt-6 rounded-xl border border-neutral-200 p-4">
          <p className="text-sm text-neutral-700">
            Esta solicitud está en borrador y solo la ves tú. Cuando la publiques, la verán los profesionales de ese
            oficio y te podrán enviar su propuesta. Es gratis.
          </p>
          <Button
            type="button"
            className="mt-3"
            onClick={() => publicar.mutate(s.id)}
            disabled={publicar.isPending}
          >
            {publicar.isPending ? 'Publicando…' : 'Publicar solicitud'}
          </Button>
        </div>
      )}
      {esPropietario && (s.estado === 'abierta' || s.estado === 'cerrada') && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Propuestas recibidas {propuestas.data ? `(${propuestas.data.length})` : ''}
            </h2>
            {s.estado === 'abierta' && (
              <Button type="button" variante="secundario" onClick={() => cerrar.mutate(s.id)} disabled={cerrar.isPending}>
                Cerrar solicitud
              </Button>
            )}
          </div>
          {propuestas.isLoading ? (
            <LoadingState etiqueta="Cargando propuestas…" />
          ) : !propuestas.data || propuestas.data.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                titulo="Todavía no has recibido propuestas"
                descripcion="Los profesionales de esta categoría y zona ya pueden ver tu solicitud."
              />
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-3">
              {propuestas.data.map((p) => (
                <TarjetaPropuesta key={p.id} propuesta={p} />
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-neutral-500">
            Una estimación orientativa no es la firma de un contrato definitivo. Contacta con el profesional que te
            interese a través de su ficha para confirmarlo.
          </p>
        </div>
      )}

      {esProfesionalConFicha && s.estado === 'abierta' && miProfesional.data && (
        <div className="mt-8">
          {miPropuesta.isLoading ? (
            <LoadingState etiqueta="Comprobando tu propuesta…" />
          ) : miPropuesta.data ? (
            <>
              <h2 className="mb-2 text-lg font-semibold text-neutral-900">Tu propuesta</h2>
              <TarjetaPropuesta propuesta={miPropuesta.data} />
            </>
          ) : (
            <FormularioPropuesta solicitudId={s.id} profesionalId={miProfesional.data.id} />
          )}
        </div>
      )}

      {!esPropietario && !esProfesionalConFicha && (
        <div className="mt-8">
          <EmptyState
            titulo="Publica tu ficha para responder"
            descripcion="Solo los profesionales con ficha en la categoría y zona de esta solicitud pueden enviar propuestas."
            accion={
              <Link to="/profesional" className="text-sm font-medium text-brand-700 hover:underline">
                Crear mi ficha →
              </Link>
            }
          />
        </div>
      )}

      {(esPropietario || (esProfesionalConFicha && miPropuesta.data)) && s.estado !== 'borrador' && (
        <div className="mt-8 border-t border-neutral-200 pt-6">
          <HiloAclaraciones solicitudId={s.id} puedeEscribir />
        </div>
      )}
    </div>
  )
}
