import { ChevronRight, MapPin } from 'lucide-react'
import { Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TarjetaProfesional } from '../components/directorio/TarjetaProfesional'
import { EmptyState } from '../components/estado/EmptyState'
import { ErrorState } from '../components/estado/ErrorState'
import { LoadingState } from '../components/estado/LoadingState'
import { HuecoGoogle } from '../components/monetizacion/HuecoGoogle'
import { Button } from '../components/ui/Button'
import { baseBoton, tamanosBoton, variantesBoton } from '../components/ui/estilosBoton'
import { SITIO } from '../features/blog/seo'
import { POSTS } from '../features/blog/posts'
import { useBusquedaProfesionales } from '../features/directorio/queries'
import { type IndiceOficios, lugarIndexable, nombreLegible, useIndiceOficios } from '../features/seo/indice'
import { OFICIOS_SEO, type OficioSeo, rutaOficio } from '../features/seo/oficios'
import { cn } from '../lib/cn'
import { useSeo } from '../lib/useSeo'
import { NotFound } from './NotFound'

const POSICION_ANUNCIO = 6
const MAXIMO_LUGARES = 24

type Lugar = { slug: string; nombre: string; comunidad: string | null }

function lugarDeIndice(indice: IndiceOficios | undefined, slug: string | undefined): Lugar | null {
  const zona = slug ? indice?.zonas[slug] : undefined
  return slug && zona ? { slug, nombre: nombreLegible(zona.nombre), comunidad: zona.comunidad } : null
}

/** Lugares con fichas de este oficio para seguir navegando: comunidades desde España, municipios desde una comunidad. */
function lugaresRelacionados(indice: IndiceOficios, oficio: OficioSeo, lugar: Lugar | null) {
  const conFichas = Object.entries(indice.oficios[oficio.categoria]?.lugares ?? {})
  const comunidadActual = lugar ? (lugar.comunidad ?? lugar.slug) : null
  return conFichas
    .map(([slug, fichas]) => ({ slug, fichas, zona: indice.zonas[slug] }))
    .filter(({ slug, zona }) => {
      if (!zona || slug === lugar?.slug) return false
      if (!comunidadActual) return zona.comunidad === null
      return zona.comunidad === comunidadActual
    })
    .sort((a, b) => b.fichas - a.fichas || a.zona.nombre.localeCompare(b.zona.nombre, 'es'))
    .slice(0, MAXIMO_LUGARES)
}

/** Otros oficios con fichas en el mismo lugar (o en toda España). */
function oficiosRelacionados(indice: IndiceOficios, oficio: OficioSeo, lugar: Lugar | null) {
  return OFICIOS_SEO.filter((otro) => otro.categoria !== oficio.categoria)
    .map((otro) => ({
      oficio: otro,
      fichas: lugar ? (indice.oficios[otro.categoria]?.lugares[lugar.slug] ?? 0) : (indice.oficios[otro.categoria]?.total ?? 0),
    }))
    .filter(({ fichas }) => fichas > 0)
    .sort((a, b) => b.fichas - a.fichas)
}

function datosEstructurados(oficio: OficioSeo, lugar: Lugar | null, comunidad: Lugar | null, slugsFichas: string[]) {
  const migas = [
    { nombre: 'Inicio', url: SITIO },
    { nombre: oficio.plural, url: `${SITIO}${rutaOficio(oficio.categoria)}` },
    ...(comunidad && comunidad.slug !== lugar?.slug
      ? [{ nombre: comunidad.nombre, url: `${SITIO}${rutaOficio(oficio.categoria, comunidad.slug)}` }]
      : []),
    ...(lugar ? [{ nombre: lugar.nombre, url: `${SITIO}${rutaOficio(oficio.categoria, lugar.slug)}` }] : []),
  ]
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: migas.map((miga, indice) => ({
          '@type': 'ListItem',
          position: indice + 1,
          name: miga.nombre,
          item: miga.url,
        })),
      },
      {
        '@type': 'ItemList',
        itemListElement: slugsFichas.map((slug, indice) => ({
          '@type': 'ListItem',
          position: indice + 1,
          url: `${SITIO}/profesionales/${slug}`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: oficio.preguntas.map((p) => ({
          '@type': 'Question',
          name: p.pregunta,
          acceptedAnswer: { '@type': 'Answer', text: p.respuesta },
        })),
      },
    ],
  }
}

/**
 * Página de un oficio en toda España o en un lugar: «Electricistas en Madrid». Es la puerta de entrada desde Google:
 * la lista real de profesionales, qué pedir en el presupuesto, preguntas frecuentes y enlaces a lugares y oficios
 * cercanos. El directorio (/profesionales) sigue siendo la herramienta para filtrar.
 */
export function PaginaOficio({ oficio }: { oficio: OficioSeo }) {
  const { lugar: lugarSlug } = useParams<{ lugar?: string }>()
  const indice = useIndiceOficios()
  const lugar = lugarDeIndice(indice.data, lugarSlug)
  const comunidad = lugar?.comunidad ? lugarDeIndice(indice.data, lugar.comunidad) : lugar

  const profesionales = useBusquedaProfesionales({ categorias: [oficio.categoria], zona: lugarSlug ?? '', texto: '' })
  const resultados = profesionales.data?.pages.flatMap((pagina) => pagina.resultados) ?? []
  const total = profesionales.data?.pages[0]?.total ?? 0

  const donde = lugar ? lugar.nombre : 'toda España'
  const indexable = !lugarSlug || (indice.data ? lugarIndexable(indice.data, oficio.categoria, lugarSlug) : true)
  const cifra = total > 0 ? `${total} ${total === 1 ? 'profesional' : 'profesionales'}` : 'Profesionales'
  useSeo(
    `${oficio.plural} en ${donde}: ${cifra.toLowerCase()} con contacto directo | Protop`,
    `${oficio.plural} en ${donde}${total > 0 ? `: ${cifra.toLowerCase()} con teléfono, web o email a la vista` : ''}. Llámales gratis, sin intermediarios, o pide presupuesto. ${oficio.intro.split('. ')[0]}.`,
    {
      canonica: rutaOficio(oficio.categoria, lugarSlug),
      noIndex: !indexable,
      jsonLd: datosEstructurados(oficio, lugar, comunidad, resultados.slice(0, 30).map(({ profesional }) => profesional.slug)),
    },
  )

  // Un lugar que no está en el índice ni tiene fichas: página que no existe.
  if (lugarSlug && indice.data && !lugar && !profesionales.isLoading && total === 0) return <NotFound />

  const guias = POSTS.filter((post) => post.categoriaSlug === oficio.categoria).slice(0, 3)
  const lugares = indice.data ? lugaresRelacionados(indice.data, oficio, lugar) : []
  const otrosOficios = indice.data ? oficiosRelacionados(indice.data, oficio, lugar) : []
  const parametrosPresupuesto = new URLSearchParams({ categoria: oficio.categoria, ...(lugarSlug ? { zona: lugarSlug } : {}) })
  const singular = oficio.singular.replace(/^(un|una) /, '')

  return (
    <div>
      <section className="corcho border-b border-[#a87a4a]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="rounded-tarjeta bg-white p-6 shadow-tarjeta-alzada sm:p-9">
            <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-1 text-sm text-neutral-500">
              <Link to="/" className="hover:text-neutral-800 hover:underline">
                Inicio
              </Link>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              {lugar ? (
                <Link to={rutaOficio(oficio.categoria)} className="hover:text-neutral-800 hover:underline">
                  {oficio.plural}
                </Link>
              ) : (
                <span className="text-neutral-800">{oficio.plural}</span>
              )}
              {comunidad && lugar && comunidad.slug !== lugar.slug && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  <Link to={rutaOficio(oficio.categoria, comunidad.slug)} className="hover:text-neutral-800 hover:underline">
                    {comunidad.nombre}
                  </Link>
                </>
              )}
              {lugar && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="text-neutral-800">{lugar.nombre}</span>
                </>
              )}
            </nav>

            <h1 className="titular mt-4 text-4xl leading-[1.02] text-neutral-900 sm:text-6xl">
              {oficio.plural} en {donde}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-neutral-700">
              {total > 0 ? (
                <>
                  <strong className="text-neutral-900">{cifra}</strong> con su teléfono, web o email a la vista. Les
                  llamas tú, gratis y sin intermediarios.
                </>
              ) : (
                <>Todavía estamos reuniendo {oficio.plural.toLowerCase()} de {donde}. Pide presupuesto y te avisamos.</>
              )}
            </p>
            <p className="mt-3 max-w-2xl text-neutral-600">{oficio.intro}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to={`/solicitar-presupuesto?${parametrosPresupuesto}`}
                className={cn(baseBoton, variantesBoton.primario, tamanosBoton.lg)}
              >
                Pedir presupuesto gratis
              </Link>
              <Link
                to={`/profesionales?${parametrosPresupuesto}`}
                className={cn(baseBoton, variantesBoton.secundario, tamanosBoton.lg)}
              >
                Buscar por nombre o especialidad
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {profesionales.isLoading ? (
          <LoadingState etiqueta={`Cargando ${oficio.plural.toLowerCase()}…`} />
        ) : profesionales.isError ? (
          <ErrorState descripcion="No hemos podido cargar los profesionales. Inténtalo de nuevo en unos segundos." />
        ) : resultados.length === 0 ? (
          <EmptyState
            titulo={`Aún no hay ${oficio.plural.toLowerCase()} en ${donde}`}
            descripcion="Pide presupuesto gratis: tu solicitud llega a los profesionales del oficio que trabajan en tu zona."
            accion={
              <Link to={`/solicitar-presupuesto?${parametrosPresupuesto}`} className={cn(baseBoton, variantesBoton.primario, tamanosBoton.md)}>
                Pedir presupuesto
              </Link>
            }
          />
        ) : (
          <>
            <h2 className="text-2xl text-neutral-900 sm:text-3xl">
              {oficio.plural} en {donde}
            </h2>
            <div className="mt-6 grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
              {resultados.map(({ profesional, patrocinado }, posicion) => (
                <Fragment key={profesional.id}>
                  <TarjetaProfesional profesional={profesional} patrocinado={patrocinado} />
                  {posicion === POSICION_ANUNCIO - 1 && resultados.length > POSICION_ANUNCIO && (
                    <HuecoGoogle className="sm:col-span-2 lg:col-span-3" />
                  )}
                </Fragment>
              ))}
            </div>
            {profesionales.hasNextPage && (
              <div className="mt-10 flex flex-col items-center gap-2">
                <Button variante="secundario" onClick={() => profesionales.fetchNextPage()} disabled={profesionales.isFetchingNextPage}>
                  {profesionales.isFetchingNextPage ? 'Cargando…' : `Ver más ${oficio.plural.toLowerCase()}`}
                </Button>
                <p className="text-sm text-neutral-500">
                  Ves {resultados.length} de {total}
                </p>
              </div>
            )}
          </>
        )}

        <aside className="mt-12 grid items-start gap-5 rounded-tarjeta bg-ink p-6 text-neutral-200 sm:p-8 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-2xl text-white">
              ¿Eres {singular} en {lugar ? lugar.nombre : 'tu zona'}?
            </h2>
            <p className="mt-2 max-w-xl text-neutral-300">
              Los vecinos de {donde} buscan aquí a quién llamar. Tu ficha es gratis, sin cuota ni comisiones por los
              trabajos. Si tu negocio ya sale en la lista, reclámalo y será tuyo.
            </p>
          </div>
          <Link to="/para-profesionales" className={cn(baseBoton, variantesBoton.primario, tamanosBoton.lg, 'md:self-center')}>
            Publicar mi ficha gratis
          </Link>
        </aside>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <section aria-labelledby="titulo-consejos">
            <h2 id="titulo-consejos" className="text-2xl text-neutral-900">
              Qué pedir en el presupuesto de {oficio.singular}
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {oficio.consejos.map((consejo) => (
                <li key={consejo} className="flex gap-3 text-neutral-700">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />
                  {consejo}
                </li>
              ))}
            </ul>
            {guias.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-neutral-900">Guías para leer antes de llamar</h3>
                <ul className="mt-2 flex flex-col gap-2">
                  {guias.map((guia) => (
                    <li key={guia.slug}>
                      <Link to={`/blog/${guia.slug}`} className="font-medium text-brand-700 hover:underline">
                        {guia.titulo}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section aria-labelledby="titulo-preguntas">
            <h2 id="titulo-preguntas" className="text-2xl text-neutral-900">
              Preguntas frecuentes
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              {oficio.preguntas.map((p) => (
                <details key={p.pregunta} className="group rounded-xl bg-white p-4 ring-1 ring-neutral-200" open>
                  <summary className="cursor-pointer font-semibold text-neutral-900">{p.pregunta}</summary>
                  <p className="mt-2 text-neutral-700">{p.respuesta}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        {lugares.length > 0 && (
          <nav aria-labelledby="titulo-lugares" className="mt-12">
            <h2 id="titulo-lugares" className="text-2xl text-neutral-900">
              {!lugar
                ? `${oficio.plural} por comunidad`
                : lugar.comunidad === null
                  ? `${oficio.plural} por municipio`
                  : `${oficio.plural} cerca de ${lugar.nombre}`}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {lugares.map(({ slug, fichas, zona }) => (
                <li key={slug}>
                  <Link
                    to={rutaOficio(oficio.categoria, slug)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm text-neutral-700 ring-1 ring-neutral-300 hover:ring-neutral-500"
                  >
                    <MapPin className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
                    {nombreLegible(zona.nombre)}
                    <span className="text-neutral-400">{fichas}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {otrosOficios.length > 0 && (
          <nav aria-labelledby="titulo-oficios" className="mt-10">
            <h2 id="titulo-oficios" className="text-2xl text-neutral-900">
              Otros profesionales en {donde}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {otrosOficios.map(({ oficio: otro, fichas }) => (
                <li key={otro.categoria}>
                  <Link
                    to={rutaOficio(otro.categoria, lugar?.slug)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm text-neutral-700 ring-1 ring-neutral-300 hover:ring-neutral-500"
                  >
                    {otro.plural}
                    <span className="text-neutral-400">{fichas}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  )
}
