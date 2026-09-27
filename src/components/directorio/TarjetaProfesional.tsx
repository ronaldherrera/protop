import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buscarCategoriaPorSlug } from '../../features/directorio/categorias'
import type { Profesional } from '../../types/profesional'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { Puntuacion } from '../ui/Puntuacion'

export function TarjetaProfesional({ profesional }: { profesional: Profesional }) {
  const categoria = buscarCategoriaPorSlug(profesional.oficioPrincipal)

  return (
    <Link
      to={`/profesionales/${profesional.slug}`}
      className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md focus-visible:shadow-md"
    >
      <div className="flex items-start gap-3">
        <Avatar nombre={profesional.nombreComercial} fotoUrl={profesional.fotoPerfilUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-neutral-900">{profesional.nombreComercial}</h3>
            {profesional.patrocinado && <Badge tono="patrocinado">Patrocinado</Badge>}
          </div>
          <p className="text-sm text-neutral-500">{categoria?.nombre ?? profesional.oficioPrincipal}</p>
        </div>
      </div>

      <p className="line-clamp-2 text-sm text-neutral-600">{profesional.descripcionBreve}</p>

      <div className="flex items-center gap-1.5 text-sm text-neutral-500">
        <MapPin className="h-4 w-4" aria-hidden="true" />
        {profesional.localidad}
      </div>

      <Puntuacion
        puntuacion={profesional.puntuacionGlobal}
        trabajosValorados={profesional.trabajosValorados}
        tamano="sm"
      />
    </Link>
  )
}
