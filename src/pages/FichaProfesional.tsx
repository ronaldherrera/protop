import { Globe, Mail, MapPin, Phone } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { DesgloseValoraciones } from '../components/directorio/DesgloseValoraciones'
import { EmptyState } from '../components/estado/EmptyState'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Puntuacion } from '../components/ui/Puntuacion'
import { buscarCategoriaPorSlug, buscarZonaPorSlug } from '../features/directorio/categorias'
import { PROFESIONALES_DEMO } from '../features/directorio/demoProfesionales'

export function FichaProfesional() {
  const { slug } = useParams<{ slug: string }>()
  const profesional = PROFESIONALES_DEMO.find((p) => p.slug === slug)

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

  const categoria = buscarCategoriaPorSlug(profesional.oficioPrincipal)
  const zonas = profesional.zonasTrabajo.map((slugZona) => buscarZonaPorSlug(slugZona)?.nombre ?? slugZona)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
        Ficha de demostración — este profesional todavía no es real.
      </div>

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
            <p className="text-neutral-600">{categoria?.nombre ?? profesional.oficioPrincipal}</p>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {profesional.localidad} · trabaja en {zonas.join(', ')}
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
      </section>

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
        <p className="mt-2 max-w-2xl text-sm text-neutral-700">{profesional.descripcion}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {profesional.especialidades.map((especialidad) => (
            <li key={especialidad}>
              <Badge tono="marca">{especialidad}</Badge>
            </li>
          ))}
        </ul>
      </section>

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
