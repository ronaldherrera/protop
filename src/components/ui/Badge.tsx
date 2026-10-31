import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Tono = 'neutro' | 'marca' | 'exito' | 'aviso' | 'error' | 'patrocinado' | 'verificado' | 'ejemplo'

const tonos: Record<Tono, string> = {
  neutro: 'bg-neutral-100 text-neutral-700',
  marca: 'bg-brand-100 text-brand-800',
  exito: 'bg-success-100 text-success-500',
  aviso: 'bg-warning-100 text-warning-500',
  error: 'bg-danger-100 text-danger-500',
  // Patrocinado va en gris con borde: se distingue sin parecer un sello de calidad.
  patrocinado: 'bg-white text-neutral-700 ring-1 ring-inset ring-neutral-300',
  verificado: 'bg-accent-100 text-accent-600',
  ejemplo: 'bg-metro-100 text-metro-800',
}

export function Badge({ tono = 'neutro', children }: { tono?: Tono; children: ReactNode }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', tonos[tono])}
    >
      {children}
    </span>
  )
}
