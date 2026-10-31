import { useEffect } from 'react'

const TITULO_POR_DEFECTO = 'Protop — Profesionales de reformas y reparaciones en toda España'
const DESCRIPCION_POR_DEFECTO =
  'Electricistas, fontaneros, pintores, carpinteros y más cerca de ti, en toda España: contacto directo y gratis, presupuestos y valoraciones con factura revisada.'
const IMAGEN_POR_DEFECTO = '/compartir.png'

type Opciones = {
  /** Datos estructurados schema.org que se insertan como JSON-LD mientras la página está montada. */
  jsonLd?: object
  /** Para páginas que no deben aparecer en Google (fichas de ejemplo, áreas privadas…). */
  noIndex?: boolean
  imagen?: string
  /** Ruta canónica (con los parámetros que definen la página); por defecto, la ruta sin parámetros. */
  canonica?: string
}

export type SeoCapturado = { titulo: string; descripcion: string } & Opciones

// Al generar el HTML estático no hay document ni se ejecutan efectos: useSeo deja aquí lo que pediría la página
// y scripts/prerender.mjs lo escribe en el <head>.
let capturado: SeoCapturado | null = null

function capturarSeo(valor: SeoCapturado) {
  capturado = valor
}

export function tomarSeoCapturado(): SeoCapturado | null {
  const valor = capturado
  capturado = null
  return valor
}

function fijarMeta(atributo: 'name' | 'property', clave: string, valor: string | null) {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[${atributo}="${clave}"]`)
  if (valor === null) {
    meta?.remove()
    return
  }
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(atributo, clave)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', valor)
}

/** Título, descripción, Open Graph, robots y JSON-LD de la página; se restauran al salir de ella. */
export function useSeo(titulo: string, descripcion: string, { jsonLd, noIndex = false, imagen, canonica }: Opciones = {}) {
  const jsonLdTexto = jsonLd ? JSON.stringify(jsonLd) : null
  if (typeof document === 'undefined') capturarSeo({ titulo, descripcion, jsonLd, noIndex, imagen, canonica })

  useEffect(() => {
    const url = window.location.origin + (canonica ?? window.location.pathname)
    const imagenAbsoluta = new URL(imagen ?? IMAGEN_POR_DEFECTO, window.location.origin).href

    document.title = titulo
    fijarMeta('name', 'description', descripcion)
    fijarMeta('property', 'og:title', titulo)
    fijarMeta('property', 'og:description', descripcion)
    fijarMeta('property', 'og:url', url)
    fijarMeta('property', 'og:image', imagenAbsoluta)
    fijarMeta('name', 'robots', noIndex ? 'noindex' : null)

    let enlaceCanonico = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!enlaceCanonico) {
      enlaceCanonico = document.createElement('link')
      enlaceCanonico.rel = 'canonical'
      document.head.appendChild(enlaceCanonico)
    }
    enlaceCanonico.href = url

    // El HTML estático de la página ya trae su JSON-LD: se sustituye por el de React para no duplicarlo.
    document.head.querySelectorAll('script[data-estatico]').forEach((estatico) => estatico.remove())
    let script: HTMLScriptElement | null = null
    if (jsonLdTexto) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = jsonLdTexto
      document.head.appendChild(script)
    }

    return () => {
      document.title = TITULO_POR_DEFECTO
      fijarMeta('name', 'description', DESCRIPCION_POR_DEFECTO)
      fijarMeta('property', 'og:title', TITULO_POR_DEFECTO)
      fijarMeta('property', 'og:description', DESCRIPCION_POR_DEFECTO)
      fijarMeta('property', 'og:image', new URL(IMAGEN_POR_DEFECTO, window.location.origin).href)
      fijarMeta('name', 'robots', null)
      script?.remove()
    }
  }, [titulo, descripcion, jsonLdTexto, noIndex, imagen, canonica])
}
