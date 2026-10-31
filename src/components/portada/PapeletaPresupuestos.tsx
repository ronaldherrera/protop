import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../lib/cn'

const TIRAS = 6
const RUTA = '/solicitar-presupuesto'

/**
 * La papeleta de tiras de los tablones de toda la vida: arrancas una tira y te la llevas.
 * Aquí la tira arrancada lleva a pedir presupuestos.
 */
export function PapeletaPresupuestos() {
  const navigate = useNavigate()
  const [arrancada, setArrancada] = useState<number | null>(null)

  function arrancar(indice: number) {
    if (arrancada !== null) return
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (sinMovimiento) {
      navigate(RUTA)
      return
    }
    setArrancada(indice)
    window.setTimeout(() => navigate(RUTA), 480)
  }

  return (
    <div className="relative rounded-sm bg-[#fffdf6] px-6 pb-0 pt-7 shadow-tarjeta-alzada">
      {/* Cinta de carrocero sujetando la papeleta */}
      <span
        className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[-3deg] bg-[#efe3c4]/90 shadow-sm"
        aria-hidden="true"
      />
      <p className="font-mano text-[2.1rem] font-bold leading-none text-neutral-900">¿Obra en casa?</p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-neutral-700">
        Cuéntala una vez y deja que los profesionales de tu zona te escriban con su presupuesto. Sin llamar uno a uno.
      </p>

      <div className="mt-5 flex border-t-2 border-dashed border-neutral-300">
        {Array.from({ length: TIRAS }, (_, indice) => (
          <button
            key={indice}
            type="button"
            onClick={() => arrancar(indice)}
            tabIndex={indice === 0 ? 0 : -1}
            aria-hidden={indice === 0 ? undefined : true}
            aria-label={indice === 0 ? 'Pedir presupuestos' : undefined}
            className={cn(
              'group/tira flex h-32 flex-1 items-center justify-center border-l-2 border-dashed border-neutral-300 bg-[#fffdf6] first:border-l-0',
              'origin-top transition-transform hover:-rotate-2 hover:translate-y-0.5 focus-visible:-rotate-2',
              arrancada === indice && 'tira-arrancada',
            )}
          >
            <span className="whitespace-nowrap font-mano text-xl font-semibold text-brand-600 [writing-mode:vertical-rl] rotate-180">
              Pedir presupuestos
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
