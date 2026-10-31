import { Link } from 'react-router-dom'
import { useBusquedaProfesionales } from '../../features/directorio/queries'
import { nombreLegible } from '../../features/seo/indice'
import { oficioSeoDeCategoria, rutaOficio } from '../../features/seo/oficios'
import type { Profesional } from '../../types/profesional'
import { TarjetaProfesional } from './TarjetaProfesional'

const CUANTOS = 3

/** Al final de una ficha: otros profesionales del mismo oficio en su zona, para comparar antes de llamar. */
export function MasProfesionalesCerca({ profesional }: { profesional: Profesional }) {
  const zona = profesional.zonasTrabajo[0] ?? ''
  const busqueda = useBusquedaProfesionales({ categorias: [profesional.oficioPrincipal], zona, texto: '' })
  const otros = (busqueda.data?.pages[0]?.resultados ?? [])
    .filter(({ profesional: otro }) => otro.id !== profesional.id)
    .slice(0, CUANTOS)
  const total = Math.max((busqueda.data?.pages[0]?.total ?? 0) - 1, 0)
  const oficio = oficioSeoDeCategoria(profesional.oficioPrincipal)

  if (!oficio || otros.length === 0) return null
  const donde = zona ? nombreLegible(profesional.zonasTrabajoNombres[0] ?? '') : ''

  return (
    <section aria-labelledby="titulo-mas-cerca">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id="titulo-mas-cerca" className="text-3xl text-neutral-900">
          Compara con otros {oficio.plural.toLowerCase()}
          {donde && ` en ${donde}`}
        </h2>
        {total > CUANTOS && (
          <Link to={rutaOficio(oficio.categoria, zona || undefined)} className="text-sm font-semibold text-brand-700 hover:underline">
            Ver los {total}
          </Link>
        )}
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {otros.map(({ profesional: otro, patrocinado }) => (
          <TarjetaProfesional key={otro.id} profesional={otro} patrocinado={patrocinado} />
        ))}
      </div>
    </section>
  )
}
