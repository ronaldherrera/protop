import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Tono = 'neutro' | 'marca' | 'exito' | 'aviso' | 'patrocinado'

const tonos: Record<Tono, string> = {
  neutro: 'bg-neutral-100 text-neutral-700',
  marca: 'bg-brand-100 text-brand-700',
  exito: 'bg-success-100 text-success-500',
  aviso: 'bg-warning-100 text-warning-500',
  patrocinado: 'bg-accent-100 text-accent-700',
}

export function Badge({ tono = 'neutro', children }: { tono?: Tono; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        tonos[tono],
      )}
    >
      {children}
    </span>
  )
}
