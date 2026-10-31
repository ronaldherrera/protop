import type { ReactNode } from 'react'
import { anclaDe, textoDe } from './anclas'

/** Título de sección: lleva ancla para el índice de la guía y para enlazar directamente. */
export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 id={anclaDe(textoDe(children))} className="mt-12 scroll-mt-24 text-[1.7rem] leading-tight text-neutral-900">
      {children}
    </h2>
  )
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-7 text-xl text-neutral-900">{children}</h3>
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[1.05rem] leading-[1.75] text-neutral-700">{children}</p>
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="mt-4 flex flex-col gap-2.5">{children}</ul>
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[1.05rem] leading-[1.7] text-neutral-700">
      <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
      <span>{children}</span>
    </li>
  )
}

/** Pasos que sí son una secuencia: van numerados. */
export function Pasos({ children }: { children: ReactNode }) {
  return <ol className="mt-5 flex flex-col gap-4 [counter-reset:paso]">{children}</ol>
}

export function Paso({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <li className="flex gap-4 [counter-increment:paso]">
      <span
        className="titular flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-lg text-brand-600 before:content-[counter(paso)]"
        aria-hidden="true"
      />
      <div>
        <p className="font-semibold text-neutral-900">{titulo}</p>
        <div className="mt-1 text-[1.02rem] leading-[1.7] text-neutral-700">{children}</div>
      </div>
    </li>
  )
}

/** Tabla sencilla: la primera fila son los encabezados. */
export function Tabla({ filas, nota }: { filas: string[][]; nota?: string }) {
  const [cabecera, ...cuerpo] = filas
  return (
    <figure className="mt-6 overflow-x-auto rounded-tarjeta bg-white ring-1 ring-neutral-200">
      <table className="w-full min-w-[28rem] text-left text-[0.95rem]">
        <thead className="bg-neutral-50">
          <tr>
            {cabecera.map((celda) => (
              <th key={celda} className="px-4 py-3 font-semibold text-neutral-900">
                {celda}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cuerpo.map((fila) => (
            <tr key={fila.join('|')} className="border-t border-neutral-200">
              {fila.map((celda, indice) => (
                <td key={indice} className="px-4 py-3 align-top text-neutral-700">
                  {celda}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {nota && <figcaption className="border-t border-neutral-200 px-4 py-2.5 text-xs text-neutral-500">{nota}</figcaption>}
    </figure>
  )
}

/** Aviso o matiz importante (orientativo, depende del caso…). */
export function Nota({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 rounded-tarjeta bg-neutral-100 p-4 text-[0.95rem] leading-relaxed text-neutral-700">{children}</div>
  )
}

/** Consejo práctico, con la letra «a boli» del tablón en la etiqueta. */
export function Consejo({ children }: { children: ReactNode }) {
  return (
    <aside className="relative mt-7 rounded-sm bg-[#fffdf6] p-5 pt-6 shadow-tarjeta">
      <span className="absolute -top-3 left-6 h-6 w-20 rotate-[-3deg] bg-[#efe3c4]/90 shadow-sm" aria-hidden="true" />
      <p className="font-mano text-2xl font-bold leading-none text-brand-700">Consejo</p>
      <div className="mt-2 text-[1.02rem] leading-[1.7] text-neutral-700">{children}</div>
    </aside>
  )
}
