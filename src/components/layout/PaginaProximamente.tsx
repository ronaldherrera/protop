import { Construction } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export function PaginaProximamente({
  titulo,
  descripcion,
  children,
}: {
  titulo: string
  descripcion: string
  children?: ReactNode
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
      <Construction className="h-10 w-10 text-brand-500" aria-hidden="true" />
      <h1 className="text-2xl font-bold text-neutral-900">{titulo}</h1>
      <p className="text-neutral-600">{descripcion}</p>
      {children}
      <Link to="/" className="text-sm font-medium text-brand-700 hover:underline">
        Volver al inicio
      </Link>
    </div>
  )
}
