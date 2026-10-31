import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useBusquedaProfesionales } from '../../features/directorio/queries'
import { claseCampo } from '../ui/estilosFormulario'

const MINIMO_LETRAS = 3
const ESPERA_MS = 300
const RESULTADOS = 5

/**
 * «¿Ya estás en Protop?»: muchos negocios ya tienen ficha creada con datos públicos. Si el profesional encuentra
 * la suya, la reclama en vez de crear otra.
 */
export function BuscaTuNegocio() {
  const [texto, setTexto] = useState('')
  const [buscado, setBuscado] = useState('')
  useEffect(() => {
    const espera = setTimeout(() => setBuscado(texto.trim()), ESPERA_MS)
    return () => clearTimeout(espera)
  }, [texto])

  const activa = buscado.length >= MINIMO_LETRAS
  const busqueda = useBusquedaProfesionales({ categorias: [], zona: '', texto: buscado }, { activa })
  const resultados = activa ? (busqueda.data?.pages[0]?.resultados ?? []).slice(0, RESULTADOS) : []

  return (
    <div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-neutral-700">Escribe el nombre de tu negocio</span>
        <span className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            placeholder="Ej. Reformas García"
            className={`${claseCampo} pl-9`}
          />
        </span>
      </label>

      {activa && !busqueda.isFetching && resultados.length === 0 && (
        <p className="mt-3 text-sm text-neutral-600">
          No aparece. Crea tu ficha gratis: en unos minutos estará en el tablón.
        </p>
      )}

      {resultados.length > 0 && (
        <ul className="mt-3 flex flex-col divide-y divide-neutral-200 rounded-xl ring-1 ring-neutral-200" aria-live="polite">
          {resultados.map(({ profesional }) => (
            <li key={profesional.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-neutral-900">{profesional.nombreComercial}</p>
                <p className="text-sm text-neutral-600">
                  {profesional.categoriaNombre} · {profesional.localidad}
                </p>
              </div>
              {profesional.sinReclamar ? (
                <Link to={`/reclamar/${profesional.slug}`} className="text-sm font-semibold text-brand-700 hover:underline">
                  Es el mío: reclamarla
                </Link>
              ) : (
                <Link to={`/profesionales/${profesional.slug}`} className="text-sm font-medium text-neutral-600 hover:underline">
                  Ver ficha
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
