import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { cerrarSesion } from '../../features/auth/api'
import { useAuth } from '../../features/auth/useAuth'
import { useModo } from '../../features/modo/useModo'
import { cn } from '../../lib/cn'
import { Logo } from './Logo'

const ENLACES_INVITADO = [
  { to: '/', etiqueta: 'Inicio' },
  { to: '/profesionales', etiqueta: 'Directorio' },
  { to: '/solicitar-presupuesto', etiqueta: 'Solicitar presupuesto' },
  { to: '/blog', etiqueta: 'Blog' },
]

export function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { user } = useAuth()
  const { modo } = useModo()
  const navigate = useNavigate()

  async function salir() {
    setMenuAbierto(false)
    await cerrarSesion()
    navigate('/')
  }

  const enlacesFinal = user
    ? [
        { to: '/', etiqueta: 'Descubrir' },
        { to: '/blog', etiqueta: 'Blog' },
        { to: modo === 'profesional' ? '/profesional' : '/particular', etiqueta: 'Perfil' },
      ]
    : ENLACES_INVITADO

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <NavLink to="/" className="shrink-0" onClick={() => setMenuAbierto(false)}>
          <Logo />
        </NavLink>

        <nav className="hidden flex-1 items-center justify-end gap-6 md:flex" aria-label="Navegación principal">
          {enlacesFinal.map((enlace) => (
            <NavLink
              key={enlace.etiqueta}
              to={enlace.to}
              end={enlace.to === '/'}
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

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          {!user && (
            <NavLink to="/para-profesionales" className="text-sm font-medium text-neutral-700 hover:text-brand-700">
              Para profesionales
            </NavLink>
          )}
          {user ? (
            <button
              type="button"
              onClick={salir}
              className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Cerrar sesión
            </button>
          ) : (
            <NavLink
              to="/acceso"
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              Iniciar sesión
            </NavLink>
          )}
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
            {[
              ...enlacesFinal,
              ...(!user
                ? [
                    { to: '/para-profesionales', etiqueta: 'Para profesionales' },
                    { to: '/acceso', etiqueta: 'Iniciar sesión' },
                  ]
                : []),
            ].map((enlace) => (
              <li key={enlace.etiqueta}>
                <NavLink
                  to={enlace.to}
                  onClick={() => setMenuAbierto(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  {enlace.etiqueta}
                </NavLink>
              </li>
            ))}
            {user && (
              <li>
                <button
                  type="button"
                  onClick={salir}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cerrar sesión
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}
