import { LoaderCircle, LocateFixed, Search, X } from 'lucide-react'
import { type KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react'
import { ErrorUbicacion, zonaDeMiUbicacion } from '../../features/directorio/ubicacion'
import type { Zona } from '../../types/profesional'
import { cn } from '../../lib/cn'

const LIMITE_RESULTADOS = 30
const COMUNIDAD_LANZAMIENTO = 'cantabria'

function esDeLaZonaDeLanzamiento(zona: Zona): boolean {
  return zona.slug === COMUNIDAD_LANZAMIENTO || zona.comunidadSlug === COMUNIDAD_LANZAMIENTO
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

function buscarZonas(zonas: Zona[], texto: string, excluirIds: Set<string>): Zona[] {
  const consulta = normalizar(texto.trim())
  if (!consulta) return []
  return zonas
    .filter((z) => !excluirIds.has(z.id) && normalizar(z.nombre).includes(consulta))
    .sort((a, b) => {
      const aEmpieza = normalizar(a.nombre).startsWith(consulta)
      const bEmpieza = normalizar(b.nombre).startsWith(consulta)
      if (aEmpieza !== bEmpieza) return aEmpieza ? -1 : 1
      // Protop arranca en Santander: los lugares de Cantabria van delante del resto de España.
      const aCerca = esDeLaZonaDeLanzamiento(a)
      const bCerca = esDeLaZonaDeLanzamiento(b)
      if (aCerca !== bCerca) return aCerca ? -1 : 1
      return a.nombre.localeCompare(b.nombre, 'es')
    })
    .slice(0, LIMITE_RESULTADOS)
}

function EtiquetaZona({ zona }: { zona: Zona }) {
  return (
    <>
      {zona.nombre}
      {zona.tipo === 'comunidad' && (
        <span className="ml-1.5 rounded-full bg-accent-100 px-1.5 py-0.5 text-xs font-medium text-accent-700">
          Comunidad autónoma
        </span>
      )}
    </>
  )
}

function ContextoZona({ zona, zonasPorSlug }: { zona: Zona; zonasPorSlug: Map<string, Zona> }) {
  if (zona.tipo !== 'municipio' || !zona.comunidadSlug) return null
  const comunidad = zonasPorSlug.get(zona.comunidadSlug)
  if (!comunidad) return null
  return <span className="text-neutral-400"> · {comunidad.nombre}</span>
}

function useZonasPorSlug(zonas: Zona[]) {
  return useMemo(() => new Map(zonas.map((z) => [z.slug, z])), [zonas])
}

function PanelResultados({
  id,
  resultados,
  zonasPorSlug,
  activo = -1,
  onSeleccionar,
}: {
  id?: string
  resultados: Zona[]
  zonasPorSlug: Map<string, Zona>
  activo?: number
  onSeleccionar: (zona: Zona) => void
}) {
  if (resultados.length === 0) {
    return (
      <div className="absolute z-20 mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-500 shadow-lg">
        Sin resultados
      </div>
    )
  }
  return (
    <ul
      id={id}
      role="listbox"
      className="absolute z-20 mt-1 max-h-72 w-full min-w-[16rem] overflow-y-auto rounded-xl border border-neutral-200 bg-white py-1 shadow-lg"
    >
      {resultados.map((zona, indice) => (
        <li
          key={zona.id}
          id={id ? `${id}-${indice}` : undefined}
          role="option"
          aria-selected={indice === activo}
          // mousedown y no click: así el input no pierde el foco antes de elegir.
          onMouseDown={(evento) => {
            evento.preventDefault()
            onSeleccionar(zona)
          }}
          className={cn(
            'flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm text-neutral-700 hover:bg-brand-50 hover:text-brand-800',
            indice === activo && 'bg-brand-50 text-brand-800',
          )}
        >
          <EtiquetaZona zona={zona} />
          <ContextoZona zona={zona} zonasPorSlug={zonasPorSlug} />
        </li>
      ))}
    </ul>
  )
}

type PropsUnica = {
  zonas: Zona[]
  valor: string
  onChange: (valor: string) => void
  campoValor?: 'slug' | 'id'
  placeholder?: string
  etiqueta?: string
}

/** Buscador de un único lugar (filtros de Home/Directorio, o la zona de una solicitud). */
export function BuscadorZonaUnica({
  zonas,
  valor,
  onChange,
  campoValor = 'slug',
  placeholder = 'Busca una comunidad o una ciudad…',
  etiqueta,
}: PropsUnica) {
  const [texto, setTexto] = useState('')
  const [abierto, setAbierto] = useState(false)
  const [activo, setActivo] = useState(-1)
  const contenedorRef = useRef<HTMLDivElement>(null)
  const idLista = useId()
  const zonasPorSlug = useZonasPorSlug(zonas)
  const zonasPorValor = useMemo(
    () => new Map(zonas.map((z) => [campoValor === 'id' ? z.id : z.slug, z])),
    [zonas, campoValor],
  )
  const zonaSeleccionada = valor ? zonasPorValor.get(valor) : undefined

  useEffect(() => {
    function alClicarFuera(evento: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target as Node)) setAbierto(false)
    }
    document.addEventListener('mousedown', alClicarFuera)
    return () => document.removeEventListener('mousedown', alClicarFuera)
  }, [])

  const resultados = useMemo(() => buscarZonas(zonas, texto, new Set()), [zonas, texto])
  const panelVisible = abierto && Boolean(texto.trim())

  const [localizando, setLocalizando] = useState(false)
  const [avisoUbicacion, setAvisoUbicacion] = useState('')

  async function usarMiUbicacion() {
    setLocalizando(true)
    setAvisoUbicacion('')
    try {
      const { zona, soloComunidad } = await zonaDeMiUbicacion(zonas)
      seleccionar(zona)
      if (soloComunidad) setAvisoUbicacion(`No hemos reconocido tu municipio: buscamos en ${zona.nombre}.`)
    } catch (error) {
      setAvisoUbicacion(
        error instanceof ErrorUbicacion ? error.message : 'No hemos podido saber tu localidad. Escríbela.',
      )
    } finally {
      setLocalizando(false)
    }
  }

  const aviso = avisoUbicacion && (
    <p className="mt-1.5 text-sm text-neutral-600" role="status">
      {avisoUbicacion}
    </p>
  )

  function seleccionar(zona: Zona) {
    onChange(campoValor === 'id' ? zona.id : zona.slug)
    setTexto('')
    setAbierto(false)
    setActivo(-1)
  }

  function alPulsarTecla(evento: KeyboardEvent<HTMLInputElement>) {
    if (evento.key === 'ArrowDown' && resultados.length > 0) {
      evento.preventDefault()
      setAbierto(true)
      setActivo((actual) => Math.min(actual + 1, resultados.length - 1))
    } else if (evento.key === 'ArrowUp' && resultados.length > 0) {
      evento.preventDefault()
      setActivo((actual) => Math.max(actual - 1, 0))
    } else if (evento.key === 'Enter' && panelVisible && resultados.length > 0) {
      evento.preventDefault()
      seleccionar(resultados[Math.max(activo, 0)])
    } else if (evento.key === 'Escape') {
      setAbierto(false)
      setActivo(-1)
    }
  }

  const campo = (
    <input
      type="text"
      role="combobox"
      aria-label={etiqueta}
      aria-expanded={panelVisible}
      aria-controls={idLista}
      aria-autocomplete="list"
      aria-activedescendant={panelVisible && activo >= 0 ? `${idLista}-${activo}` : undefined}
      autoComplete="off"
      value={texto}
      onChange={(e) => {
        setTexto(e.target.value)
        setAbierto(true)
        setActivo(-1)
      }}
      onFocus={() => setAbierto(true)}
      onKeyDown={alPulsarTecla}
      placeholder={placeholder}
      className="h-11 w-full rounded-[10px] border border-neutral-300 bg-white pl-9 pr-11 text-neutral-900 placeholder:text-neutral-400"
    />
  )

  const panel = panelVisible && (
    <PanelResultados id={idLista} resultados={resultados} zonasPorSlug={zonasPorSlug} activo={activo} onSeleccionar={seleccionar} />
  )

  if (zonaSeleccionada) {
    return (
      <div>
        <div className="flex min-h-11 items-center justify-between gap-2 rounded-[10px] border border-brand-600 bg-brand-50 px-3 py-2 text-sm text-brand-800">
          <span className="flex items-center">
            <EtiquetaZona zona={zonaSeleccionada} />
            <ContextoZona zona={zonaSeleccionada} zonasPorSlug={zonasPorSlug} />
          </span>
          <button
            type="button"
            onClick={() => {
              onChange('')
              setTexto('')
              setAvisoUbicacion('')
            }}
            aria-label={`Quitar ${zonaSeleccionada.nombre}`}
            className="shrink-0 rounded-full p-0.5 hover:bg-brand-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {aviso}
      </div>
    )
  }

  return (
    <div ref={contenedorRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        {campo}
        <button
          type="button"
          onClick={usarMiUbicacion}
          disabled={localizando || zonas.length === 0}
          title="Usar mi ubicación"
          aria-label="Usar mi ubicación"
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-brand-700 hover:bg-brand-50 disabled:text-neutral-300"
        >
          {localizando ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <LocateFixed className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {panel}
      {aviso}
    </div>
  )
}


type PropsMultiple = {
  zonas: Zona[]
  valores: string[]
  onChange: (ids: string[]) => void
  placeholder?: string
}

/** Buscador de varios lugares como chips (zonas de trabajo de un profesional). */
export function BuscadorZonasChips({ zonas, valores, onChange, placeholder = 'Busca una comunidad o una ciudad…' }: PropsMultiple) {
  const [texto, setTexto] = useState('')
  const [abierto, setAbierto] = useState(false)
  const contenedorRef = useRef<HTMLDivElement>(null)
  const zonasPorSlug = useZonasPorSlug(zonas)
  const zonasPorId = useMemo(() => new Map(zonas.map((z) => [z.id, z])), [zonas])
  const seleccionadas = useMemo(() => valores.map((id) => zonasPorId.get(id)).filter((z): z is Zona => Boolean(z)), [valores, zonasPorId])

  useEffect(() => {
    function alClicarFuera(evento: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target as Node)) setAbierto(false)
    }
    document.addEventListener('mousedown', alClicarFuera)
    return () => document.removeEventListener('mousedown', alClicarFuera)
  }, [])

  const idsSeleccionados = useMemo(() => new Set(valores), [valores])
  const resultados = useMemo(() => buscarZonas(zonas, texto, idsSeleccionados), [zonas, texto, idsSeleccionados])

  function anadir(zona: Zona) {
    onChange([...valores, zona.id])
    setTexto('')
    setAbierto(false)
  }

  function quitar(id: string) {
    onChange(valores.filter((v) => v !== id))
  }

  return (
    <div className="flex flex-col gap-2">
      {seleccionadas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {seleccionadas.map((zona) => (
            <span
              key={zona.id}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm',
                zona.tipo === 'comunidad' ? 'bg-accent-100 text-accent-800' : 'bg-brand-100 text-brand-700',
              )}
            >
              {zona.nombre}
              <button type="button" onClick={() => quitar(zona.id)} aria-label={`Quitar ${zona.nombre}`}>
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div ref={contenedorRef} className="relative">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value)
              setAbierto(true)
            }}
            onFocus={() => setAbierto(true)}
            placeholder={placeholder}
            className="h-11 w-full rounded-md border border-neutral-300 bg-white pl-9 pr-3 text-neutral-900"
          />
        </div>
        {abierto && texto.trim() && (
          <PanelResultados resultados={resultados} zonasPorSlug={zonasPorSlug} onSeleccionar={anadir} />
        )}
      </div>
    </div>
  )
}
