// Recuerda a dónde volver tras confirmar la cuenta desde el correo (p. ej. la ficha que se estaba reclamando).
// Las plantillas de correo llevan a /verificar y no conservan la ruta, así que se guarda en este navegador.
const CLAVE = 'protop-volver-tras-confirmar'

/** Solo rutas internas: nunca se redirige a otra web. */
function esRutaInterna(ruta: string): boolean {
  return ruta.startsWith('/') && !ruta.startsWith('//')
}

export function guardarDestinoPendiente(ruta: string | undefined) {
  if (!ruta || !esRutaInterna(ruta)) return
  try {
    localStorage.setItem(CLAVE, ruta)
  } catch {
    // Sin almacenamiento: al confirmar irá a su área, que también vale.
  }
}

export function tomarDestinoPendiente(): string | null {
  try {
    const ruta = localStorage.getItem(CLAVE)
    localStorage.removeItem(CLAVE)
    return ruta && esRutaInterna(ruta) ? ruta : null
  } catch {
    return null
  }
}
