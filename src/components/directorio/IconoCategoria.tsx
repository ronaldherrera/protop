import { cn } from '../../lib/cn'

export function IconoCategoria({
  iconoUrl,
  nombre,
  className = 'h-8 w-8',
}: {
  iconoUrl: string | null
  nombre: string
  className?: string
}) {
  if (!iconoUrl) return null
  return <img src={iconoUrl} alt="" className={cn('shrink-0', className)} title={nombre} />
}
