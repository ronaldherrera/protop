import { LayoutGrid, X } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { cn } from '../lib/cn'
import { Button } from '../components/ui/Button'
import { BuscadorZonaUnica } from '../components/directorio/BuscadorZonas'
import { SelectorCategoria } from '../components/directorio/SelectorCategoria'
import { TarjetaProfesional } from '../components/directorio/TarjetaProfesional'
import { EmptyState } from '../components/estado/EmptyState'
import { ErrorState } from '../components/estado/ErrorState'
import { LoadingState } from '../components/estado/LoadingState'
import { useBusquedaProfesionales, useCategorias, useFamilias, useZonas } from '../features/directorio/queries'
import { useSeo } from '../lib/useSeo'
import { oficioSeoDeCategoria, rutaOficio } from '../features/seo/oficios'
import { HuecoGoogle } from '../components/monetizacion/HuecoGoogle'

// Un hueco de publicidad tras los primeros resultados: nunca antes de que se vea a quién llamar.
const POSICION_ANUNCIO = 6
const ESPERA_TEXTO_MS = 300

/**
 * Oficio, familia y localidad definen páginas distintas para Google; la búsqueda libre no. Un oficio (con o sin
 * lugar) ya tiene su página propia («/electricistas/madrid»): esa es la que se ofrece a Google.
 */
function rutaCanonica(categoria: string, familia: string, zona: string): string {
  if (categoria && oficioSeoDeCategoria(categoria)) return rutaOficio(categoria, zona || undefined)
  const parametros = new URLSearchParams()
  if (categoria) parametros.set('categoria', categoria)
  else if (familia) parametros.set('familia', familia)
  if (zona) parametros.set('zona', zona)
  return `/profesionales${parametros.toString() ? `?${parametros}` : ''}`
}

export function Directorio() {
  const [parametros, setParametros] = useSearchParams()
  const categoria = parametros.get('categoria') ?? ''
  const familiaSlug = parametros.get('familia') ?? ''
  const zona = parametros.get('zona') ?? ''
  const texto = parametros.get('q') ?? ''

  const familias = useFamilias()
  const categorias = useCategorias()
  const zonas = useZonas()

  const familiaActiva = familias.data?.find((f) => f.slug === familiaSlug)
  const categoriaActiva = categorias.data?.find((c) => c.slug === categoria)
  const categoriasBuscadas = categoria
    ? [categoria]
    : familiaActiva
      ? (categorias.data ?? []).filter((c) => c.familiaId === familiaActiva.id).map((c) => c.slug)
      : []

  // El texto se busca en la base: se espera a que se deje de escribir para no lanzar una consulta por tecla.
  const [textoBuscado, setTextoBuscado] = useState(texto)
  useEffect(() => {
    const espera = setTimeout(() => setTextoBuscado(texto), ESPERA_TEXTO_MS)
    return () => clearTimeout(espera)
  }, [texto])

  const profesionales = useBusquedaProfesionales({ categorias: categoriasBuscadas, zona, texto: textoBuscado })
  const resultados = profesionales.data?.pages.flatMap((pagina) => pagina.resultados) ?? []
  const totalResultados = profesionales.data?.pages[0]?.total ?? 0

  function actualizarFiltro(clave: string, valor: string) {
    const nuevos = new URLSearchParams(parametros)
    if (valor) {
      nuevos.set(clave, valor)
    } else {
      nuevos.delete(clave)
    }
    if (clave === 'categoria') {
      nuevos.delete('familia')
    }
    setParametros(nuevos, { replace: true })
  }

  const zonaActiva = zonas.data?.find((z) => z.slug === zona)
  const queBusca = categoriaActiva?.nombre ?? familiaActiva?.nombre
  const donde = zonaActiva?.nombre ?? 'toda España'
  useSeo(
    queBusca
      ? `${queBusca} en ${donde}: profesionales con valoraciones verificadas | Protop`
      : `Profesionales de reformas y reparaciones en ${donde} | Protop`,
    `${queBusca ?? 'Electricistas, fontaneros, pintores y más'} en ${donde}. Contacto directo y gratis, y valoraciones de clientes que han enseñado la factura.`,
    { canonica: rutaCanonica(categoria, familiaSlug, zona) },
  )

  const hayFiltrosActivos = Boolean(categoria || familiaSlug || zona || texto)
  const cargando = profesionales.isLoading || categorias.isLoading || zonas.isLoading || familias.isLoading
  const hayError = profesionales.isError || categorias.isError || zonas.isError || familias.isError
  const hayDemo = resultados.some(({ profesional }) => profesional.esDemo)

  // La localidad ya se muestra como chip quitable dentro de su propio campo,
  // así que aquí solo van los filtros que no tienen esa opción en el campo.
  const filtrosActivos: { clave: string; etiqueta: string }[] = [
    categoriaActiva && { clave: 'categoria', etiqueta: categoriaActiva.nombre },
    !categoriaActiva && familiaActiva && { clave: 'familia', etiqueta: familiaActiva.nombre },
    texto && { clave: 'q', etiqueta: `"${texto}"` },
  ].filter((filtro): filtro is { clave: string; etiqueta: string } => Boolean(filtro))
  const totalFiltros = [categoriaActiva || familiaActiva, zona, texto].filter(Boolean).length

  const etiquetaCampo = 'mb-1.5 block text-sm font-semibold text-neutral-700'

  return (
    <div>
      <section className="corcho border-b border-[#a87a4a]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="chincheta rounded-tarjeta bg-white p-6 pt-8 shadow-tarjeta-alzada sm:p-8">
            <h1 className="titular text-4xl text-neutral-900 sm:text-5xl">Directorio de profesionales</h1>
            {hayDemo && (
              <p className="mt-3 text-sm text-neutral-600">
                Las fichas actuales son de ejemplo. Todavía no hay profesionales reales dados de alta en Protop.
              </p>
            )}

            <div className="mt-8 grid gap-4 md:grid-cols-[1fr_1fr_1.2fr]">
              <label className="block">
                <span className={etiquetaCampo}>Oficio o servicio</span>
                <SelectorCategoria
                  familias={familias.data ?? []}
                  categorias={categorias.data ?? []}
                  value={categoria}
                  onChange={(valor) => actualizarFiltro('categoria', valor)}
                  className="h-11 w-full rounded-[10px] border border-neutral-300 bg-white px-3 text-neutral-900"
                />
              </label>

              <div>
                <span className={etiquetaCampo} id="etiqueta-localidad">
                  Localidad
                </span>
                <BuscadorZonaUnica
                  zonas={zonas.data ?? []}
                  valor={zona}
                  onChange={(valor) => actualizarFiltro('zona', valor)}
                  placeholder="Cualquier localidad"
                  etiqueta="Localidad"
                />
              </div>

              <label className="block">
                <span className={etiquetaCampo}>Nombre o servicio concreto</span>
                <input
                  type="search"
                  value={texto}
                  onChange={(evento) => actualizarFiltro('q', evento.target.value)}
                  placeholder="Ej. calderas, Hermanos Ruiz…"
                  className="h-11 w-full rounded-[10px] border border-neutral-300 bg-white px-3 text-neutral-900"
                />
              </label>
            </div>

            {filtrosActivos.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {filtrosActivos.map((filtro) => (
                  <span
                    key={filtro.clave}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 py-1 pl-3 pr-1.5 text-sm text-white"
                  >
                    {filtro.etiqueta}
                    <button
                      type="button"
                      onClick={() => actualizarFiltro(filtro.clave, '')}
                      aria-label={`Quitar filtro ${filtro.etiqueta}`}
                      className="rounded-full p-0.5 hover:bg-white/20"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
                {totalFiltros > 1 && (
                  <button
                    type="button"
                    onClick={() => setParametros(new URLSearchParams(), { replace: true })}
                    className="text-sm font-semibold text-neutral-600 hover:text-neutral-900 hover:underline"
                  >
                    Quitar todos
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {(familias.data ?? []).length > 0 && (
        <nav className="border-b border-neutral-200 bg-white" aria-label="Familias de oficios">
          <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
            {[{ id: 'todas', slug: '', nombre: 'Todos', iconoUrl: null }, ...(familias.data ?? [])].map((f) => {
              const activa = !categoria && familiaSlug === f.slug
              return (
                <li key={f.id} className="shrink-0">
                  <button
                    type="button"
                    aria-pressed={activa}
                    onClick={() => {
                      const nuevos = new URLSearchParams(parametros)
                      nuevos.delete('categoria')
                      if (f.slug) nuevos.set('familia', f.slug)
                      else nuevos.delete('familia')
                      setParametros(nuevos, { replace: true })
                    }}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold transition-colors',
                      activa ? 'bg-brand-50 text-brand-700' : 'text-neutral-600 hover:bg-neutral-100',
                    )}
                  >
                    <span className="flex h-9 w-9 items-center justify-center">
                      {f.iconoUrl ? (
                        <img src={f.iconoUrl} alt="" className="h-7 w-7" />
                      ) : (
                        <LayoutGrid className="h-6 w-6" aria-hidden="true" />
                      )}
                    </span>
                    {f.nombre}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      )}

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {cargando ? (
          <LoadingState etiqueta="Cargando profesionales…" />
        ) : hayError ? (
          <div>
            <ErrorState descripcion="No hemos podido cargar el directorio. Inténtalo de nuevo en unos segundos." />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <p className="font-semibold text-neutral-900" aria-live="polite">
                {totalResultados} {totalResultados === 1 ? 'profesional' : 'profesionales'}
              </p>
              <p className="text-sm text-neutral-500">
                Al buscar un oficio, primero van hasta tres profesionales con Plan Destacado, marcados como
                «Patrocinado». Después, por puntuación verificada y trabajos valorados.
              </p>
            </div>

            {resultados.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  titulo={
                    hayFiltrosActivos ? 'Ningún profesional coincide con esos filtros' : 'Todavía no hay resultados'
                  }
                  descripcion={
                    hayFiltrosActivos
                      ? 'Prueba a quitar algún filtro o a ampliar la búsqueda a otra localidad.'
                      : 'Ajusta la búsqueda para ver profesionales del directorio.'
                  }
                />
              </div>
            ) : (
              <div className="tablon-clavado mt-7 grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                {resultados.map(({ profesional, patrocinado }, indice) => (
                  <Fragment key={profesional.id}>
                    <TarjetaProfesional profesional={profesional} patrocinado={patrocinado} />
                    {indice === POSICION_ANUNCIO - 1 && resultados.length > POSICION_ANUNCIO && (
                      <HuecoGoogle className="sm:col-span-2 lg:col-span-3" />
                    )}
                  </Fragment>
                ))}
              </div>
            )}

            {profesionales.hasNextPage && (
              <div className="mt-10 flex flex-col items-center gap-2">
                <Button
                  variante="secundario"
                  onClick={() => profesionales.fetchNextPage()}
                  disabled={profesionales.isFetchingNextPage}
                >
                  {profesionales.isFetchingNextPage ? 'Cargando…' : 'Ver más profesionales'}
                </Button>
                <p className="text-sm text-neutral-500">
                  Ves {resultados.length} de {totalResultados}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
