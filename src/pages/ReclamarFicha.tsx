import { CheckCircle2, Clock } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TarjetaProfesional } from '../components/directorio/TarjetaProfesional'
import { EmptyState } from '../components/estado/EmptyState'
import { LoadingState } from '../components/estado/LoadingState'
import { Button } from '../components/ui/Button'
import { baseBoton, tamanosBoton, variantesBoton } from '../components/ui/estilosBoton'
import { claseAreaTexto, claseEtiqueta } from '../components/ui/estilosFormulario'
import { useAuth } from '../features/auth/useAuth'
import { useProfesional } from '../features/directorio/queries'
import type { ResultadoReclamacion } from '../features/reclamaciones/api'
import { useReclamarFicha } from '../features/reclamaciones/queries'
import { cn } from '../lib/cn'
import { useSeo } from '../lib/useSeo'

const RESPUESTAS: Record<ResultadoReclamacion, { titulo: string; texto: string; ok: boolean }> = {
  reclamada: {
    titulo: 'La ficha ya es tuya',
    texto: 'El email de tu cuenta coincide con el de la ficha. Ya puedes completarla con tus fotos, tus servicios y cómo quieres que te contacten.',
    ok: true,
  },
  en_revision: {
    titulo: 'Lo estamos comprobando',
    texto: 'El email de tu cuenta no coincide con el que aparece en la ficha, así que lo revisamos a mano. Te avisaremos en cuanto esté.',
    ok: true,
  },
  ya_es_tuya: { titulo: 'Esta ficha ya es tuya', texto: 'Puedes editarla desde tu área de profesional.', ok: true },
  ya_reclamada: {
    titulo: 'Esta ficha ya tiene dueño',
    texto: 'Otra cuenta ya la ha reclamado. Si crees que es un error, pide ayuda desde la propia ficha.',
    ok: false,
  },
  ya_tienes_ficha: {
    titulo: 'Tu cuenta ya tiene una ficha',
    texto: 'Cada cuenta tiene una sola ficha. Si este negocio es el mismo que el tuyo, pide que borremos el duplicado desde la ficha.',
    ok: false,
  },
  no_reclamable: { titulo: 'Esta ficha no se puede reclamar', texto: 'Solo se reclaman las fichas creadas por Protop.', ok: false },
}

export function ReclamarFicha() {
  const { slug } = useParams<{ slug: string }>()
  const { user, cargando } = useAuth()
  const ficha = useProfesional(slug)
  const reclamar = useReclamarFicha()
  const [mensaje, setMensaje] = useState('')

  useSeo('Reclama tu ficha gratis | Protop', 'Reclama la ficha de tu negocio en Protop y empieza a recibir contactos y solicitudes.', {
    noIndex: true,
  })

  if (ficha.isLoading || cargando) return <LoadingState etiqueta="Cargando la ficha…" />

  const profesional = ficha.data
  if (!profesional) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <EmptyState titulo="No encontramos esta ficha" descripcion="Puede que el enlace esté mal o que la ficha se haya borrado." />
      </div>
    )
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    reclamar.mutate({ profesionalId: profesional!.id, mensaje })
  }

  const respuesta = reclamar.data ? RESPUESTAS[reclamar.data] : null
  const disponible = profesional.sinReclamar

  return (
    <div className="corcho min-h-[70vh] border-b border-[#a87a4a]">
      <div className="tablon-clavado mx-auto grid max-w-6xl items-start gap-x-10 gap-y-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:py-16">
        <div>
          <div className="chincheta rotate-[-0.6deg] rounded-tarjeta bg-white p-6 pt-8 shadow-tarjeta-alzada sm:p-9">
            {respuesta ? (
              <div>
                {respuesta.ok ? (
                  respuesta === RESPUESTAS.en_revision ? (
                    <Clock className="h-10 w-10 text-metro-500" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="h-10 w-10 text-accent-500" aria-hidden="true" />
                  )
                ) : null}
                <h1 className="titular mt-3 text-4xl text-neutral-900">{respuesta.titulo}</h1>
                <p className="mt-3 text-neutral-600">{respuesta.texto}</p>
                {(reclamar.data === 'reclamada' || reclamar.data === 'ya_es_tuya') && (
                  <Link to="/profesional" className={cn(baseBoton, variantesBoton.primario, tamanosBoton.lg, 'mt-6')}>
                    Completar mi ficha
                  </Link>
                )}
              </div>
            ) : !disponible ? (
              <div>
                <h1 className="titular text-4xl text-neutral-900">Esta ficha ya tiene dueño</h1>
                <p className="mt-3 text-neutral-600">Ya la gestiona el propio negocio desde su cuenta de Protop.</p>
              </div>
            ) : (
              <div>
                <h1 className="titular text-[2.4rem] leading-[1.02] text-neutral-900 sm:text-5xl">
                  ¿Es tu negocio? Reclama tu ficha
                </h1>
                <p className="mt-4 text-neutral-600">
                  Creamos esta ficha con los datos públicos de {profesional.nombreComercial} para que los vecinos te
                  encuentren. Reclamarla es gratis: podrás completarla, recibir solicitudes de trabajo de tu zona y
                  responderlas.
                </p>

                {!user ? (
                  <div className="mt-7">
                    <p className="text-sm text-neutral-600">
                      Crea tu cuenta o entra si ya la tienes: volverás aquí. Si usas{' '}
                      {profesional.contacto.email ? 'el mismo email que aparece en tu ficha' : 'tu email de empresa'}, la
                      ficha será tuya al momento.
                    </p>
                    <Link
                      to={`/acceso?rol=profesional&volver=${encodeURIComponent(`/reclamar/${profesional.slug}`)}`}
                      className={cn(baseBoton, variantesBoton.primario, tamanosBoton.lg, 'mt-5')}
                    >
                      Crear cuenta o entrar
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={enviar} className="mt-7 flex flex-col gap-4">
                    <label className="block">
                      <span className={claseEtiqueta}>Algo que nos ayude a comprobarlo (opcional)</span>
                      <textarea
                        rows={3}
                        value={mensaje}
                        onChange={(evento) => setMensaje(evento.target.value)}
                        placeholder="Por ejemplo: soy el titular, mi NIF empieza por…, mi web es…"
                        className={claseAreaTexto}
                      />
                      <span className="mt-1.5 block text-xs text-neutral-500">
                        Solo hace falta si el email de tu cuenta no es el de la ficha.
                      </span>
                    </label>
                    {reclamar.isError && (
                      <p className="rounded-md bg-danger-100 px-3 py-2 text-sm text-danger-500" role="alert">
                        No se ha podido enviar. Inténtalo de nuevo en unos minutos.
                      </p>
                    )}
                    <Button type="submit" tamano="lg" disabled={reclamar.isPending} className="self-start">
                      {reclamar.isPending ? 'Comprobando…' : 'Reclamar esta ficha'}
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="rotate-[1.6deg] lg:mt-8">
          <TarjetaProfesional profesional={profesional} />
        </div>
      </div>
    </div>
  )
}
