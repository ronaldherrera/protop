import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type Props = {
  fotos: string[]
  indiceInicial: number
  onCerrar: () => void
  titulo?: string
  descripcion?: string | null
}

export function Lightbox({ fotos, indiceInicial, onCerrar, titulo, descripcion }: Props) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/90 p-4">
      <button type="button" aria-label="Cerrar" className="fixed inset-0 cursor-default" onClick={onCerrar} tabIndex={-1} />

      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar"
        className="fixed right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
      >
        <X className="h-5 w-5" />
      </button>

      {fotos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIndice((i) => (i - 1 + fotos.length) % fotos.length)}
            aria-label="Foto anterior"
            className="fixed left-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 sm:left-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => setIndice((i) => (i + 1) % fotos.length)}
            aria-label="Foto siguiente"
            className="fixed right-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 sm:right-4"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div className="relative flex max-w-3xl flex-col items-center gap-3 py-8">
        <img src={fotos[indice]} alt="" className="max-h-[70vh] max-w-full rounded-lg object-contain" />

        {fotos.length > 1 && (
          <p className="rounded-full bg-black/50 px-3 py-1 text-sm text-white">
            {indice + 1} / {fotos.length}
          </p>
        )}

        {(titulo || descripcion) && (
          <div className="max-w-xl rounded-lg bg-black/50 px-4 py-3 text-center text-white">
            {titulo && <p className="font-medium">{titulo}</p>}
            {descripcion && <p className="mt-1 text-sm text-neutral-200">{descripcion}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
