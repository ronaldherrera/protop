import { Link } from 'react-router-dom'
import { OFICIOS_SEO, rutaOficio } from '../../features/seo/oficios'
import { Logo } from './Logo'

// Ciudades grandes de toda España (slugs de la tabla zonas).
const LOCALIDADES = [
  { slug: 'madrid', nombre: 'Madrid' },
  { slug: 'barcelona', nombre: 'Barcelona' },
  { slug: 'valencia', nombre: 'Valencia' },
  { slug: 'sevilla', nombre: 'Sevilla' },
  { slug: 'zaragoza', nombre: 'Zaragoza' },
  { slug: 'malaga', nombre: 'Málaga' },
  { slug: 'bilbao', nombre: 'Bilbao' },
  { slug: 'santander', nombre: 'Santander' },
]

const PROTOP = [
  { to: '/solicitar-presupuesto', etiqueta: 'Pedir presupuestos' },
  { to: '/para-profesionales', etiqueta: 'Para profesionales' },
  { to: '/acceso?rol=profesional', etiqueta: 'Publicar mi ficha gratis' },
  { to: '/blog', etiqueta: 'Guías de reformas' },
]

const claseEnlace = 'hover:text-white hover:underline'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-neutral-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_2fr_0.9fr_0.9fr]">
        <div className="max-w-xs">
          <Logo invertido className="h-9" />
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            El tablón de profesionales de reformas y reparaciones de toda España. Contacto directo, sin intermediarios,
            y valoraciones que solo se publican con factura revisada.
          </p>
        </div>

        <nav aria-label="Profesionales por oficio">
          <h2 className="text-sm font-semibold text-white">Profesionales por oficio</h2>
          <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {OFICIOS_SEO.map((oficio) => (
              <li key={oficio.categoria}>
                <Link to={rutaOficio(oficio.categoria)} className={claseEnlace}>
                  {oficio.plural}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Profesionales por ciudad">
          <h2 className="text-sm font-semibold text-white">Por ciudad</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {LOCALIDADES.map((localidad) => (
              <li key={localidad.slug}>
                <Link to={`/profesionales?zona=${localidad.slug}`} className={claseEnlace}>
                  {localidad.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Protop">
          <h2 className="text-sm font-semibold text-white">Protop</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {PROTOP.map((enlace) => (
              <li key={enlace.to}>
                <Link to={enlace.to} className={claseEnlace}>
                  {enlace.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-5 text-xs text-neutral-400 sm:px-6">
          <p>
            © {new Date().getFullYear()} Protop. Protop no está vinculado a ningún comercio, almacén ni fabricante. Algunos
            datos de negocios: ©{' '}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className={claseEnlace}>
              colaboradores de OpenStreetMap
            </a>
            .
          </p>
          <nav aria-label="Textos legales" className="flex gap-4">
            <Link to="/legal/aviso-legal" className={claseEnlace}>
              Aviso legal
            </Link>
            <Link to="/legal/privacidad" className={claseEnlace}>
              Privacidad
            </Link>
            <Link to="/legal/cookies" className={claseEnlace}>
              Cookies
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
