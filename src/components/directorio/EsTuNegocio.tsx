import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEstadisticasFicha } from '../../features/directorio/visitas'
import { cn } from '../../lib/cn'
import { baseBoton, tamanosBoton, variantesBoton } from '../ui/estilosBoton'

const VENTAJAS = ['Sube fotos de tus trabajos', 'Recibe solicitudes de tu zona', 'Consigue valoraciones con factura']

/**
 * En una ficha creada por Protop: le enseña al dueño que su negocio ya tiene visitas y le invita a reclamarla.
 * Es la puerta de entrada de los profesionales que aún no se han registrado.
 */
export function EsTuNegocio({ slug }: { slug: string }) {
  const estadisticas = useEstadisticasFicha(slug)
  const visitas = estadisticas.data?.visitas ?? 0
  const contactos = estadisticas.data?.contactos ?? 0

  return (
    <div className="mt-8 rounded-tarjeta bg-white p-5 shadow-tarjeta ring-1 ring-neutral-200">
      <h2 className="text-xl font-bold text-neutral-900">¿Es tu negocio?</h2>
      {visitas > 0 ? (
        <p className="mt-2 text-sm text-neutral-700">
          En los últimos 30 días, <strong className="text-neutral-900">{visitas === 1 ? '1 persona ha' : `${visitas} personas han`}</strong>{' '}
          visto esta ficha
          {contactos > 0 && (
            <>
              {' '}
              y <strong className="text-neutral-900">{contactos === 1 ? '1 ha' : `${contactos} han`}</strong> pulsado para
              contactar
            </>
          )}
          . Reclámala y gestiónala tú.
        </p>
      ) : (
        <p className="mt-2 text-sm text-neutral-700">
          Los vecinos ya la encuentran al buscar tu oficio. Reclámala y gestiónala tú: es gratis.
        </p>
      )}
      <ul className="mt-3 flex flex-col gap-1.5">
        {VENTAJAS.map((ventaja) => (
          <li key={ventaja} className="flex gap-2 text-sm text-neutral-700">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
            {ventaja}
          </li>
        ))}
      </ul>
      <Link to={`/reclamar/${slug}`} className={cn(baseBoton, variantesBoton.oscuro, tamanosBoton.md, 'mt-4 w-full')}>
        Reclamar mi ficha gratis
      </Link>
    </div>
  )
}
