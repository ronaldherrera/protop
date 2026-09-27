import { Star } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Badge } from './Badge'

type Props = {
  puntuacion: number | null
  trabajosValorados: number
  tamano?: 'sm' | 'md'
}

function formatearPuntuacion(valor: number): string {
  return valor.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

export function Puntuacion({ puntuacion, trabajosValorados, tamano = 'md' }: Props) {
  if (puntuacion === null) {
    return <Badge tono="neutro">Sin valoraciones verificadas</Badge>
  }

  return (
    <div className={cn('flex items-center gap-1.5', tamano === 'sm' ? 'text-sm' : 'text-base')}>
      <Star className="h-4 w-4 fill-accent-500 text-accent-500" aria-hidden="true" />
      <span className="font-semibold text-neutral-900">{formatearPuntuacion(puntuacion)}/5</span>
      <span className="text-neutral-500">
        · {trabajosValorados} {trabajosValorados === 1 ? 'trabajo valorado' : 'trabajos valorados'} con factura
      </span>
    </div>
  )
}
