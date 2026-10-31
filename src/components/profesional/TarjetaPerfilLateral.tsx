import { Globe, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { MedidorCompletitud } from '../ui/MedidorCompletitud'
import { Puntuacion } from '../ui/Puntuacion'
import { calcularCompletitudPorcentaje } from '../../features/directorio/completitud'
import { useEstadisticasFicha } from '../../features/directorio/visitas'
import type { Profesional } from '../../types/profesional'
import { ChipsOficios } from './ChipsOficios'

export function TarjetaPerfilLateral({ profesional, onEditar }: { profesional: Profesional; onEditar: () => void }) {
  const porcentajeCompletitud = calcularCompletitudPorcentaje({
    fotoPerfilUrl: profesional.fotoPerfilUrl,
    descripcion: profesional.descripcion,
    especialidades: profesional.especialidades,
    fotosTrabajos: profesional.fotosTrabajos,
    contacto: profesional.contacto,
  })
  const estadisticas = useEstadisticasFicha(profesional.slug).data

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-col items-center text-center">
        <Avatar
          nombre={profesional.nombreComercial}
          fotoUrl={profesional.fotoPerfilUrl}
          className="h-20 w-20 rounded-2xl object-cover text-2xl"
        />
        <h2 className="mt-3 text-lg font-bold text-neutral-900">{profesional.nombreComercial}</h2>
        <p className="text-sm text-neutral-500">{profesional.localidad}</p>
        <div className="mt-2">
          <Puntuacion
            puntuacion={profesional.puntuacionGlobal}
            trabajosValorados={profesional.trabajosValorados}
            tamano="sm"
            centrado
          />
        </div>
      </div>

      <ChipsOficios oficios={profesional.oficios} />

      {estadisticas && (
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-neutral-100 pt-3 text-center">
          <div>
            <p className="titular text-2xl font-extrabold text-neutral-900">{estadisticas.visitas}</p>
            <p className="text-xs text-neutral-500">visitas a tu ficha</p>
          </div>
          <div>
            <p className="titular text-2xl font-extrabold text-neutral-900">{estadisticas.contactos}</p>
            <p className="text-xs text-neutral-500">clics para contactarte</p>
          </div>
          <p className="col-span-2 text-xs text-neutral-400">Últimos 30 días</p>
        </div>
      )}

      {(profesional.contacto.telefono || profesional.contacto.email || profesional.contacto.web) && (
        <div className="mt-4 flex flex-col gap-1.5 border-t border-neutral-100 pt-3 text-sm">
          {profesional.contacto.telefono && (
            <span className="flex items-center gap-2 text-neutral-600">
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" /> {profesional.contacto.telefono}
            </span>
          )}
          {profesional.contacto.email && (
            <span className="flex items-center gap-2 text-neutral-600">
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" /> {profesional.contacto.email}
            </span>
          )}
          {profesional.contacto.web && (
            <span className="flex items-center gap-2 text-neutral-600">
              <Globe className="h-4 w-4 shrink-0" aria-hidden="true" /> {profesional.contacto.web}
            </span>
          )}
        </div>
      )}

      {porcentajeCompletitud < 100 && (
        <div className="mt-4 border-t border-neutral-100 pt-3">
          <MedidorCompletitud porcentaje={porcentajeCompletitud} />
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 border-t border-neutral-100 pt-3">
        <Button type="button" onClick={onEditar} className="w-full">
          Gestionar perfil profesional
        </Button>
        <Link
          to={`/profesionales/${profesional.slug}`}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
        >
          Ver mi perfil público →
        </Link>
      </div>
    </div>
  )
}
