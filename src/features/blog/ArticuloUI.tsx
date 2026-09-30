import type { ReactNode } from 'react'

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-10 text-xl font-semibold text-neutral-900">{children}</h2>
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 leading-relaxed text-neutral-700">{children}</p>
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="mt-3 flex flex-col gap-2">{children}</ul>
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2 leading-relaxed text-neutral-700">
      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
      {children}
    </li>
  )
}

export function Nota({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
      {children}
    </div>
  )
}
