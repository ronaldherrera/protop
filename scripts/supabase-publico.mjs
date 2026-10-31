// Lectura de datos públicos de Supabase desde los scripts del build (con la clave publicable de .env.production).
import { readFileSync } from 'node:fs'

const RAIZ = new URL('..', import.meta.url)

export function leerEnv() {
  const texto = readFileSync(new URL('.env.production', RAIZ), 'utf8')
  return {
    ...Object.fromEntries(
      texto
        .split('\n')
        .filter((linea) => /^[A-Z_]+=/.test(linea))
        .map((linea) => [linea.slice(0, linea.indexOf('=')), linea.slice(linea.indexOf('=') + 1).trim()]),
    ),
    // Las variables del entorno (GitHub Actions) mandan sobre el archivo.
    ...Object.fromEntries(Object.entries(process.env).filter(([clave]) => clave.startsWith('VITE_'))),
  }
}

export async function consultar(env, tabla, filtro) {
  const respuesta = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/${tabla}?${filtro}`, {
    headers: { apikey: env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}` },
    signal: AbortSignal.timeout(20000),
  })
  if (!respuesta.ok) throw new Error(`${tabla}: ${respuesta.status}`)
  return respuesta.json()
}

// PostgREST devuelve como mucho 1000 filas por petición: se piden por páginas.
export async function consultarTodo(env, tabla, filtro) {
  const filas = []
  for (let desde = 0; ; desde += 1000) {
    const pagina = await consultar(env, tabla, `${filtro}&order=id&limit=1000&offset=${desde}`)
    filas.push(...pagina)
    if (pagina.length < 1000) return filas
  }
}
