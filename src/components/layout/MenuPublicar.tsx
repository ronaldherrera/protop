import { ClipboardList, IdCard, Plus } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { baseBoton, tamanosBoton, variantesBoton } from '../ui/estilosBoton'

const OPCIONES = [
  {
    to: '/solicitar-presupuesto',
    Icono: ClipboardList,
    titulo: 'Un trabajo que necesito',
    texto: 'Recibe presupuestos de profesionales de tu zona.',
  },
  {
    to: '/acceso?rol=profesional',
    Icono: IdCard,
    titulo: 'Mi ficha de profesional',
    texto: 'Gratis y sin comisión por los trabajos.',
  },
]

/** El «Publicar» siempre a mano: en Protop se publica un trabajo o una ficha. */
export function MenuPublicar({ alElegir }: { alElegir?: () => void }) {
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef<HTMLDivElement>(null)
  const idMenu = useId()

  useEffect(() => {
    if (!abierto) return
    function cerrarFuera(evento: MouseEvent) {
      if (!contenedor.current?.contains(evento.target as Node)) setAbierto(false)
    }
    function cerrarConEscape(evento: KeyboardEvent) {
      if (evento.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('mousedown', cerrarFuera)
    document.addEventListener('keydown', cerrarConEscape)
    return () => {
      document.removeEventListener('mousedown', cerrarFuera)
      document.removeEventListener('keydown', cerrarConEscape)
    }
  }, [abierto])

  return (
    <div ref={contenedor} className="relative">
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls={idMenu}
        onClick={() => setAbierto((valor) => !valor)}
        className={cn(baseBoton, variantesBoton.primario, tamanosBoton.md)}
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        Publicar
      </button>
      {abierto && (
        <div
          id={idMenu}
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-tarjeta bg-white p-2 shadow-tarjeta-alzada ring-1 ring-neutral-200"
        >
          {OPCIONES.map(({ to, Icono, titulo, texto }) => (
            <Link
              key={to}
              to={to}
              onClick={() => {
                setAbierto(false)
                alElegir?.()
              }}
              className="flex gap-3 rounded-xl p-3 hover:bg-brand-50 focus-visible:bg-brand-50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icono className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold text-neutral-900">{titulo}</span>
                <span className="block text-sm text-neutral-600">{texto}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
