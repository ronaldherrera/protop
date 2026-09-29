import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { Lightbox } from '../ui/Lightbox'

export function CarruselFotos({ fotos, nombreAlt }: { fotos: string[]; nombreAlt: string }) {
  const [fotoAbierta, setFotoAbierta] = useState<number | null>(null)
  const contenedorRef = useRef<HTMLDivElement>(null)

  function desplazar(direccion: 1 | -1) {
    const contenedor = contenedorRef.current
    if (!contenedor) return
    contenedor.scrollBy({ left: direccion * contenedor.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={contenedorRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {fotos.map((foto, indice) => (
          <button
            type="button"
            key={foto}
            onClick={() => setFotoAbierta(indice)}
            className="group aspect-4/3 w-[70%] shrink-0 snap-start overflow-hidden rounded-lg sm:w-[45%] lg:w-[31%]"
          >
            <img
              src={foto}
              alt={`Trabajo de ${nombreAlt}`}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {fotos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => desplazar(-1)}
            aria-label="Fotos anteriores"
            className="absolute left-1 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-neutral-700 shadow hover:bg-white sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => desplazar(1)}
            aria-label="Más fotos"
            className="absolute right-1 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-neutral-700 shadow hover:bg-white sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {fotoAbierta !== null && (
        <Lightbox fotos={fotos} indiceInicial={fotoAbierta} onCerrar={() => setFotoAbierta(null)} />
      )}
    </div>
  )
}
