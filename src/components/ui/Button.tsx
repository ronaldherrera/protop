import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { type Tamano, type Variante, baseBoton, tamanosBoton, variantesBoton } from './estilosBoton'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante
  tamano?: Tamano
}

export function Button({ variante = 'primario', tamano = 'md', className, ...props }: Props) {
  return <button className={cn(baseBoton, variantesBoton[variante], tamanosBoton[tamano], className)} {...props} />
}
