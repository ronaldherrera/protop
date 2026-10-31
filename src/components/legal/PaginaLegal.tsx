import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { ULTIMA_ACTUALIZACION } from '../../features/legal/titular'
import { cn } from '../../lib/cn'
import { useSeo } from '../../lib/useSeo'

const PAGINAS = [
  { to: '/legal/aviso-legal', etiqueta: 'Aviso legal' },
  { to: '/legal/privacidad', etiqueta: 'Privacidad' },
  { to: '/legal/cookies', etiqueta: 'Cookies' },
]

export function PaginaLegal({ titulo, descripcion, children }: { titulo: string; descripcion: string; children: ReactNode }) {
  useSeo(`${titulo} | Protop`, descripcion)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav aria-label="Textos legales" className="flex flex-wrap gap-2">
        {PAGINAS.map((pagina) => (
          <NavLink
            key={pagina.to}
            to={pagina.to}
            className={({ isActive }) =>
              cn(
                'rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset',
                isActive ? 'bg-ink text-white ring-ink' : 'bg-white text-neutral-700 ring-neutral-300 hover:ring-neutral-500',
              )
            }
          >
            {pagina.etiqueta}
          </NavLink>
        ))}
      </nav>
      <h1 className="titular mt-8 text-4xl text-neutral-900 sm:text-5xl">{titulo}</h1>
      <p className="mt-2 text-sm text-neutral-500">Última actualización: {ULTIMA_ACTUALIZACION}</p>
      <div className="texto-legal mt-8 flex flex-col gap-4 text-neutral-700 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:text-neutral-900 [&_h3]:mt-2 [&_h3]:text-lg [&_h3]:text-neutral-900 [&_li]:ml-5 [&_li]:list-disc [&_a]:font-semibold [&_a]:text-brand-700 [&_a]:underline [&_table]:w-full [&_table]:text-sm [&_td]:border-b [&_td]:border-neutral-200 [&_td]:py-2 [&_td]:pr-3 [&_td]:align-top [&_th]:border-b [&_th]:border-neutral-300 [&_th]:py-2 [&_th]:pr-3 [&_th]:text-left">
        {children}
      </div>
    </div>
  )
}
