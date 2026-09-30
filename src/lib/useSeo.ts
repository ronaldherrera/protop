import { useEffect } from 'react'

const TITULO_POR_DEFECTO = 'Protop — Encuentra profesionales de confianza'
const DESCRIPCION_POR_DEFECTO =
  'Protop: directorio de profesionales de reformas y hogar con reputación verificada por factura. Sin comisiones para el profesional.'

/** Actualiza el <title> y la meta description mientras la página esté montada, y los restaura al salir. */
export function useSeo(titulo: string, descripcion: string) {
  useEffect(() => {
    document.title = titulo
    const meta = document.querySelector('meta[name="description"]')
    meta?.setAttribute('content', descripcion)

    return () => {
      document.title = TITULO_POR_DEFECTO
      meta?.setAttribute('content', DESCRIPCION_POR_DEFECTO)
    }
  }, [titulo, descripcion])
}
