import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

type Props = {
  pasoActual: number
  titulos: string[]
  onIrAPaso?: (paso: number) => void
}

export function Stepper({ pasoActual, titulos, onIrAPaso }: Props) {
  return (
    <ol className="flex items-start">
      {titulos.map((titulo, indice) => {
        const numero = indice + 1
        const completado = numero < pasoActual
        const activo = numero === pasoActual
        return (
          <li key={titulo} className={cn('flex items-center', numero < titulos.length && 'flex-1')}>
            <button
              type="button"
              onClick={() => onIrAPaso?.(numero)}
              disabled={!onIrAPaso}
              className="flex flex-col items-center gap-1 disabled:cursor-default"
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold',
                  completado
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : activo
                      ? 'border-brand-600 text-brand-700'
                      : 'border-neutral-300 text-neutral-400',
                )}
              >
                {completado ? <Check className="h-4 w-4" /> : numero}
              </span>
              <span className={cn('text-xs font-medium', activo ? 'text-brand-700' : 'text-neutral-500')}>
                {titulo}
              </span>
            </button>
            {numero < titulos.length && (
              <div className={cn('mx-2 mb-4 h-0.5 flex-1', completado ? 'bg-brand-600' : 'bg-neutral-200')} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
