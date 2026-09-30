import { Star } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Badge } from './Badge'

type Props = {
  puntuacion: number | null
  trabajosValorados: number
  tamano?: 'sm' | 'md'
  centrado?: boolean
}

function formatearPuntuacion(valor: number): string {
  return valor.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

export function Puntuacion({ puntuacion, trabajosValorados, tamano = 'md', centrado = false }: Props) {
  if (puntuacion === null) {
    return <Badge tono="neutro">Sin valoraciones verificadas</Badge>
  }

  const textoTrabajos = `${trabajosValorados} ${trabajosValorados === 1 ? 'trabajo valorado' : 'trabajos valorados'} con factura`

  if (centrado) {
    return (
      <div className={cn('flex flex-col items-center gap-0.5', tamano === 'sm' ? 'text-sm' : 'text-base')}>
        <span className="flex items-center gap-1.5 font-semibold text-neutral-900">
          <Star className="h-4 w-4 fill-brand-500 text-brand-500" aria-hidden="true" />
          {formatearPuntuacion(puntuacion)}/5
        </span>
        <span className="text-neutral-500">{textoTrabajos}</span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-start gap-1.5', tamano === 'sm' ? 'text-sm' : 'text-base')}>
      <Star className="mt-0.5 h-4 w-4 shrink-0 fill-brand-500 text-brand-500" aria-hidden="true" />
      <span className="font-semibold text-neutral-900">{formatearPuntuacion(puntuacion)}/5</span>
      <span className="text-neutral-500">· {textoTrabajos}</span>
    </div>
  )
}
