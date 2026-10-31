import { Link } from 'react-router-dom'
import { rutaOficio } from '../../features/seo/oficios'
import type { Categoria, Familia } from '../../types/profesional'
import { IconoCategoria } from '../directorio/IconoCategoria'

/** Todos los oficios a la vista, como las secciones de un tablón de anuncios. */
type Props = {
  categorias: Categoria[]
  familias: Familia[]
  /** Solicitudes abiertas por slug de oficio (cifras reales; vacío si no hay ninguna). */
  abiertas?: Record<string, number>
}

export function RejillaOficios({ categorias, familias, abiertas = {} }: Props) {
  if (categorias.length === 0) return null

  // Agrupadas por familia (en el orden de las familias) para que los oficios afines queden juntos.
  const ordenFamilia = new Map(familias.map((familia, indice) => [familia.id, indice]))
  const ordenadas = [...categorias].sort(
    (a, b) => (ordenFamilia.get(a.familiaId) ?? 99) - (ordenFamilia.get(b.familiaId) ?? 99),
  )

  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
      {ordenadas.map((categoria) => (
        <li key={categoria.id}>
          <Link
            to={rutaOficio(categoria.slug)}
            className="group flex h-full flex-col items-start gap-3 rounded-2xl bg-white p-4 shadow-tarjeta ring-1 ring-neutral-200/70 transition-shadow hover:shadow-tarjeta-alzada hover:ring-brand-200"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 transition-colors group-hover:bg-brand-100">
              <IconoCategoria iconoUrl={categoria.iconoUrl} nombre={categoria.nombre} className="h-6 w-6" />
            </span>
            <span className="text-[0.92rem] font-semibold leading-snug text-neutral-800">{categoria.nombre}</span>
            {(abiertas[categoria.slug] ?? 0) > 0 && (
              <span className="mt-auto rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                {abiertas[categoria.slug]} {abiertas[categoria.slug] === 1 ? 'trabajo abierto' : 'trabajos abiertos'}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}
