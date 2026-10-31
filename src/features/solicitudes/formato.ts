import type { EstadoSolicitud } from './types'

export function formatearImporte(valor: number): string {
  return valor.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  })
}

export function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const ETIQUETA_ESTADO_SOLICITUD: Record<
  EstadoSolicitud,
  { texto: string; tono: 'neutro' | 'aviso' | 'exito' | 'error' }
> = {
  borrador: { texto: 'Borrador', tono: 'neutro' },
  pendiente_pago: { texto: 'Pendiente de pago', tono: 'aviso' },
  abierta: { texto: 'Abierta', tono: 'exito' },
  cerrada: { texto: 'Cerrada', tono: 'neutro' },
}
