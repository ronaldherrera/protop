import { Home } from 'lucide-react'
import { cn } from '../../lib/cn'

export function Logo({ className, invertido = false }: { className?: string; invertido?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 border-brand-500">
        <Home
          className={cn('h-4 w-4', invertido ? 'text-white' : 'text-brand-500')}
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </span>
      <span className="font-heading text-lg font-extrabold tracking-tight">
        <span className={invertido ? 'text-white' : 'text-ink'}>PRO</span>
        <span className="text-brand-500">TOP</span>
      </span>
    </span>
  )
}
