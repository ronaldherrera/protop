import { AlertTriangle } from 'lucide-react'
import type { ReactNode } from 'react'

export function ErrorState({
  titulo = 'Algo ha fallado',
  descripcion,
  accion,
}: {
  titulo?: string
  descripcion?: string
  accion?: ReactNode
}) {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-xl border border-danger-100 bg-danger-100/40 px-6 py-12 text-center"
      role="alert"
    >
      <AlertTriangle className="h-8 w-8 text-danger-500" aria-hidden="true" />
      <p className="text-base font-medium text-neutral-900">{titulo}</p>
      {descripcion && <p className="max-w-sm text-sm text-neutral-600">{descripcion}</p>}
      {accion}
    </div>
  )
}
