import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { baseBoton, tamanosBoton, variantesBoton } from '../ui/estilosBoton'

/** El hueco libre del tablón: la invitación a los profesionales a clavar su tarjeta. */
export function TarjetaEnBlanco() {
  return (
    <div className="chincheta rounded-tarjeta bg-white/80 p-6 pt-7 outline-2 outline-offset-[-10px] outline-dashed outline-neutral-300 shadow-tarjeta-alzada backdrop-blur-sm">
      <p className="font-mano text-[2.1rem] font-bold leading-none text-neutral-900">Aquí cabe tu tarjeta</p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-neutral-700">
        ¿Eres profesional? Clávala gratis: tus trabajos, tus fotos y tus valoraciones. Sin cuota y sin comisión por los
        trabajos que consigas.
      </p>
      <Link to="/acceso?rol=profesional" className={cn(baseBoton, variantesBoton.primario, tamanosBoton.md, 'mt-5')}>
        Crear mi ficha gratis
      </Link>
    </div>
  )
}
