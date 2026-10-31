// Antes del build: cuántas fichas hay de cada oficio en cada lugar (municipio y comunidad). Lo usan las páginas de
// oficio («Electricistas en Madrid») para enlazar lugares con resultados, y el prerender y el sitemap para saber qué
// páginas generar. Se publica en /datos/oficios-por-lugar.json. Si Supabase no responde, deja el índice vacío:
// nunca hace fallar el build.
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { consultarTodo, leerEnv } from './supabase-publico.mjs'

const DESTINO = fileURLToPath(new URL('../public/datos/oficios-por-lugar.json', import.meta.url))

async function calcular() {
  const fichas = await consultarTodo(
    leerEnv(),
    'profesionales',
    'select=id,profesional_categorias(categorias!profesional_categorias_categoria_id_fkey(slug)),' +
      'profesional_zonas(zonas(slug,nombre,tipo,comunidad_slug))&es_demo=eq.false',
  )
  const comunidades = await consultarTodo(leerEnv(), 'zonas', 'select=id,slug,nombre&tipo=eq.comunidad')
  // Nombre y comunidad de cada lugar que sale en el índice: la página no necesita cargar las 8.000 zonas.
  const zonas = Object.fromEntries(comunidades.map((c) => [c.slug, { nombre: c.nombre, comunidad: null }]))
  const oficios = {}
  for (const ficha of fichas) {
    const lugares = new Set()
    for (const { zonas: zona } of ficha.profesional_zonas) {
      if (!zona) continue
      lugares.add(zona.slug)
      zonas[zona.slug] ??= { nombre: zona.nombre, comunidad: zona.tipo === 'municipio' ? zona.comunidad_slug : null }
      if (zona.tipo === 'municipio' && zona.comunidad_slug) lugares.add(zona.comunidad_slug)
    }
    for (const { categorias: categoria } of ficha.profesional_categorias) {
      if (!categoria) continue
      const oficio = (oficios[categoria.slug] ??= { total: 0, lugares: {} })
      oficio.total++
      for (const lugar of lugares) oficio.lugares[lugar] = (oficio.lugares[lugar] ?? 0) + 1
    }
  }
  const municipios = new Set(
    fichas.flatMap((ficha) => ficha.profesional_zonas.map(({ zonas: zona }) => (zona?.tipo === 'municipio' ? zona.slug : null))),
  )
  municipios.delete(null)
  return {
    generado: new Date().toISOString().slice(0, 10),
    totalFichas: fichas.length,
    totalMunicipios: municipios.size,
    zonas,
    oficios,
  }
}

let indice
try {
  indice = await calcular()
} catch (error) {
  console.warn(`índice de oficios: sin datos de Supabase (${error.message}); se genera vacío.`)
  indice = { generado: new Date().toISOString().slice(0, 10), totalFichas: 0, totalMunicipios: 0, zonas: {}, oficios: {} }
}
mkdirSync(fileURLToPath(new URL('../public/datos/', import.meta.url)), { recursive: true })
writeFileSync(DESTINO, JSON.stringify(indice))
const paginas = Object.values(indice.oficios).reduce((suma, o) => suma + Object.keys(o.lugares).length, 0)
console.log(`índice de oficios: ${Object.keys(indice.oficios).length} oficios, ${paginas} páginas de lugar`)
