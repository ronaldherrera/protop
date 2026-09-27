import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-semibold text-neutral-700">Protop</p>
          <p>El tablón digital de profesionales de reformas y hogar en Santander y alrededores.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Enlaces del pie de página">
          <Link to="/profesionales" className="hover:text-brand-700">
            Directorio
          </Link>
          <Link to="/solicitar-presupuesto" className="hover:text-brand-700">
            Solicitar presupuestos
          </Link>
          <Link to="/acceso?rol=profesional" className="hover:text-brand-700">
            Publicar mi ficha
          </Link>
        </nav>
      </div>
    </footer>
  )
}
