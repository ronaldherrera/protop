// Entrada del build de servidor (vite build --ssr): pinta cada página pública a HTML para que Google lea el
// contenido sin ejecutar JavaScript. La usa scripts/prerender.mjs; en el navegador se sigue usando main.tsx.
// Nunca se carga en el navegador, así que la regla de fast refresh no aplica.
// oxlint-disable react/only-export-components
import { type InfiniteData, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom'
import { rutas } from './app/rutas'
import { AuthProvider } from './features/auth/AuthProvider'
import { POSTS } from './features/blog/posts'
import {
  type BusquedaDirectorio,
  buscarProfesionales,
  obtenerCategorias,
  obtenerFamilias,
  obtenerProfesionalPorSlug,
  type PaginaDirectorio,
} from './features/directorio/api'
import { CLAVE_INDICE, type IndiceOficios } from './features/seo/indice'
import { OFICIOS_SEO, oficioSeoDeUrl } from './features/seo/oficios'
import { tomarSeoCapturado } from './lib/useSeo'

export { SITIO } from './features/blog/seo'
export { lugarIndexable } from './features/seo/indice'
export { OFICIOS_SEO }

/** Rutas sin datos de Supabase que siempre se generan como HTML estático. */
export const RUTAS_ESTATICAS = [
  '/',
  '/blog',
  ...POSTS.map((post) => `/blog/${post.slug}`),
  '/para-profesionales',
  '/solicitar-presupuesto',
  '/legal/aviso-legal',
  '/legal/privacidad',
  '/legal/cookies',
]

const handler = createStaticHandler(rutas)

// Datos que comparten todas las páginas (pie, selectores): se piden una sola vez por build.
let comunes: Promise<[Awaited<ReturnType<typeof obtenerCategorias>>, Awaited<ReturnType<typeof obtenerFamilias>>]> | null = null

async function sembrarBusqueda(queryClient: QueryClient, busqueda: BusquedaDirectorio) {
  const pagina = await buscarProfesionales(busqueda, 0)
  queryClient.setQueryData<InfiniteData<PaginaDirectorio, number>>(['profesionales', busqueda], {
    pages: [pagina],
    pageParams: [0],
  })
}

/**
 * Deja en la caché de React Query lo que la página pintaría tras cargar: así el HTML estático lleva la lista de
 * profesionales o la ficha, no un «Cargando…». En el navegador la página vuelve a pedir sus datos.
 */
async function prepararDatos(queryClient: QueryClient, ruta: string, indice: IndiceOficios | null) {
  comunes ??= Promise.all([obtenerCategorias(), obtenerFamilias()])
  const [categorias, familias] = await comunes
  queryClient.setQueryData(['categorias'], categorias)
  queryClient.setQueryData(['familias'], familias)
  if (indice) queryClient.setQueryData(CLAVE_INDICE, indice)

  const [, primero, segundo] = ruta.split('/')
  if (primero === 'profesionales' && segundo) {
    const profesional = await obtenerProfesionalPorSlug(segundo)
    queryClient.setQueryData(['profesional', segundo], profesional)
    if (profesional) {
      await sembrarBusqueda(queryClient, {
        categorias: [profesional.oficioPrincipal],
        zona: profesional.zonasTrabajo[0] ?? '',
        texto: '',
      })
    }
    return
  }
  if (primero === 'profesionales') {
    await sembrarBusqueda(queryClient, { categorias: [], zona: '', texto: '' })
    return
  }
  const oficio = oficioSeoDeUrl(primero)
  if (oficio) await sembrarBusqueda(queryClient, { categorias: [oficio.categoria], zona: segundo ?? '', texto: '' })
}

export async function render(ruta: string, { indice = null }: { indice?: IndiceOficios | null } = {}) {
  const contexto = await handler.query(new Request(`https://protop.es${ruta}`))
  if (contexto instanceof Response) throw new Error(`${ruta}: el router devolvió una redirección`)

  const router = createStaticRouter(handler.dataRoutes, contexto)
  const queryClient = new QueryClient()
  await prepararDatos(queryClient, ruta, indice)
  tomarSeoCapturado()
  const html = renderToString(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StaticRouterProvider router={router} context={contexto} hydrate={false} />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
  return { html, seo: tomarSeoCapturado() }
}
