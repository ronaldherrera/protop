import { cn } from '../../lib/cn'

export function Logo({ className, invertido = false }: { className?: string; invertido?: boolean }) {
  return (
    <img
      src={invertido ? '/iconos/logotipo-negativo.svg' : '/iconos/logotipo.svg'}
      alt="Protop"
      className={cn('h-8 w-auto', className)}
    />
  )
}
