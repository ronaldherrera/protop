import { Briefcase, Menu, User, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { cerrarSesion } from '../../features/auth/api'
import { usePerfil } from '../../features/auth/queries'
import { useAuth } from '../../features/auth/useAuth'
import { useModo } from '../../features/modo/useModo'
import { cn } from '../../lib/cn'
import { Logo } from './Logo'

const ENLACES_INVITADO = [
  { to: '/profesionales', etiqueta: 'Directorio' },
  { to: '/solicitar-presupuesto', etiqueta: 'Solicitar presupuesto' },
]

const ENLACES_PARTICULAR = [
  { to: '/profesionales', etiqueta: 'Directorio' },
  { to: '/solicitar-presupuesto', etiqueta: 'Solicitar presupuesto' },
  { to: '/particular', etiqueta: 'Mi cuenta' },
]

const ENLACES_PROFESIONAL = [{ to: '/profesional', etiqueta: 'Mi ficha y solicitudes' }]

export function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { user } = useAuth()
  const perfil = usePerfil()
  const { modo, setModo } = useModo()
  const navigate = useNavigate()

  async function salir() {
    setMenuAbierto(false)
    await cerrarSesion()
    navigate('/')
  }

  function cambiarModo(nuevo: 'particular' | 'profesional') {
    setModo(nuevo)
    setMenuAbierto(false)
    navigate(nuevo === 'profesional' ? '/profesional' : '/')
  }

  const enlaces = !user ? ENLACES_INVITADO : modo === 'profesional' ? ENLACES_PROFESIONAL : ENLACES_PARTICULAR
  const enlacesFinal = user && perfil.data?.esAdmin ? [...enlaces, { to: '/admin', etiqueta: 'Administración' }] : enlaces

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <NavLink to="/" className="shrink-0" onClick={() => setMenuAbierto(false)}>
          <Logo />
        </NavLink>

        <nav className="hidden flex-1 items-center gap-6 md:flex" aria-label="Navegación principal">
          {enlacesFinal.map((enlace) => (
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

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          {!user && (
            <NavLink to="/acceso?rol=profesional" className="text-sm font-medium text-neutral-700 hover:text-brand-700">
              Para profesionales
            </NavLink>
          )}
          {user && (
            <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 text-sm font-medium">
              <button
                type="button"
                onClick={() => cambiarModo('particular')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5',
                  modo === 'particular' ? 'bg-white text-brand-700 shadow-sm' : 'text-neutral-600',
                )}
              >
                <User className="h-4 w-4" /> Particular
              </button>
              <button
                type="button"
                onClick={() => cambiarModo('profesional')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5',
                  modo === 'profesional' ? 'bg-white text-brand-700 shadow-sm' : 'text-neutral-600',
                )}
              >
                <Briefcase className="h-4 w-4" /> Profesional
              </button>
            </div>
          )}
          {user ? (
            <button
              type="button"
              onClick={salir}
              className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Salir
            </button>
          ) : (
            <NavLink
              to="/acceso"
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              Acceder
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
          {user && (
            <div className="mt-2 flex gap-1 rounded-lg bg-neutral-100 p-1 text-sm font-medium">
              <button
                type="button"
                onClick={() => cambiarModo('particular')}
                className={cn(
                  'flex-1 rounded-md py-1.5',
                  modo === 'particular' ? 'bg-white text-brand-700 shadow-sm' : 'text-neutral-600',
                )}
              >
                Particular
              </button>
              <button
                type="button"
                onClick={() => cambiarModo('profesional')}
                className={cn(
                  'flex-1 rounded-md py-1.5',
                  modo === 'profesional' ? 'bg-white text-brand-700 shadow-sm' : 'text-neutral-600',
                )}
              >
                Profesional
              </button>
            </div>
          )}
          <ul className="flex flex-col gap-1 pt-2">
            {[
              ...enlacesFinal,
              ...(!user ? [{ to: '/acceso?rol=profesional', etiqueta: 'Para profesionales' }, { to: '/acceso', etiqueta: 'Acceder' }] : []),
            ].map((enlace) => (
              <li key={enlace.to}>
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
                  Salir
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}
