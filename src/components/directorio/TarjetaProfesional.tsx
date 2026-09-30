import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Profesional } from '../../types/profesional'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { Puntuacion } from '../ui/Puntuacion'
import { IconoCategoria } from './IconoCategoria'

export function TarjetaProfesional({ profesional }: { profesional: Profesional }) {
  const portada = profesional.fotosTrabajos[0]

  return (
    <Link
      to={`/profesionales/${profesional.slug}`}
      className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md focus-visible:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full shrink-0 bg-gradient-to-br from-brand-100 to-brand-200">
        {portada ? (
          <img src={portada} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <IconoCategoria
              iconoUrl={profesional.categoriaIconoUrl}
              nombre={profesional.categoriaNombre}
              className="h-12 w-12 opacity-50"
            />
          </div>
        )}
        {profesional.patrocinado && (
          <div className="absolute left-2 top-2">
            <Badge tono="patrocinado">Patrocinado</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <Avatar nombre={profesional.nombreComercial} fotoUrl={profesional.fotoPerfilUrl} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-neutral-900">{profesional.nombreComercial}</h3>
            <p className="flex items-center gap-1.5 text-sm text-neutral-500">
              <IconoCategoria
                iconoUrl={profesional.categoriaIconoUrl}
                nombre={profesional.categoriaNombre}
                className="h-4 w-4 shrink-0"
              />
              <span className="truncate">{profesional.categoriaNombre}</span>
              {profesional.oficios.length > 1 && (
                <span className="shrink-0 text-neutral-400">+{profesional.oficios.length - 1}</span>
              )}
            </p>
          </div>
        </div>

        <p className="line-clamp-2 min-h-[2.5rem] text-sm text-neutral-600">{profesional.descripcionBreve}</p>

        <div className="mt-auto flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-sm text-neutral-500">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            {profesional.localidad}
          </div>
          <Puntuacion
            puntuacion={profesional.puntuacionGlobal}
            trabajosValorados={profesional.trabajosValorados}
            tamano="sm"
          />
        </div>
      </div>
    </Link>
  )
}
