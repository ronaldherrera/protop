import { Link } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { Puntuacion } from '../ui/Puntuacion'
import type { Propuesta } from '../../features/solicitudes/types'

function formatearImporte(valor: number): string {
  return valor.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function TarjetaPropuesta({ propuesta }: { propuesta: Propuesta }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <Link to={`/profesionales/${propuesta.profesionalSlug}`} className="font-medium text-brand-700 hover:underline">
            {propuesta.profesionalNombre}
          </Link>
          <div className="mt-0.5">
            <Puntuacion
              puntuacion={propuesta.profesionalPuntuacion}
              trabajosValorados={propuesta.profesionalTrabajosValorados}
              tamano="sm"
            />
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-neutral-900">{formatearImporte(propuesta.importeOrientativo)}</p>
          <Badge tono={propuesta.tipo === 'confirmada' ? 'exito' : 'neutro'}>
            {propuesta.tipo === 'confirmada' ? 'Presupuesto confirmado' : 'Estimación orientativa'}
          </Badge>
        </div>
      </div>

      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-neutral-700">Alcance</dt>
          <dd className="text-neutral-600">{propuesta.alcanceTrabajo}</dd>
        </div>
        <div>
          <dt className="font-medium text-neutral-700">Plazo aproximado</dt>
          <dd className="text-neutral-600">{propuesta.plazoAproximado}</dd>
        </div>
        {propuesta.materialesIncluidos && (
          <div>
            <dt className="font-medium text-neutral-700">Materiales incluidos</dt>
            <dd className="text-neutral-600">{propuesta.materialesIncluidos}</dd>
          </div>
        )}
        {propuesta.manoObra && (
          <div>
            <dt className="font-medium text-neutral-700">Mano de obra</dt>
            <dd className="text-neutral-600">{propuesta.manoObra}</dd>
          </div>
        )}
        <div>
          <dt className="font-medium text-neutral-700">Impuestos</dt>
          <dd className="text-neutral-600">{propuesta.tratamientoImpuestos}</dd>
        </div>
        {propuesta.exclusiones && (
          <div>
            <dt className="font-medium text-neutral-700">Exclusiones</dt>
            <dd className="text-neutral-600">{propuesta.exclusiones}</dd>
          </div>
        )}
        {propuesta.desglose && (
          <div className="sm:col-span-2">
            <dt className="font-medium text-neutral-700">Desglose</dt>
            <dd className="whitespace-pre-line text-neutral-600">{propuesta.desglose}</dd>
          </div>
        )}
        {propuesta.aspectosPendientes && (
          <div className="sm:col-span-2">
            <dt className="font-medium text-neutral-700">Aspectos pendientes de comprobar</dt>
            <dd className="text-neutral-600">{propuesta.aspectosPendientes}</dd>
          </div>
        )}
      </dl>

      <p className="mt-3 text-xs text-neutral-500">
        {propuesta.necesitaVisita && 'Requiere visita previa · '}
        Válida hasta {formatearFecha(propuesta.validaHasta)}
      </p>
    </div>
  )
}
