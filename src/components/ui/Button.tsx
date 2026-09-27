import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type Variante = 'primario' | 'secundario' | 'fantasma'
type Tamano = 'md' | 'lg'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante
  tamano?: Tamano
}

const variantes: Record<Variante, string> = {
  primario: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
  secundario: 'bg-white text-brand-700 border border-brand-300 hover:bg-brand-50',
  fantasma: 'bg-transparent text-brand-700 hover:bg-brand-50',
}

const tamanos: Record<Tamano, string> = {
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base',
}

export function Button({ variante = 'primario', tamano = 'md', className, ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variantes[variante],
        tamanos[tamano],
        className,
      )}
      {...props}
    />
  )
}
