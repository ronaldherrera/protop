import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'

const ENLACES = [
  { to: '/profesionales', etiqueta: 'Directorio' },
  { to: '/solicitar-presupuesto', etiqueta: 'Solicitar presupuesto' },
]

export function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="text-xl font-bold text-brand-700" onClick={() => setMenuAbierto(false)}>
          Protop
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navegación principal">
          {ENLACES.map((enlace) => (
            <NavLink
              key={enlace.to}
              to={enlace.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium text-neutral-700 hover:text-brand-700',
                  isActive && 'text-brand-700',
                )
              }
            >
              {enlace.etiqueta}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <NavLink to="/acceso?rol=profesional" className="text-sm font-medium text-neutral-700 hover:text-brand-700">
            Para profesionales
          </NavLink>
          <NavLink
            to="/acceso"
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Acceder
          </NavLink>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          {menuAbierto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuAbierto && (
        <nav className="border-t border-neutral-200 bg-white px-4 pb-4 md:hidden" aria-label="Navegación móvil">
          <ul className="flex flex-col gap-1 pt-2">
            {[...ENLACES, { to: '/acceso?rol=profesional', etiqueta: 'Para profesionales' }, { to: '/acceso', etiqueta: 'Acceder' }].map(
              (enlace) => (
                <li key={enlace.to}>
                  <NavLink
                    to={enlace.to}
                    onClick={() => setMenuAbierto(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    {enlace.etiqueta}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}
