import { useLayoutEffect, useRef, useState } from 'react'
import { IconoCategoria } from '../directorio/IconoCategoria'
import { Modal } from '../ui/Modal'
import type { Profesional } from '../../types/profesional'

export function ChipsOficios({ oficios }: { oficios: Profesional['oficios'] }) {
  const contenedorRef = useRef<HTMLDivElement>(null)
  const [alturaVisible, setAlturaVisible] = useState<number>()
  const [verTodos, setVerTodos] = useState(false)

  useLayoutEffect(() => {
    const contenedor = contenedorRef.current
    if (!contenedor) return

    function medir() {
      const hijos = Array.from(contenedor!.children) as HTMLElement[]
      if (hijos.length === 0) return
      const contenedorTop = contenedor!.getBoundingClientRect().top
      const filasVistas: number[] = []
      for (const hijo of hijos) {
        const top = Math.round(hijo.getBoundingClientRect().top - contenedorTop)
        if (!filasVistas.includes(top)) filasVistas.push(top)
        if (filasVistas.length > 2) {
          setAlturaVisible(top)
          return
        }
      }
      setAlturaVisible(undefined)
    }

    medir()
    const observer = new ResizeObserver(medir)
    observer.observe(contenedor)
    return () => observer.disconnect()
  }, [oficios])

  if (oficios.length === 0) return null

  const hayOcultos = alturaVisible !== undefined

  return (
    <>
      <div
        ref={contenedorRef}
        className="mt-4 flex flex-wrap gap-1.5 overflow-hidden"
        style={{ maxHeight: alturaVisible }}
      >
        {oficios.map((oficio) => (
          <span
            key={oficio.id}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
          >
            <IconoCategoria iconoUrl={oficio.iconoUrl} nombre={oficio.nombre} className="h-3.5 w-3.5" />
            {oficio.nombre}
          </span>
        ))}
      </div>

      {hayOcultos && (
        <button
          type="button"
          onClick={() => setVerTodos(true)}
          className="mt-1.5 text-xs font-medium text-brand-700 hover:underline"
        >
          Ver todos los oficios ({oficios.length})
        </button>
      )}

      {verTodos && (
        <Modal titulo="Tus oficios" onCerrar={() => setVerTodos(false)}>
          <ul className="flex flex-col gap-2">
            {oficios.map((oficio) => (
              <li
                key={oficio.id}
                className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700"
              >
                <IconoCategoria iconoUrl={oficio.iconoUrl} nombre={oficio.nombre} className="h-4 w-4" />
                {oficio.nombre}
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </>
  )
}
