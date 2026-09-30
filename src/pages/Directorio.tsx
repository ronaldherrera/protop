import { X } from 'lucide-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BuscadorZonaUnica } from '../components/directorio/BuscadorZonas'
import { SelectorCategoria } from '../components/directorio/SelectorCategoria'
import { TarjetaProfesional } from '../components/directorio/TarjetaProfesional'
import { EmptyState } from '../components/estado/EmptyState'
import { ErrorState } from '../components/estado/ErrorState'
import { LoadingState } from '../components/estado/LoadingState'
import { filtrarProfesionales, ordenarProfesionales } from '../features/directorio/filtrado'
import { useCategorias, useFamilias, useProfesionales, useZonas } from '../features/directorio/queries'

export function Directorio() {
  const [parametros, setParametros] = useSearchParams()
  const categoria = parametros.get('categoria') ?? ''
  const familiaSlug = parametros.get('familia') ?? ''
  const zona = parametros.get('zona') ?? ''
  const texto = parametros.get('q') ?? ''

  const familias = useFamilias()
  const categorias = useCategorias()
  const zonas = useZonas()
  const profesionales = useProfesionales()

  const familiaActiva = familias.data?.find((f) => f.slug === familiaSlug)
  const categoriaActiva = categorias.data?.find((c) => c.slug === categoria)
  const categoriaSlugsFamilia = familiaActiva
    ? (categorias.data ?? []).filter((c) => c.familiaId === familiaActiva.id).map((c) => c.slug)
    : undefined

  const resultados = useMemo(
    () =>
      ordenarProfesionales(
        filtrarProfesionales(profesionales.data ?? [], { categoria, categoriaSlugsFamilia, zona, texto }, zonas.data ?? []),
      ),
    [profesionales.data, categoria, categoriaSlugsFamilia, zona, texto, zonas.data],
  )

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

  const hayFiltrosActivos = Boolean(categoria || familiaSlug || zona || texto)
  const cargando = profesionales.isLoading || categorias.isLoading || zonas.isLoading || familias.isLoading
  const hayError = profesionales.isError || categorias.isError || zonas.isError || familias.isError
  const hayDemo = (profesionales.data ?? []).some((profesional) => profesional.esDemo)

  // La localidad ya se muestra como chip quitable dentro de su propio campo,
  // así que aquí solo van los filtros que no tienen esa opción en el campo.
  const filtrosActivos: { clave: string; etiqueta: string }[] = [
    categoriaActiva && { clave: 'categoria', etiqueta: categoriaActiva.nombre },
    !categoriaActiva && familiaActiva && { clave: 'familia', etiqueta: familiaActiva.nombre },
    texto && { clave: 'q', etiqueta: `"${texto}"` },
  ].filter((filtro): filtro is { clave: string; etiqueta: string } => Boolean(filtro))
  const totalFiltros = [categoriaActiva || familiaActiva, zona, texto].filter(Boolean).length

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Directorio de profesionales</h1>
      {hayDemo && (
        <p className="mt-1 text-sm text-neutral-500">
          Datos de demostración — todavía no hay profesionales reales dados de alta en Protop.
        </p>
      )}

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex-1 text-base">
            <span className="mb-1.5 block font-medium text-neutral-700">Oficio o servicio</span>
            <SelectorCategoria
              familias={familias.data ?? []}
              categorias={categorias.data ?? []}
              value={categoria}
              onChange={(valor) => actualizarFiltro('categoria', valor)}
            />
          </label>

          <label className="flex-1 text-base">
            <span className="mb-1.5 block font-medium text-neutral-700">Localidad</span>
            <BuscadorZonaUnica
              zonas={zonas.data ?? []}
              valor={zona}
              onChange={(valor) => actualizarFiltro('zona', valor)}
              placeholder="Cualquier localidad"
            />
          </label>

          <label className="flex-1 text-base">
            <span className="mb-1.5 block font-medium text-neutral-700">Buscar por nombre o servicio</span>
            <input
              type="search"
              value={texto}
              onChange={(evento) => actualizarFiltro('q', evento.target.value)}
              placeholder="Ej. fontanero, Hermanos Ruiz…"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
            />
          </label>
        </div>

        {filtrosActivos.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-4">
            {filtrosActivos.map((filtro) => (
              <span
                key={filtro.clave}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700"
              >
                {filtro.etiqueta}
                <button
                  type="button"
                  onClick={() => actualizarFiltro(filtro.clave, '')}
                  aria-label={`Quitar filtro ${filtro.etiqueta}`}
                  className="rounded-full p-0.5 hover:bg-brand-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            {totalFiltros > 1 && (
              <button
                type="button"
                onClick={() => setParametros(new URLSearchParams(), { replace: true })}
                className="text-sm font-medium text-neutral-500 hover:text-neutral-700 hover:underline"
              >
                Quitar todos
              </button>
            )}
          </div>
        )}
      </div>

      {cargando ? (
        <LoadingState etiqueta="Cargando profesionales…" />
      ) : hayError ? (
        <div className="mt-6">
          <ErrorState descripcion="No hemos podido cargar el directorio. Inténtalo de nuevo en unos segundos." />
        </div>
      ) : (
        <>
          <p className="mt-4 text-sm text-neutral-500">
            {resultados.length} {resultados.length === 1 ? 'profesional encontrado' : 'profesionales encontrados'}
          </p>

          {resultados.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                titulo={hayFiltrosActivos ? 'Ningún profesional coincide con esos filtros' : 'Todavía no hay resultados'}
                descripcion={
                  hayFiltrosActivos
                    ? 'Prueba a quitar algún filtro o a ampliar la búsqueda a otra localidad.'
                    : 'Ajusta la búsqueda para ver profesionales del directorio.'
                }
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resultados.map((profesional) => (
                <TarjetaProfesional key={profesional.id} profesional={profesional} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
