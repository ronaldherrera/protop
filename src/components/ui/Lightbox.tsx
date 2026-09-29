import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type Props = {
  fotos: string[]
  indiceInicial: number
  onCerrar: () => void
}

export function Lightbox({ fotos, indiceInicial, onCerrar }: Props) {
  const [indice, setIndice] = useState(indiceInicial)

  useEffect(() => {
    function alPulsarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') onCerrar()
      if (evento.key === 'ArrowRight') setIndice((i) => (i + 1) % fotos.length)
      if (evento.key === 'ArrowLeft') setIndice((i) => (i - 1 + fotos.length) % fotos.length)
    }
    document.addEventListener('keydown', alPulsarTecla)
    return () => document.removeEventListener('keydown', alPulsarTecla)
  }, [fotos.length, onCerrar])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <button type="button" aria-label="Cerrar" className="fixed inset-0 cursor-default" onClick={onCerrar} tabIndex={-1} />

      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar"
        className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
      >
        <X className="h-5 w-5" />
      </button>

      {fotos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIndice((i) => (i - 1 + fotos.length) % fotos.length)}
            aria-label="Foto anterior"
            className="absolute left-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 sm:left-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => setIndice((i) => (i + 1) % fotos.length)}
            aria-label="Foto siguiente"
            className="absolute right-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 sm:right-4"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <img src={fotos[indice]} alt="" className="relative max-h-[90vh] max-w-full rounded-lg object-contain" />

      {fotos.length > 1 && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
          {indice + 1} / {fotos.length}
        </p>
      )}
    </div>
  )
}
