// Genera HTML estático de las páginas públicas tras el build: el contenido y su <head> (título, descripción,
// Open Graph, canónica y JSON-LD) quedan en el HTML que recibe Google. En el navegador React vuelve a pintar
// la página encima, así que todo sigue funcionando como SPA.
// Escribe dist/<ruta>.html (y dist/inicio.html para la portada); el .htaccess las sirve antes que index.html.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { consultarTodo, leerEnv } from './supabase-publico.mjs'

const RAIZ = new URL('..', import.meta.url)
const ruta = (relativa) => fileURLToPath(new URL(relativa, RAIZ))

const { render, RUTAS_ESTATICAS, SITIO, OFICIOS_SEO, lugarIndexable } = await import(
  pathToFileURL(ruta('dist-servidor/entry-servidor.js')).href
)
const plantilla = readFileSync(ruta('dist/index.html'), 'utf8')

const escaparAtributo = (texto) =>
  texto.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escaparTexto = (texto) => texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function cambiarMeta(html, atributo, clave, valor) {
  const etiqueta = `<meta ${atributo}="${clave}" content="${escaparAtributo(valor)}" />`
  const existente = new RegExp(`<meta\\s+${atributo}="${clave}"\\s+content="[^"]*"\\s*/>`)
  return existente.test(html) ? html.replace(existente, etiqueta) : html.replace('</head>', `    ${etiqueta}\n  </head>`)
}

function cabecera(html, rutaPagina, seo) {
  const url = SITIO + (seo.canonica ?? rutaPagina)
  const imagen = new URL(seo.imagen ?? '/compartir.png', SITIO).href
  let resultado = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escaparTexto(seo.titulo)}</title>`)
  resultado = cambiarMeta(resultado, 'name', 'description', seo.descripcion)
  resultado = cambiarMeta(resultado, 'property', 'og:title', seo.titulo)
  resultado = cambiarMeta(resultado, 'property', 'og:description', seo.descripcion)
  resultado = cambiarMeta(resultado, 'property', 'og:url', url)
  resultado = cambiarMeta(resultado, 'property', 'og:image', imagen)
  if (rutaPagina.startsWith('/blog/')) resultado = cambiarMeta(resultado, 'property', 'og:type', 'article')
  if (seo.noIndex) resultado = cambiarMeta(resultado, 'name', 'robots', 'noindex')
  let extra = `    <link rel="canonical" href="${escaparAtributo(url)}" />\n`
  if (seo.jsonLd) {
    // Evita que un "</script>" dentro de los textos cierre la etiqueta antes de tiempo.
    const json = JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c')
    extra += `    <script type="application/ld+json" data-estatico>${json}</script>\n`
  }
  return resultado.replace('</head>', `${extra}  </head>`)
}

function escribir(rutaPagina, html, seo) {
  const pagina = cabecera(plantilla, rutaPagina, seo).replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  const archivo = ruta(`dist/${rutaPagina === '/' ? 'inicio' : rutaPagina.slice(1)}.html`)
  mkdirSync(dirname(archivo), { recursive: true })
  writeFileSync(archivo, pagina)
}

let generadas = 0
for (const rutaPagina of RUTAS_ESTATICAS) {
  const { html, seo } = await render(rutaPagina)
  if (!seo) throw new Error(`${rutaPagina}: la página no llamó a useSeo`)
  escribir(rutaPagina, html, seo)
  generadas++
}

// Páginas con datos de Supabase: el directorio, una por oficio (en España y en cada lugar que Google debe ver) y
// cada ficha real. Si Supabase falla en una, esa ruta se queda como SPA: nunca hace fallar el build.
const archivoIndice = ruta('dist/datos/oficios-por-lugar.json')
const indice = existsSync(archivoIndice) ? JSON.parse(readFileSync(archivoIndice, 'utf8')) : null
const conDatos = ['/profesionales', ...OFICIOS_SEO.map((oficio) => `/${oficio.url}`)]
for (const oficio of OFICIOS_SEO) {
  for (const lugar of Object.keys(indice?.oficios[oficio.categoria]?.lugares ?? {})) {
    if (lugarIndexable(indice, oficio.categoria, lugar)) conDatos.push(`/${oficio.url}/${lugar}`)
  }
}
try {
  const fichas = await consultarTodo(leerEnv(), 'profesionales', 'select=slug&es_demo=eq.false')
  conDatos.push(...fichas.map((ficha) => `/profesionales/${ficha.slug}`))
} catch (error) {
  console.warn(`prerender: sin la lista de fichas (${error.message}); se quedan como SPA.`)
}

const EN_PARALELO = 8
let fallidas = 0
for (let desde = 0; desde < conDatos.length; desde += EN_PARALELO) {
  await Promise.all(
    conDatos.slice(desde, desde + EN_PARALELO).map(async (rutaPagina) => {
      for (let intento = 1; intento <= 2; intento++) {
        try {
          const { html, seo } = await render(rutaPagina, { indice })
          if (!seo) throw new Error('la página no llamó a useSeo')
          escribir(rutaPagina, html, seo)
          generadas++
          return
        } catch (error) {
          if (intento === 2) {
            fallidas++
            console.warn(`prerender: ${rutaPagina} se queda como SPA (${error.message})`)
          }
        }
      }
    }),
  )
}
if (fallidas > 0) console.warn(`prerender: ${fallidas} páginas sin HTML estático`)

// El build de servidor solo hacía falta para esto; no se sube al hosting.
rmSync(ruta('dist-servidor'), { recursive: true, force: true })
console.log(`prerender: ${generadas} páginas en HTML estático`)
