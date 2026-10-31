export type Variante = 'primario' | 'secundario' | 'suave' | 'fantasma' | 'oscuro'
export type Tamano = 'md' | 'lg'

// brand-600 y no brand-500: el naranja de marca con texto blanco no llega a 4,5:1.
export const variantesBoton: Record<Variante, string> = {
  primario: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
  secundario: 'bg-white text-neutral-900 ring-[1.5px] ring-inset ring-neutral-300 hover:ring-neutral-500',
  suave: 'bg-brand-50 text-brand-600 hover:bg-brand-100',
  fantasma: 'bg-transparent text-brand-700 hover:bg-brand-50',
  oscuro: 'bg-ink text-white hover:bg-neutral-950',
}

export const tamanosBoton: Record<Tamano, string> = {
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export const baseBoton =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50'
