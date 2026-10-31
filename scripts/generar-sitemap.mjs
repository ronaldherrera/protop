// Genera dist/sitemap.xml tras el build: páginas fijas, guías, páginas de oficio y fichas reales.
// Si Supabase no responde, escribe el sitemap sin las fichas: nunca hace fallar el build.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { consultarTodo, leerEnv } from './supabase-publico.mjs'

const RAIZ = new URL('..', import.meta.url)
const SITIO = 'https://protop.es'

function leerEnvSeguro() {
  try {
    return leerEnv()
  } catch {
    return {}
  }
}

/** Slug y fecha de la última modificación de cada guía (fechaActualizacion si existe, si no fechaPublicacion). */
function guias() {
  const posts = readFileSync(new URL('src/features/blog/posts.ts', RAIZ), 'utf8')
  const bloques = posts.split(/\n\s*slug: '/).slice(1)
  return bloques.map((bloque) => {
    const slug = bloque.slice(0, bloque.indexOf("'"))
    const fecha = (bloque.match(/fechaActualizacion: '([^']+)'/) ?? bloque.match(/fechaPublicacion: '([^']+)'/))?.[1]
    return { slug, fecha }
  })
}

// Páginas de oficio: las mismas que genera el prerender (en toda España y en cada lugar que se ofrece a Google).
// Los oficios y el mínimo de fichas se leen del código fuente para no repetirlos aquí.
function paginasDeOficio() {
  const archivoIndice = fileURLToPath(new URL('dist/datos/oficios-por-lugar.json', RAIZ))
  if (!existsSync(archivoIndice)) return []
  const indice = JSON.parse(readFileSync(archivoIndice, 'utf8'))
  const fuente = readFileSync(new URL('src/features/seo/oficios.ts', RAIZ), 'utf8')
  const oficios = [...fuente.matchAll(/categoria: '([^']+)',\s*url: '([^']+)'/g)].map(([, categoria, url]) => ({ categoria, url }))
  const minimo = Number(
    readFileSync(new URL('src/features/seo/indice.ts', RAIZ), 'utf8').match(/MINIMO_FICHAS_PARA_INDEXAR = (\d+)/)[1],
  )
  return oficios.flatMap(({ categoria, url }) => [
    { ruta: `/${url}`, prioridad: '0.8' },
    ...Object.entries(indice.oficios[categoria]?.lugares ?? {})
      .filter(([lugar, fichas]) => (indice.zonas[lugar]?.comunidad === null ? fichas > 0 : fichas >= minimo))
      .map(([lugar]) => ({ ruta: `/${url}/${lugar}`, prioridad: '0.7' })),
  ])
}

const urls = [
  { ruta: '/', prioridad: '1.0' },
  { ruta: '/profesionales', prioridad: '0.9' },
  { ruta: '/solicitar-presupuesto', prioridad: '0.8' },
  { ruta: '/para-profesionales', prioridad: '0.8' },
  { ruta: '/blog', prioridad: '0.6' },
  { ruta: '/legal/aviso-legal', prioridad: '0.2' },
  { ruta: '/legal/privacidad', prioridad: '0.2' },
  { ruta: '/legal/cookies', prioridad: '0.2' },
  ...guias().map(({ slug, fecha }) => ({ ruta: `/blog/${slug}`, prioridad: '0.7', modificada: fecha })),
  ...paginasDeOficio(),
]

try {
  const profesionales = await consultarTodo(leerEnv(), 'profesionales', 'select=slug&es_demo=eq.false')
  urls.push(...profesionales.map((p) => ({ ruta: `/profesionales/${p.slug}`, prioridad: '0.6' })))
} catch (error) {
  console.warn(`sitemap: sin datos de Supabase (${error.message}); sin las fichas.`)
}

const escapar = (texto) => texto.replace(/&/g, '&amp;')
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${escapar(SITIO + u.ruta)}</loc>${u.modificada ? `<lastmod>${u.modificada}</lastmod>` : ''}<priority>${u.prioridad}</priority></url>`).join('\n')}
</urlset>
`
writeFileSync(fileURLToPath(new URL('dist/sitemap.xml', RAIZ)), xml)

// ads.txt: solo cuando AdSense está configurado (variable de entorno del build o .env.production).
const clienteAdsense = process.env.VITE_ADSENSE_CLIENT || leerEnvSeguro().VITE_ADSENSE_CLIENT
if (clienteAdsense?.startsWith('ca-pub-')) {
  const editor = clienteAdsense.replace('ca-', '')
  writeFileSync(fileURLToPath(new URL('dist/ads.txt', RAIZ)), `google.com, ${editor}, DIRECT, f08c47fec0942fa0
`)
  console.log('ads.txt generado')
}
console.log(`sitemap: ${urls.length} URL`)
