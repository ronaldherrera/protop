import type { LucideIcon } from 'lucide-react'
import { SearchX } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  titulo: string
  descripcion?: string
  icono?: LucideIcon
  accion?: ReactNode
}

export function EmptyState({ titulo, descripcion, icono: Icono = SearchX, accion }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-300 px-6 py-12 text-center">
      <Icono className="h-8 w-8 text-neutral-400" aria-hidden="true" />
      <p className="text-base font-medium text-neutral-900">{titulo}</p>
      {descripcion && <p className="max-w-sm text-sm text-neutral-500">{descripcion}</p>}
      {accion}
    </div>
  )
}
