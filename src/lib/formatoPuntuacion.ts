export function formatearPuntuacion(valor: number): string {
  return valor.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

export function textoTrabajosValorados(trabajos: number): string {
  return `${trabajos} ${trabajos === 1 ? 'trabajo valorado' : 'trabajos valorados'} con factura`
}
