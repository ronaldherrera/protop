import { Globe, Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DesgloseValoraciones } from '../components/directorio/DesgloseValoraciones'
import { IconoCategoria } from '../components/directorio/IconoCategoria'
import { ListaValoracionesPublicas } from '../components/directorio/ListaValoracionesPublicas'
import { EmptyState } from '../components/estado/EmptyState'
import { ErrorState } from '../components/estado/ErrorState'
import { LoadingState } from '../components/estado/LoadingState'
import { FormularioComentario } from '../components/trabajos/FormularioComentario'
import { TarjetaTrabajoPublico } from '../components/trabajos/TarjetaTrabajoPublico'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Puntuacion } from '../components/ui/Puntuacion'
import { FormularioValoracion } from '../components/valoraciones/FormularioValoracion'
import { useAuth } from '../features/auth/useAuth'
import { useMiProfesional, useProfesional } from '../features/directorio/queries'
import { useTrabajosDeProfesional } from '../features/trabajos/queries'
import { useValoracionesPublicas } from '../features/valoraciones/queries'

export function FichaProfesional() {
  const { slug } = useParams<{ slug: string }>()
  const { data: profesional, isLoading, isError } = useProfesional(slug)
  const { user } = useAuth()
  const miProfesional = useMiProfesional()
  const trabajos = useTrabajosDeProfesional(profesional?.id)
  const valoracionesPublicas = useValoracionesPublicas(profesional?.id)
  const esPropia = Boolean(user && profesional && miProfesional.data?.slug === profesional.slug)
  const [valorando, setValorando] = useState(false)

  if (isLoading) {
    return <LoadingState etiqueta="Cargando ficha…" />
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <ErrorState descripcion="No hemos podido cargar esta ficha. Inténtalo de nuevo en unos segundos." />
      </div>
    )
  }

  if (!profesional) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <EmptyState
          titulo="No encontramos esta ficha"
          descripcion="Puede que el enlace esté mal escrito o que el profesional ya no esté disponible."
          accion={
            <Link to="/profesionales" className="text-sm font-medium text-brand-700 hover:underline">
              Volver al directorio
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {profesional.esDemo && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          Ficha de demostración — este profesional todavía no es real.
        </div>
      )}

      {esPropia && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm text-brand-800">
          Esta es tu ficha pública.
          <Link to="/profesional" className="font-medium hover:underline">
            Editarla →
          </Link>
        </div>
      )}

      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar
            nombre={profesional.nombreComercial}
            fotoUrl={profesional.fotoPerfilUrl}
            className="h-20 w-20 rounded-2xl object-cover"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-neutral-900">{profesional.nombreComercial}</h1>
              {profesional.patrocinado && <Badge tono="patrocinado">Patrocinado</Badge>}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-neutral-600">
              {profesional.oficios.map((oficio) => (
                <span
                  key={oficio.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-sm"
                >
                  <IconoCategoria iconoUrl={oficio.iconoUrl} nombre={oficio.nombre} className="h-4 w-4" />
                  {oficio.nombre}
                </span>
              ))}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {profesional.localidad} · trabaja en {profesional.zonasTrabajoNombres.join(', ')}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 p-4 sm:w-64">
          <p className="text-sm font-semibold text-neutral-700">Contacto directo</p>
          {profesional.contacto.telefono && (
            <a href={`tel:${profesional.contacto.telefono}`} className="flex items-center gap-2 text-sm text-brand-700 hover:underline">
              <Phone className="h-4 w-4" aria-hidden="true" /> {profesional.contacto.telefono}
            </a>
          )}
          {profesional.contacto.email && (
            <a href={`mailto:${profesional.contacto.email}`} className="flex items-center gap-2 text-sm text-brand-700 hover:underline">
              <Mail className="h-4 w-4" aria-hidden="true" /> {profesional.contacto.email}
            </a>
          )}
          {profesional.contacto.web && (
            <a
              href={profesional.contacto.web}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-brand-700 hover:underline"
            >
              <Globe className="h-4 w-4" aria-hidden="true" /> Sitio web
            </a>
          )}
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900">Reputación</h2>
        <div className="mt-2">
          <Puntuacion puntuacion={profesional.puntuacionGlobal} trabajosValorados={profesional.trabajosValorados} />
        </div>
        <p className="mt-2 max-w-2xl text-xs text-neutral-500">
          El índice refleja experiencias de clientes con factura revisada por Protop. No es una garantía del resultado
          de futuros trabajos.
        </p>
        <div className="mt-4">
          <DesgloseValoraciones desglose={profesional.desglosePorConcepto} />
        </div>
        {valoracionesPublicas.data && <ListaValoracionesPublicas valoraciones={valoracionesPublicas.data} />}

        {!profesional.esDemo && !esPropia && (
          <div className="mt-4">
            {user ? (
              <Button type="button" variante="secundario" onClick={() => setValorando(true)}>
                Valorar este trabajo
              </Button>
            ) : (
              <Link to="/acceso" className="text-sm font-medium text-brand-700 hover:underline">
                Inicia sesión para valorar un trabajo con este profesional →
              </Link>
            )}
          </div>
        )}
      </section>

      {valorando && (
        <FormularioValoracion profesionalId={profesional.id} onCerrar={() => setValorando(false)} />
      )}

      {profesional.distintivos.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-neutral-900">Distintivos</h2>
          <ul className="mt-2 flex flex-col gap-2">
            {profesional.distintivos.map((distintivo) => (
              <li key={distintivo.id} className="flex flex-col gap-0.5 rounded-lg bg-neutral-50 px-3 py-2">
                <span className="text-sm font-medium text-neutral-900">{distintivo.etiqueta}</span>
                <span className="text-xs text-neutral-500">{distintivo.explicacion}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900">Sobre {profesional.nombreComercial}</h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-700">
          {profesional.descripcion || profesional.descripcionBreve}
        </p>
        {profesional.especialidades.length > 0 && (
          <ul className="mt-3 flex flex-col gap-2">
            {profesional.especialidades.map((especialidad) => (
              <li key={especialidad.nombre}>
                <Badge tono="marca">{especialidad.nombre}</Badge>
                {especialidad.descripcion && (
                  <p className="mt-1 text-sm text-neutral-600">{especialidad.descripcion}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {trabajos.data && trabajos.data.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-neutral-900">Trabajos publicados</h2>
          <div className="mt-3 flex flex-col gap-4">
            {trabajos.data.map((trabajo) => (
              <div key={trabajo.id}>
                <TarjetaTrabajoPublico trabajo={trabajo} />
                {user && trabajo.clienteId === user.id && !trabajo.comentario && (
                  <div className="mt-2">
                    <FormularioComentario trabajoId={trabajo.id} profesionalId={profesional.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {profesional.fotosTrabajos.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-neutral-900">Fotografías de trabajos</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {profesional.fotosTrabajos.map((foto) => (
              <img key={foto} src={foto} alt={`Trabajo de ${profesional.nombreComercial}`} className="aspect-4/3 w-full rounded-lg object-cover" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
