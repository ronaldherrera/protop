import type { Zona } from '../../types/profesional'

// Comunidad autónoma de Nominatim (ISO 3166-2) -> comunidad_slug de la tabla zonas.
const COMUNIDAD_POR_ISO: Record<string, string> = {
  'ES-AN': 'andalucia',
  'ES-AR': 'aragon',
  'ES-AS': 'asturias',
  'ES-CN': 'canarias',
  'ES-CB': 'cantabria',
  'ES-CL': 'castilla-y-leon',
  'ES-CM': 'castilla-la-mancha',
  'ES-CT': 'cataluna',
  'ES-CE': 'ceuta',
  'ES-EX': 'extremadura',
  'ES-GA': 'galicia',
  'ES-IB': 'illes-balears',
  'ES-RI': 'la-rioja',
  'ES-MD': 'comunidad-de-madrid',
  'ES-ML': 'melilla',
  'ES-MC': 'region-de-murcia',
  'ES-NC': 'comunidad-foral-de-navarra',
  'ES-PV': 'pais-vasco',
  'ES-VC': 'comunitat-valenciana',
}

export type ResultadoUbicacion = {
  zona: Zona
  /** Solo se ha podido reconocer la comunidad, no el municipio. */
  soloComunidad: boolean
}

export class ErrorUbicacion extends Error {}

const plano = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

/** Formas en que se puede escribir un municipio: «Real de Gandia, el» es «El Real de Gandia»; «A/B» es A y B. */
function variantes(nombre: string): string[] {
  const formas = [nombre, ...nombre.split('/')]
  const articulo = nombre.match(/^(.*), (el|la|los|las|l'|o|a|os|as|es|sa|ses)$/i)
  if (articulo) formas.push(`${articulo[2]}${articulo[2].endsWith("'") ? '' : ' '}${articulo[1]}`)
  return formas.map(plano)
}

function posicionActual(): Promise<GeolocationPosition> {
  return new Promise((resolver, rechazar) => {
    if (!('geolocation' in navigator)) {
      rechazar(new ErrorUbicacion('Tu navegador no permite saber la ubicación. Escribe tu localidad.'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolver, (error) => {
      rechazar(
        new ErrorUbicacion(
          error.code === error.PERMISSION_DENIED
            ? 'No has dado permiso para usar tu ubicación. Escribe tu localidad.'
            : 'No hemos podido saber dónde estás. Escribe tu localidad.',
        ),
      )
    }, { enableHighAccuracy: false, timeout: 10_000, maximumAge: 10 * 60_000 })
  })
}

/**
 * Municipio de la ubicación del dispositivo. Las coordenadas, redondeadas a unos 100 m, se envían solo a Nominatim
 * (OpenStreetMap) para saber el municipio; Protop no las guarda.
 */
export async function zonaDeMiUbicacion(zonas: Zona[]): Promise<ResultadoUbicacion> {
  const { coords } = await posicionActual()
  const parametros = new URLSearchParams({
    format: 'jsonv2',
    zoom: '10',
    addressdetails: '1',
    'accept-language': 'es',
    lat: coords.latitude.toFixed(3),
    lon: coords.longitude.toFixed(3),
  })
  let direccion: Record<string, string>
  try {
    const respuesta = await fetch(`https://nominatim.openstreetmap.org/reverse?${parametros}`)
    if (!respuesta.ok) throw new Error(String(respuesta.status))
    direccion = ((await respuesta.json()) as { address?: Record<string, string> }).address ?? {}
  } catch {
    throw new ErrorUbicacion('No hemos podido saber tu localidad ahora mismo. Escríbela.')
  }

  const comunidadSlug = COMUNIDAD_POR_ISO[direccion['ISO3166-2-lvl4'] ?? '']
  if (!comunidadSlug) throw new ErrorUbicacion('Protop solo tiene profesionales en España. Escribe tu localidad.')

  const nombres = [direccion.municipality, direccion.city, direccion.town, direccion.village]
    .filter((nombre): nombre is string => Boolean(nombre))
    .map(plano)
  const municipio = zonas.find(
    (zona) => zona.tipo === 'municipio' && zona.comunidadSlug === comunidadSlug && variantes(zona.nombre).some((v) => nombres.includes(v)),
  )
  if (municipio) return { zona: municipio, soloComunidad: false }

  const comunidad = zonas.find((zona) => zona.tipo === 'comunidad' && zona.slug === comunidadSlug)
  if (comunidad) return { zona: comunidad, soloComunidad: true }
  throw new ErrorUbicacion('No hemos reconocido tu localidad. Escríbela.')
}
