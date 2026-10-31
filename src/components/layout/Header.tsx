import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { useModo } from '../../features/modo/useModo'
import { cn } from '../../lib/cn'
import { baseBoton, tamanosBoton, variantesBoton } from '../ui/estilosBoton'
import { Logo } from './Logo'
import { MenuPublicar } from './MenuPublicar'

const ENLACES = [
  { to: '/profesionales', etiqueta: 'Directorio' },
  { to: '/solicitar-presupuesto', etiqueta: 'Pedir presupuestos' },
  { to: '/blog', etiqueta: 'Guías' },
]

const claseEnlace = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative py-1 text-[0.95rem] font-semibold text-neutral-700 hover:text-neutral-950',
    isActive && 'text-neutral-950 after:absolute after:inset-x-0 after:-bottom-[1.15rem] after:h-0.5 after:bg-brand-500',
  )

export function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { user } = useAuth()
  const { modo } = useModo()

  const rutaPerfil = modo === 'profesional' ? '/profesional' : '/particular'
  const cerrar = () => setMenuAbierto(false)

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 md:gap-8">
        <NavLink to="/" className="shrink-0" onClick={cerrar} aria-label="Protop, ir al inicio">
          <Logo />
        </NavLink>

        <nav className="hidden flex-1 items-center gap-7 md:flex" aria-label="Navegación principal">
          {ENLACES.map((enlace) => (
            <NavLink key={enlace.to} to={enlace.to} className={claseEnlace}>
              {enlace.etiqueta}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3 md:gap-5">
          {!user && (
            <NavLink to="/para-profesionales" className={cn(claseEnlace({ isActive: false }), 'hidden lg:inline')}>
              Soy profesional
            </NavLink>
          )}
          <NavLink
            to={user ? rutaPerfil : '/acceso'}
            className={cn(baseBoton, variantesBoton.secundario, tamanosBoton.md, 'hidden md:inline-flex')}
          >
            {user ? 'Mi área' : 'Entrar'}
          </NavLink>
          <MenuPublicar alElegir={cerrar} />
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-800 hover:bg-neutral-100 md:hidden"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          {menuAbierto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuAbierto && (
        <nav id="menu-movil" className="border-t border-neutral-200 bg-white px-4 pb-5 md:hidden" aria-label="Navegación móvil">
          <ul className="flex flex-col pt-2">
            {[...ENLACES, ...(user ? [] : [{ to: '/para-profesionales', etiqueta: 'Soy profesional' }])].map((enlace) => (
              <li key={enlace.to}>
                <NavLink
                  to={enlace.to}
                  onClick={cerrar}
                  className="block border-b border-neutral-100 py-3 text-lg font-semibold text-neutral-800"
                >
                  {enlace.etiqueta}
                </NavLink>
              </li>
            ))}
          </ul>
          <NavLink
            to={user ? rutaPerfil : '/acceso'}
            onClick={cerrar}
            className={cn(baseBoton, variantesBoton.primario, tamanosBoton.lg, 'mt-4 w-full')}
          >
            {user ? 'Mi área' : 'Entrar'}
          </NavLink>
        </nav>
      )}
    </header>
  )
}
