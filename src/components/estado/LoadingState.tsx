import { Loader2 } from 'lucide-react'

export function LoadingState({ etiqueta = 'Cargando…' }: { etiqueta?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-neutral-500" role="status">
      <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      <span className="text-sm">{etiqueta}</span>
    </div>
  )
}
