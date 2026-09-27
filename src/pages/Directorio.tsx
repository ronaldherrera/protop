import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TarjetaProfesional } from '../components/directorio/TarjetaProfesional'
import { EmptyState } from '../components/estado/EmptyState'
import { ErrorState } from '../components/estado/ErrorState'
import { LoadingState } from '../components/estado/LoadingState'
import { useCategorias, useProfesionales, useZonas } from '../features/directorio/queries'
import { filtrarProfesionales, ordenarProfesionales } from '../features/directorio/filtrado'

export function Directorio() {
  const [parametros, setParametros] = useSearchParams()
  const categoria = parametros.get('categoria') ?? ''
  const zona = parametros.get('zona') ?? ''
  const texto = parametros.get('q') ?? ''

  const categorias = useCategorias()
  const zonas = useZonas()
  const profesionales = useProfesionales()

  const resultados = useMemo(
    () =>
      ordenarProfesionales(
        filtrarProfesionales(profesionales.data ?? [], { categoria, zona, texto }),
      ),
    [profesionales.data, categoria, zona, texto],
  )

  function actualizarFiltro(clave: string, valor: string) {
    const nuevos = new URLSearchParams(parametros)
    if (valor) {
      nuevos.set(clave, valor)
    } else {
      nuevos.delete(clave)
    }
    setParametros(nuevos, { replace: true })
  }

  const hayFiltrosActivos = Boolean(categoria || zona || texto)
  const cargando = profesionales.isLoading || categorias.isLoading || zonas.isLoading
  const hayError = profesionales.isError || categorias.isError || zonas.isError
  const hayDemo = (profesionales.data ?? []).some((profesional) => profesional.esDemo)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Directorio de profesionales</h1>
      {hayDemo && (
        <p className="mt-1 text-sm text-neutral-500">
          Datos de demostración — todavía no hay profesionales reales dados de alta en Protop.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Oficio o servicio</span>
          <select
            value={categoria}
            onChange={(evento) => actualizarFiltro('categoria', evento.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
          >
            <option value="">Cualquier oficio</option>
            {(categorias.data ?? []).map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-1 text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Localidad</span>
          <select
            value={zona}
            onChange={(evento) => actualizarFiltro('zona', evento.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
          >
            <option value="">Cualquier localidad</option>
            {(zonas.data ?? []).map((z) => (
              <option key={z.slug} value={z.slug}>
                {z.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-1 text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Buscar por nombre o servicio</span>
          <input
            type="search"
            value={texto}
            onChange={(evento) => actualizarFiltro('q', evento.target.value)}
            placeholder="Ej. fontanero, Hermanos Ruiz…"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
          />
        </label>

        {hayFiltrosActivos && (
          <button
            type="button"
            onClick={() => setParametros(new URLSearchParams(), { replace: true })}
            className="whitespace-nowrap px-3 py-2 text-sm font-medium text-brand-700 hover:underline"
          >
            Quitar filtros
          </button>
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
