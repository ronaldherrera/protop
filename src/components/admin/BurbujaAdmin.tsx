import { LayoutDashboard, Shield } from 'lucide-react'
import { type PointerEvent, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { usePerfil } from '../../features/auth/queries'
import { SECCIONES_ADMIN } from '../../features/admin/secciones'
import { usePendientesAdmin } from '../../features/admin/usePendientesAdmin'
import { cn } from '../../lib/cn'

const CLAVE = 'protop-burbuja-admin'
const TAM = 52
const MARGEN = 14

type Sitio = { lado: 'izq' | 'der'; y: number }
type Gesto = { dx: number; dy: number; x0: number; y0: number; movido: boolean; ultima?: { x: number; y: number } }

function leerSitio(): Sitio {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE) ?? 'null') as Sitio | null
    if (guardado && (guardado.lado === 'izq' || guardado.lado === 'der')) return guardado
  } catch {
    // sin almacenamiento: posición por defecto
  }
  return { lado: 'der', y: 0.85 }
}

function guardarSitio(sitio: Sitio) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(sitio))
  } catch {
    // sin almacenamiento: no se recuerda la posición
  }
}

// Dónde puede estar: por debajo de la cabecera fija y dentro de la pantalla.
function limites() {
  const cabecera = document.querySelector('header')
  const arriba = (cabecera?.getBoundingClientRect().bottom ?? 0) + MARGEN
  return { arriba, abajo: window.innerHeight - MARGEN - TAM, ancho: window.innerWidth }
}

/** Burbuja de administración: solo la ven los administradores. */
export function BurbujaAdmin() {
  const perfil = usePerfil()
  if (!perfil.data?.esAdmin) return null
  return <Burbuja />
}

// Se despliega con los accesos del panel y se puede arrastrar; al soltarla se pega al borde más cercano y
// recuerda dónde quedó.
function Burbuja() {
  const { pathname } = useLocation()
  const pendientes = usePendientesAdmin(true)
  const [sitio, setSitio] = useState<Sitio>(leerSitio)
  const [arrastre, setArrastre] = useState<{ x: number; y: number } | null>(null)
  const [abierto, setAbierto] = useState(false)
  const [, setTamano] = useState(0)
  const caja = useRef<HTMLDivElement>(null)
  const gesto = useRef<Gesto | null>(null)

  // Se cierra al cambiar de página
  const [rutaPrevia, setRutaPrevia] = useState(pathname)
  if (rutaPrevia !== pathname) {
    setRutaPrevia(pathname)
    setAbierto(false)
  }

  useEffect(() => {
    const alCambiar = () => setTamano(window.innerWidth + window.innerHeight)
    window.addEventListener('resize', alCambiar)
    return () => window.removeEventListener('resize', alCambiar)
  }, [])

  // Se cierra al tocar fuera o con Escape
  useEffect(() => {
    if (!abierto) return undefined
    const fuera = (evento: globalThis.PointerEvent) => {
      if (!caja.current?.contains(evento.target as Node)) setAbierto(false)
    }
    const escape = (evento: KeyboardEvent) => evento.key === 'Escape' && setAbierto(false)
    document.addEventListener('pointerdown', fuera)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', fuera)
      document.removeEventListener('keydown', escape)
    }
  }, [abierto])

  const lim = limites()
  const x = arrastre ? arrastre.x : sitio.lado === 'izq' ? MARGEN : lim.ancho - TAM - MARGEN
  const y = arrastre ? arrastre.y : lim.arriba + sitio.y * Math.max(0, lim.abajo - lim.arriba)
  const cuenta = pendientes.data ?? { valoraciones: 0, reclamaciones: 0, bajas: 0, candidatos: 0 }
  const total = cuenta.valoraciones + cuenta.reclamaciones + cuenta.bajas + cuenta.candidatos

  function alPulsar(evento: PointerEvent<HTMLButtonElement>) {
    if (evento.button !== 0) return
    evento.currentTarget.setPointerCapture(evento.pointerId)
    gesto.current = { dx: evento.clientX - x, dy: evento.clientY - y, x0: evento.clientX, y0: evento.clientY, movido: false }
  }

  function alMover(evento: PointerEvent<HTMLButtonElement>) {
    const g = gesto.current
    if (!g) return
    if (!g.movido && Math.hypot(evento.clientX - g.x0, evento.clientY - g.y0) < 6) return
    if (!g.movido) setAbierto(false)
    g.movido = true
    const l = limites()
    // La última posición va también en el gesto: al soltar rápido, el estado aún no se ha repintado
    g.ultima = {
      x: Math.min(Math.max(evento.clientX - g.dx, MARGEN), l.ancho - TAM - MARGEN),
      y: Math.min(Math.max(evento.clientY - g.dy, l.arriba), l.abajo),
    }
    setArrastre(g.ultima)
  }

  function alSoltar() {
    const g = gesto.current
    gesto.current = null
    if (!g) return
    if (!g.movido || !g.ultima) {
      if (!g.movido) setAbierto((actual) => !actual)
      setArrastre(null)
      return
    }
    const l = limites()
    const nuevo: Sitio = {
      lado: g.ultima.x + TAM / 2 < l.ancho / 2 ? 'izq' : 'der',
      y: Math.min(1, Math.max(0, (g.ultima.y - l.arriba) / Math.max(1, l.abajo - l.arriba))),
    }
    setSitio(nuevo)
    guardarSitio(nuevo)
    setArrastre(null)
  }

  // El menú se abre hacia el centro de la pantalla y hacia donde haya sitio en vertical
  const haciaArriba = y > window.innerHeight * 0.5

  return (
    <div
      ref={caja}
      className={cn('fixed top-0 left-0 z-50', !arrastre && 'transition-transform duration-300 ease-out')}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <button
        type="button"
        onPointerDown={alPulsar}
        onPointerMove={alMover}
        onPointerUp={alSoltar}
        onPointerCancel={() => {
          gesto.current = null
          setArrastre(null)
        }}
        onKeyDown={(evento) => {
          if (evento.key === 'Enter' || evento.key === ' ') {
            evento.preventDefault()
            setAbierto((actual) => !actual)
          }
        }}
        aria-label={total > 0 ? `Administración: ${total} pendientes` : 'Administración'}
        title="Administración"
        aria-expanded={abierto}
        aria-haspopup="menu"
        className={cn(
          'relative flex touch-none items-center justify-center rounded-full bg-neutral-900 text-white shadow-tarjeta-alzada ring-4 ring-white/80 select-none',
          'hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
          arrastre ? 'cursor-grabbing scale-110' : 'cursor-grab',
        )}
        style={{ width: TAM, height: TAM }}
      >
        <Shield className="h-6 w-6" aria-hidden="true" />
        {total > 0 && (
          <b className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-xs font-bold text-white">
            {total > 99 ? '99+' : total}
          </b>
        )}
      </button>

      {abierto && (
        <div
          role="menu"
          className={cn(
            'absolute w-64 overflow-hidden rounded-tarjeta border border-neutral-200 bg-white py-2 shadow-tarjeta-alzada',
            sitio.lado === 'izq' ? 'left-0' : 'right-0',
          )}
          style={haciaArriba ? { bottom: TAM + 10 } : { top: TAM + 10 }}
        >
          <p className="px-4 pt-1 pb-2 text-xs font-semibold text-neutral-500">Administración</p>
          <Link
            role="menuitem"
            to="/admin"
            className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
          >
            <LayoutDashboard className="h-4 w-4 text-neutral-500" aria-hidden="true" />
            Panel completo
          </Link>
          <div className="my-1 border-t border-neutral-100" />
          {SECCIONES_ADMIN.map((seccion) => {
            const numero = seccion.pendiente ? cuenta[seccion.pendiente] : 0
            return (
              <Link
                key={seccion.id}
                role="menuitem"
                to={`/admin#${seccion.id}`}
                onClick={() => setAbierto(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
              >
                <seccion.icono className="h-4 w-4 text-neutral-500" aria-hidden="true" />
                <span className="flex-1">{seccion.etiqueta}</span>
                {numero > 0 && (
                  <b className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">{numero}</b>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
