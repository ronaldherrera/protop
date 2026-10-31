import { cn } from '../../lib/cn'

function iniciales(nombre: string): string {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0]?.toUpperCase())
    .join('')
}

export function Avatar({ nombre, fotoUrl, className }: { nombre: string; fotoUrl?: string; className?: string }) {
  if (fotoUrl) {
    return (
      <img
        src={fotoUrl}
        alt={`Logotipo de ${nombre}`}
        className={cn('bg-white ring-1 ring-black/10', className ?? 'h-14 w-14 rounded-xl object-cover')}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center bg-brand-50 font-heading font-bold text-brand-600',
        className ?? 'h-14 w-14 rounded-xl text-lg',
      )}
      aria-hidden="true"
    >
      {iniciales(nombre)}
    </div>
  )
}
