import { Star } from 'lucide-react'
import { cn } from '../../lib/cn'
import { formatearPuntuacion, textoTrabajosValorados } from '../../lib/formatoPuntuacion'

type Props = {
  puntuacion: number | null
  trabajosValorados: number
  tamano?: 'sm' | 'md'
  centrado?: boolean
}

export function Puntuacion({ puntuacion, trabajosValorados, tamano = 'md', centrado = false }: Props) {
  const texto = tamano === 'sm' ? 'text-sm' : 'text-base'

  if (puntuacion === null) {
    return (
      <p className={cn('text-neutral-500', texto, centrado && 'text-center')}>Sin valoraciones verificadas</p>
    )
  }

  return (
    <p
      className={cn('flex flex-wrap items-center gap-x-1.5', texto, centrado && 'flex-col gap-0.5')}
    >
      <span className="cifras inline-flex items-center gap-1 font-semibold text-neutral-900">
        <Star className="h-4 w-4 self-center fill-brand-500 text-brand-500" aria-hidden="true" />
        {formatearPuntuacion(puntuacion)}/5
      </span>
      <span className="text-neutral-500">
        {!centrado && <span aria-hidden="true">· </span>}
        {textoTrabajosValorados(trabajosValorados)}
      </span>
    </p>
  )
}
