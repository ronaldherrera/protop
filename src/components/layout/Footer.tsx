import { Link } from 'react-router-dom'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-neutral-300 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Logo invertido />
          <p className="mt-2 text-neutral-400">
            El tablón digital de profesionales de reformas y hogar en Santander y alrededores.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Enlaces del pie de página">
          <Link to="/profesionales" className="hover:text-brand-400">
            Directorio
          </Link>
          <Link to="/solicitar-presupuesto" className="hover:text-brand-400">
            Solicitar presupuestos
          </Link>
          <Link to="/acceso?rol=profesional" className="hover:text-brand-400">
            Publicar mi ficha
          </Link>
        </nav>
      </div>
    </footer>
  )
}
