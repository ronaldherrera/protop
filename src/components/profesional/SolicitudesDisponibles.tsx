import { ChevronRight, MapPin } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BuscadorZonaUnica } from '../directorio/BuscadorZonas'
import { IconoCategoria } from '../directorio/IconoCategoria'
import { SelectorCategoria } from '../directorio/SelectorCategoria'
import { EmptyState } from '../estado/EmptyState'
import { ErrorState } from '../estado/ErrorState'
import { LoadingState } from '../estado/LoadingState'
import { coincideZona } from '../../features/directorio/filtrado'
import { cn } from '../../lib/cn'
import { solicitudEncajaConProfesional } from '../../features/solicitudes/coincidencia'
import { useSolicitudesDisponibles } from '../../features/solicitudes/queries'
import type { Solicitud } from '../../features/solicitudes/types'
import type { Categoria, Familia, Zona } from '../../types/profesional'
import { formatearFecha } from '../../features/solicitudes/formato'

export function SolicitudesDisponibles({
  familias,
  categorias,
  zonas,
  categoriaIdsProfesional,
  zonaSlugsProfesional,
}: {
  familias: Familia[]
  categorias: Categoria[]
  zonas: Zona[]
  categoriaIdsProfesional: string[]
  zonaSlugsProfesional: string[]
}) {
  const solicitudes = useSolicitudesDisponibles()
  const [soloParaTi, setSoloParaTi] = useState(true)
  const [categoria, setCategoria] = useState('')
  const [zona, setZona] = useState('')
  const [texto, setTexto] = useState('')

  const zonasPorSlug = useMemo(() => new Map(zonas.map((z) => [z.slug, z])), [zonas])

  const resultados = useMemo(() => {
    const busqueda = texto.trim().toLowerCase()
    return (solicitudes.data ?? []).filter((s: Solicitud) => {
      if (soloParaTi && !solicitudEncajaConProfesional(s, categoriaIdsProfesional, zonaSlugsProfesional, zonas)) {
        return false
      }
      if (categoria && s.categoriaSlug !== categoria) return false
      if (zona && !coincideZona(zona, [s.zonaSlug], zonasPorSlug)) return false
      if (busqueda && !s.titulo.toLowerCase().includes(busqueda) && !s.descripcion.toLowerCase().includes(busqueda)) {
        return false
      }
      return true
    })
  }, [
    solicitudes.data,
    soloParaTi,
    categoriaIdsProfesional,
    zonaSlugsProfesional,
    zonas,
    zonasPorSlug,
    categoria,
    zona,
    texto,
  ])

  const hayFiltrosLibres = Boolean(categoria || zona || texto)

  if (solicitudes.isLoading) {
    return <LoadingState etiqueta="Cargando solicitudes…" />
  }

  if (solicitudes.isError) {
    return <ErrorState descripcion="No hemos podido cargar las solicitudes disponibles." />
  }

  return (
    <div>
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSoloParaTi((v) => !v)}
            aria-pressed={soloParaTi}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm font-medium',
              soloParaTi ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-neutral-300 text-neutral-600',
            )}
          >
            Para ti
          </button>
          <span className="text-xs text-neutral-500">
            {soloParaTi ? 'Solo tu oficio y tu zona' : 'Explorando todas las solicitudes abiertas'}
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <SelectorCategoria
            familias={familias}
            categorias={categorias}
            value={categoria}
            onChange={setCategoria}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 sm:w-48"
          />
          <BuscadorZonaUnica zonas={zonas} valor={zona} onChange={setZona} placeholder="Cualquier localidad" />
          <input
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar por título o descripción…"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-neutral-500">
        {resultados.length} {resultados.length === 1 ? 'solicitud encontrada' : 'solicitudes encontradas'}
      </p>

      {resultados.length === 0 ? (
        <div className="mt-3">
          <EmptyState
            titulo={
              soloParaTi || hayFiltrosLibres
                ? 'Ninguna solicitud coincide ahora mismo'
                : 'No hay solicitudes abiertas ahora mismo'
            }
            descripcion={soloParaTi ? 'Prueba a quitar "Para ti" para ver todas las solicitudes abiertas.' : undefined}
          />
        </div>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {resultados.map((s) => (
            <li key={s.id}>
              <Link
                to={`/solicitudes/${s.id}`}
                className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50">
                  <IconoCategoria iconoUrl={s.categoriaIconoUrl} nombre={s.categoriaNombre} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-900">{s.titulo}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
                    <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-700">
                      {s.categoriaNombre}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {s.zonaNombre}
                    </span>
                    <span>· {formatearFecha(s.creadoEn)}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
