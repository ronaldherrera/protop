import { useEffect, useRef, useState } from 'react'

export function InfoTooltip({ texto }: { texto: string }) {
  const [abierto, setAbierto] = useState(false)
  const contenedorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function alClicarFuera(evento: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target as Node)) setAbierto(false)
    }
    document.addEventListener('mousedown', alClicarFuera)
    return () => document.removeEventListener('mousedown', alClicarFuera)
  }, [])

  return (
    <div ref={contenedorRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-label="Qué significa este indicador"
        aria-expanded={abierto}
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-semibold text-neutral-600 hover:bg-neutral-300"
      >
        ?
      </button>
      {abierto && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 z-10 mb-1.5 w-48 -translate-x-1/2 rounded-lg bg-neutral-800 px-2.5 py-1.5 text-xs text-white shadow-lg"
        >
          {texto}
          <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
        </div>
      )}
    </div>
  )
}
