import { Briefcase, ChevronRight, FileText, Globe, ImagePlus, Mail, MapPin, Pencil, Phone, Plus, User, X } from 'lucide-react'
import { type FormEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BuscadorZonaUnica, BuscadorZonasChips } from '../components/directorio/BuscadorZonas'
import { IconoCategoria } from '../components/directorio/IconoCategoria'
import { SelectorCategoria } from '../components/directorio/SelectorCategoria'
import { SelectorChipsCategoria } from '../components/directorio/SelectorChipsCategoria'
import { EmptyState } from '../components/estado/EmptyState'
import { ErrorState } from '../components/estado/ErrorState'
import { LoadingState } from '../components/estado/LoadingState'
import { SelectorModo } from '../components/layout/SelectorModo'
import { GestionTrabajos } from '../components/trabajos/GestionTrabajos'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { MedidorCompletitud } from '../components/ui/MedidorCompletitud'
import { Modal } from '../components/ui/Modal'
import { Puntuacion } from '../components/ui/Puntuacion'
import { Stepper } from '../components/ui/Stepper'
import { calcularCompletitudPorcentaje } from '../features/directorio/completitud'
import { coincideZona } from '../features/directorio/filtrado'
import { cerrarSesion } from '../features/auth/api'
import { usePerfil } from '../features/auth/queries'
import { useAuth } from '../features/auth/useAuth'
import { cn } from '../lib/cn'
import {
  useCategorias,
  useFamilias,
  useGuardarMiProfesional,
  useMiProfesional,
  useZonas,
} from '../features/directorio/queries'
import { solicitudEncajaConProfesional } from '../features/solicitudes/coincidencia'
import { useMisPropuestas, useSolicitudesDisponibles } from '../features/solicitudes/queries'
import type { EstadoSolicitud, Solicitud } from '../features/solicitudes/types'
import { subirFoto } from '../lib/storage'
import type { Categoria, Especialidad, Familia, MediosContacto, Profesional, Zona } from '../types/profesional'

type Seccion = 'solicitudes' | 'propuestas' | 'trabajos'

export function AreaProfesional() {
  const { user } = useAuth()
  const perfil = usePerfil()
  const miProfesional = useMiProfesional()
  const familias = useFamilias()
  const categorias = useCategorias()
  const zonas = useZonas()
  const navigate = useNavigate()
  const [editando, setEditando] = useState(false)
  const [seccion, setSeccion] = useState<Seccion>('solicitudes')

  async function salir() {
    await cerrarSesion()
    navigate('/')
  }

  if (miProfesional.isLoading || familias.isLoading || categorias.isLoading || zonas.isLoading) {
    return <LoadingState etiqueta="Cargando tu ficha…" />
  }

  if (miProfesional.isError || familias.isError || categorias.isError || zonas.isError || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <ErrorState descripcion="No hemos podido cargar tu área profesional. Inténtalo de nuevo en unos segundos." />
      </div>
    )
  }

  const tieneFicha = Boolean(miProfesional.data)

  if (!tieneFicha) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-neutral-900">Tu perfil de profesional</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Rellena estos datos para aparecer en el directorio de Protop. Gratis, sin comisión por el trabajo.
        </p>
        <FormularioFicha
          key="nueva"
          userId={user.id}
          familias={familias.data ?? []}
          categorias={categorias.data ?? []}
          zonas={zonas.data ?? []}
          profesional={null}
        />
      </div>
    )
  }

  const profesional = miProfesional.data as Profesional

  if (editando) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-neutral-900">Gestionar perfil profesional</h1>
        <p className="mt-1 text-sm text-neutral-600">Edita los datos que ven los particulares en el directorio.</p>

        <button
          type="button"
          onClick={() => setEditando(false)}
          className="mt-4 text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          ← Volver a mi perfil
        </button>

        <GestionarPerfil
          userId={user.id}
          familias={familias.data ?? []}
          categorias={categorias.data ?? []}
          zonas={zonas.data ?? []}
          profesional={profesional}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
          <SelectorModo />

          <TarjetaPerfilLateral profesional={profesional} onEditar={() => setEditando(true)} />

          <nav className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-2">
            {perfil.data?.esAdmin && (
              <Link
                to="/admin"
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-50"
              >
                Administración
              </Link>
            )}
            <button
              type="button"
              onClick={salir}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-50"
            >
              Cerrar sesión
            </button>
          </nav>
        </aside>

        <div>
          <div className="flex gap-1 overflow-x-auto border-b border-neutral-200">
            {(['solicitudes', 'propuestas', 'trabajos'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeccion(s)}
                className={cn(
                  '-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium',
                  seccion === s
                    ? 'border-brand-600 text-brand-700'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700',
                )}
              >
                {s === 'solicitudes' && 'Solicitudes de presupuesto'}
                {s === 'propuestas' && 'Mis propuestas'}
                {s === 'trabajos' && 'Mis trabajos'}
              </button>
            ))}
          </div>

          {seccion === 'solicitudes' && (
            <div className="mt-6">
              <SolicitudesDisponibles
                familias={familias.data ?? []}
                categorias={categorias.data ?? []}
                zonas={zonas.data ?? []}
                categoriaIdsProfesional={profesional.oficios.map((o) => o.id)}
                zonaSlugsProfesional={profesional.zonasTrabajo}
              />
            </div>
          )}

          {seccion === 'propuestas' && (
            <div className="mt-6">
              <MisPropuestas profesionalId={profesional.id} />
            </div>
          )}

          {seccion === 'trabajos' && (
            <div className="mt-6">
              <p className="text-sm text-neutral-600">
                Muestra trabajos reales en tu perfil. Puedes vincular al cliente para que, si quiere, deje un
                comentario — es opcional y no afecta a tu puntuación oficial.
              </p>
              <div className="mt-3">
                <GestionTrabajos profesionalId={profesional.id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ChipsOficios({ oficios }: { oficios: Profesional['oficios'] }) {
  const contenedorRef = useRef<HTMLDivElement>(null)
  const [alturaVisible, setAlturaVisible] = useState<number>()
  const [verTodos, setVerTodos] = useState(false)

  useLayoutEffect(() => {
    const contenedor = contenedorRef.current
    if (!contenedor) return

    function medir() {
      const hijos = Array.from(contenedor!.children) as HTMLElement[]
      if (hijos.length === 0) return
      const contenedorTop = contenedor!.getBoundingClientRect().top
      const filasVistas: number[] = []
      for (const hijo of hijos) {
        const top = Math.round(hijo.getBoundingClientRect().top - contenedorTop)
        if (!filasVistas.includes(top)) filasVistas.push(top)
        if (filasVistas.length > 2) {
          setAlturaVisible(top)
          return
        }
      }
      setAlturaVisible(undefined)
    }

    medir()
    const observer = new ResizeObserver(medir)
    observer.observe(contenedor)
    return () => observer.disconnect()
  }, [oficios])

  if (oficios.length === 0) return null

  const hayOcultos = alturaVisible !== undefined

  return (
    <>
      <div
        ref={contenedorRef}
        className="mt-4 flex flex-wrap gap-1.5 overflow-hidden"
        style={{ maxHeight: alturaVisible }}
      >
        {oficios.map((oficio) => (
          <span
            key={oficio.id}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
          >
            <IconoCategoria iconoUrl={oficio.iconoUrl} nombre={oficio.nombre} className="h-3.5 w-3.5" />
            {oficio.nombre}
          </span>
        ))}
      </div>

      {hayOcultos && (
        <button
          type="button"
          onClick={() => setVerTodos(true)}
          className="mt-1.5 text-xs font-medium text-brand-700 hover:underline"
        >
          Ver todos los oficios ({oficios.length})
        </button>
      )}

      {verTodos && (
        <Modal titulo="Tus oficios" onCerrar={() => setVerTodos(false)}>
          <ul className="flex flex-col gap-2">
            {oficios.map((oficio) => (
              <li
                key={oficio.id}
                className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700"
              >
                <IconoCategoria iconoUrl={oficio.iconoUrl} nombre={oficio.nombre} className="h-4 w-4" />
                {oficio.nombre}
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </>
  )
}

function TarjetaPerfilLateral({ profesional, onEditar }: { profesional: Profesional; onEditar: () => void }) {
  const porcentajeCompletitud = calcularCompletitudPorcentaje({
    fotoPerfilUrl: profesional.fotoPerfilUrl,
    descripcion: profesional.descripcion,
    especialidades: profesional.especialidades,
    fotosTrabajos: profesional.fotosTrabajos,
    contacto: profesional.contacto,
  })

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-col items-center text-center">
        <Avatar
          nombre={profesional.nombreComercial}
          fotoUrl={profesional.fotoPerfilUrl}
          className="h-20 w-20 rounded-2xl object-cover text-2xl"
        />
        <h2 className="mt-3 text-lg font-bold text-neutral-900">{profesional.nombreComercial}</h2>
        <p className="text-sm text-neutral-500">{profesional.localidad}</p>
        <div className="mt-2">
          <Puntuacion puntuacion={profesional.puntuacionGlobal} trabajosValorados={profesional.trabajosValorados} tamano="sm" centrado />
        </div>
      </div>

      <ChipsOficios oficios={profesional.oficios} />

      {(profesional.contacto.telefono || profesional.contacto.email || profesional.contacto.web) && (
        <div className="mt-4 flex flex-col gap-1.5 border-t border-neutral-100 pt-3 text-sm">
          {profesional.contacto.telefono && (
            <span className="flex items-center gap-2 text-neutral-600">
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" /> {profesional.contacto.telefono}
            </span>
          )}
          {profesional.contacto.email && (
            <span className="flex items-center gap-2 text-neutral-600">
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" /> {profesional.contacto.email}
            </span>
          )}
          {profesional.contacto.web && (
            <span className="flex items-center gap-2 text-neutral-600">
              <Globe className="h-4 w-4 shrink-0" aria-hidden="true" /> {profesional.contacto.web}
            </span>
          )}
        </div>
      )}

      {porcentajeCompletitud < 100 && (
        <div className="mt-4 border-t border-neutral-100 pt-3">
          <MedidorCompletitud porcentaje={porcentajeCompletitud} />
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 border-t border-neutral-100 pt-3">
        <Button type="button" onClick={onEditar} className="w-full">
          Gestionar perfil profesional
        </Button>
        <Link
          to={`/profesionales/${profesional.slug}`}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
        >
          Ver mi perfil público →
        </Link>
      </div>
    </div>
  )
}

function SolicitudesDisponibles({
  familias,
  categorias,
  zonas,
  categoriaIdsProfesional,
  zonaSlugsProfesional,
}: {
  familias: Familia[]
  categorias: Categoria[]
  zonas: Zona[]
  categoriaIdsProfesional: string[]
  zonaSlugsProfesional: string[]
}) {
  const solicitudes = useSolicitudesDisponibles()
  const [soloParaTi, setSoloParaTi] = useState(true)
  const [categoria, setCategoria] = useState('')
  const [zona, setZona] = useState('')
  const [texto, setTexto] = useState('')

  const zonasPorSlug = useMemo(() => new Map(zonas.map((z) => [z.slug, z])), [zonas])

  const resultados = useMemo(() => {
    const busqueda = texto.trim().toLowerCase()
    return (solicitudes.data ?? []).filter((s: Solicitud) => {
      if (soloParaTi && !solicitudEncajaConProfesional(s, categoriaIdsProfesional, zonaSlugsProfesional, zonas)) {
        return false
      }
      if (categoria && s.categoriaSlug !== categoria) return false
      if (zona && !coincideZona(zona, [s.zonaSlug], zonasPorSlug)) return false
      if (busqueda && !s.titulo.toLowerCase().includes(busqueda) && !s.descripcion.toLowerCase().includes(busqueda)) {
        return false
      }
      return true
    })
  }, [solicitudes.data, soloParaTi, categoriaIdsProfesional, zonaSlugsProfesional, zonas, zonasPorSlug, categoria, zona, texto])

  const hayFiltrosLibres = Boolean(categoria || zona || texto)

  if (solicitudes.isLoading) {
    return <LoadingState etiqueta="Cargando solicitudes…" />
  }

  if (solicitudes.isError) {
    return <ErrorState descripcion="No hemos podido cargar las solicitudes disponibles." />
  }

  return (
    <div>
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSoloParaTi((v) => !v)}
            aria-pressed={soloParaTi}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm font-medium',
              soloParaTi ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-neutral-300 text-neutral-600',
            )}
          >
            Para ti
          </button>
          <span className="text-xs text-neutral-500">
            {soloParaTi ? 'Solo tu oficio y tu zona' : 'Explorando todas las solicitudes abiertas'}
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <SelectorCategoria
            familias={familias}
            categorias={categorias}
            value={categoria}
            onChange={setCategoria}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 sm:w-48"
          />
          <BuscadorZonaUnica zonas={zonas} valor={zona} onChange={setZona} placeholder="Cualquier localidad" />
          <input
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar por título o descripción…"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-neutral-500">
        {resultados.length} {resultados.length === 1 ? 'solicitud encontrada' : 'solicitudes encontradas'}
      </p>

      {resultados.length === 0 ? (
        <div className="mt-3">
          <EmptyState
            titulo={
              soloParaTi || hayFiltrosLibres
                ? 'Ninguna solicitud coincide ahora mismo'
                : 'No hay solicitudes abiertas ahora mismo'
            }
            descripcion={soloParaTi ? 'Prueba a quitar "Para ti" para ver todas las solicitudes abiertas.' : undefined}
          />
        </div>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {resultados.map((s) => (
            <li key={s.id}>
              <Link
                to={`/solicitudes/${s.id}`}
                className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50">
                  <IconoCategoria iconoUrl={s.categoriaIconoUrl} nombre={s.categoriaNombre} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-900">{s.titulo}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
                    <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-700">
                      {s.categoriaNombre}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {s.zonaNombre}
                    </span>
                    <span>· {formatearFecha(s.creadoEn)}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function formatearImporte(valor: number): string {
  return valor.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

const ETIQUETA_ESTADO_SOLICITUD: Record<EstadoSolicitud, { texto: string; tono: 'neutro' | 'aviso' | 'exito' | 'error' }> = {
  borrador: { texto: 'Borrador', tono: 'neutro' },
  pendiente_pago: { texto: 'Pendiente de pago', tono: 'aviso' },
  abierta: { texto: 'Abierta', tono: 'exito' },
  cerrada: { texto: 'Cerrada', tono: 'neutro' },
}

function MisPropuestas({ profesionalId }: { profesionalId: string }) {
  const propuestas = useMisPropuestas(profesionalId)

  if (propuestas.isLoading) {
    return <LoadingState etiqueta="Cargando tus propuestas…" />
  }

  if (propuestas.isError) {
    return <ErrorState descripcion="No hemos podido cargar tus propuestas enviadas." />
  }

  if (!propuestas.data || propuestas.data.length === 0) {
    return (
      <div className="mt-3">
        <EmptyState
          titulo="Todavía no has enviado ninguna propuesta"
          descripcion="Cuando respondas a una solicitud de presupuesto, aparecerá aquí para que puedas hacerle seguimiento."
        />
      </div>
    )
  }

  const hoy = new Date().toISOString().slice(0, 10)

  return (
    <ul className="flex flex-col gap-2">
      {propuestas.data.map((p) => {
        const estado = ETIQUETA_ESTADO_SOLICITUD[p.solicitudEstado]
        const caducada = p.solicitudEstado === 'abierta' && p.validaHasta < hoy
        return (
          <li key={p.id}>
            <Link
              to={`/solicitudes/${p.solicitudId}`}
              className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-neutral-900">{p.solicitudTitulo}</p>
                <p className="text-xs text-neutral-500">
                  {p.solicitudCategoriaNombre} · {p.solicitudZonaNombre} · enviada el {formatearFecha(p.creadoEn)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900">{formatearImporte(p.importeOrientativo)}</span>
                {caducada && <Badge tono="aviso">Caducada</Badge>}
                <Badge tono={estado.tono}>{estado.texto}</Badge>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

type Props = {
  userId: string
  familias: Familia[]
  categorias: Categoria[]
  zonas: Zona[]
  profesional: ReturnType<typeof useMiProfesional>['data'] | null
}

const TOTAL_PASOS = 3
const TITULOS_PASO = ['Lo esencial', 'Cuéntanos más', 'Fotos']

type BorradorFicha = {
  paso: number
  nombreComercial: string
  categoriaIds: string[]
  zonaIds: string[]
  especialidades: Especialidad[]
  localidad: string
  descripcionBreve: string
  descripcion: string
  contacto: MediosContacto
  fotoPerfilUrl: string | null
  fotosTrabajos: string[]
}

function claveBorrador(userId: string): string {
  return `protop-ficha-borrador-${userId}`
}

function leerBorrador(userId: string): BorradorFicha | null {
  try {
    const guardado = localStorage.getItem(claveBorrador(userId))
    return guardado ? (JSON.parse(guardado) as BorradorFicha) : null
  } catch {
    return null
  }
}

function guardarBorrador(userId: string, borrador: BorradorFicha) {
  try {
    localStorage.setItem(claveBorrador(userId), JSON.stringify(borrador))
  } catch {
    // localStorage puede no estar disponible (ventana privada, etc.); no es crítico.
  }
}

function borrarBorrador(userId: string) {
  try {
    localStorage.removeItem(claveBorrador(userId))
  } catch {
    // ver arriba
  }
}

function FormularioFicha({ userId, familias, categorias, zonas, profesional }: Props) {
  const guardar = useGuardarMiProfesional()
  const borrador = useState(() => leerBorrador(userId))[0]

  const [paso, setPaso] = useState(borrador?.paso ?? 1)
  const [nombreComercial, setNombreComercial] = useState(borrador?.nombreComercial ?? profesional?.nombreComercial ?? '')
  const [categoriaIds, setCategoriaIds] = useState<string[]>(
    () => borrador?.categoriaIds ?? profesional?.oficios.map((o) => o.id) ?? [],
  )
  const [zonaIds, setZonaIds] = useState<string[]>(
    () => borrador?.zonaIds ?? zonas.filter((z) => profesional?.zonasTrabajo.includes(z.slug)).map((z) => z.id),
  )
  const [especialidades, setEspecialidades] = useState<Especialidad[]>(
    borrador?.especialidades ?? profesional?.especialidades ?? [],
  )
  const [especialidadNueva, setEspecialidadNueva] = useState('')
  const [localidad, setLocalidad] = useState(borrador?.localidad ?? profesional?.localidad ?? '')
  const [descripcionBreve, setDescripcionBreve] = useState(borrador?.descripcionBreve ?? profesional?.descripcionBreve ?? '')
  const [descripcion, setDescripcion] = useState(borrador?.descripcion ?? profesional?.descripcion ?? '')
  const [contacto, setContacto] = useState<MediosContacto>(borrador?.contacto ?? profesional?.contacto ?? {})
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState<string | null>(
    borrador?.fotoPerfilUrl ?? profesional?.fotoPerfilUrl ?? null,
  )
  const [fotosTrabajos, setFotosTrabajos] = useState<string[]>(borrador?.fotosTrabajos ?? profesional?.fotosTrabajos ?? [])
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guardadoOk, setGuardadoOk] = useState(false)

  useEffect(() => {
    guardarBorrador(userId, {
      paso,
      nombreComercial,
      categoriaIds,
      zonaIds,
      especialidades,
      localidad,
      descripcionBreve,
      descripcion,
      contacto,
      fotoPerfilUrl,
      fotosTrabajos,
    })
  }, [
    userId,
    paso,
    nombreComercial,
    categoriaIds,
    zonaIds,
    especialidades,
    localidad,
    descripcionBreve,
    descripcion,
    contacto,
    fotoPerfilUrl,
    fotosTrabajos,
  ])

  function anadirEspecialidad() {
    const valor = especialidadNueva.trim()
    if (valor && !especialidades.some((e) => e.nombre === valor)) {
      setEspecialidades([...especialidades, { nombre: valor, descripcion: '' }])
    }
    setEspecialidadNueva('')
  }

  function actualizarDescripcionEspecialidad(nombre: string, descripcion: string) {
    setEspecialidades((actuales) => actuales.map((e) => (e.nombre === nombre ? { ...e, descripcion } : e)))
  }

  function quitarEspecialidad(nombre: string) {
    setEspecialidades((actuales) => actuales.filter((e) => e.nombre !== nombre))
  }

  async function subirFotoPerfil(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0]
    if (!archivo) return
    setSubiendoFoto(true)
    try {
      setFotoPerfilUrl(await subirFoto(userId, archivo))
    } catch {
      setError('No se ha podido subir la foto. Inténtalo de nuevo.')
    } finally {
      setSubiendoFoto(false)
    }
  }

  async function subirFotoTrabajo(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0]
    if (!archivo) return
    setSubiendoFoto(true)
    try {
      const url = await subirFoto(userId, archivo)
      setFotosTrabajos((actuales) => [...actuales, url])
    } catch {
      setError('No se ha podido subir la foto. Inténtalo de nuevo.')
    } finally {
      setSubiendoFoto(false)
    }
  }

  const porcentajeCompletitud = calcularCompletitudPorcentaje({
    fotoPerfilUrl,
    descripcion,
    especialidades,
    fotosTrabajos,
    contacto,
  })

  function datosEsencialesValidos(): boolean {
    if (
      !nombreComercial.trim() ||
      categoriaIds.length === 0 ||
      zonaIds.length === 0 ||
      !localidad.trim() ||
      !descripcionBreve.trim()
    ) {
      setError('Rellena el nombre, al menos un oficio, al menos una zona, la localidad y una descripción breve.')
      return false
    }
    if (!contacto.telefono && !contacto.whatsapp && !contacto.email && !contacto.web) {
      setError('Añade al menos un medio de contacto.')
      return false
    }
    return true
  }

  function siguiente() {
    setError(null)
    if (paso === 1 && !datosEsencialesValidos()) return
    setPaso((p) => Math.min(p + 1, TOTAL_PASOS))
  }

  function atras() {
    setError(null)
    setPaso((p) => Math.max(p - 1, 1))
  }

  function irAPaso(objetivo: number) {
    setError(null)
    if (objetivo > 1 && !datosEsencialesValidos()) {
      setPaso(1)
      return
    }
    setPaso(objetivo)
  }

  async function guardarFicha() {
    setError(null)
    setGuardadoOk(false)
    if (!datosEsencialesValidos()) return

    try {
      await guardar.mutateAsync({
        idExistente: profesional?.id ?? null,
        datos: {
          nombreComercial,
          categoriaIds,
          especialidades,
          localidad,
          zonaIds,
          descripcionBreve,
          descripcion,
          fotoPerfilUrl,
          fotosTrabajos,
          contacto,
        },
      })
      borrarBorrador(userId)
      setGuardadoOk(true)
    } catch {
      setError('No se ha podido guardar la ficha. Inténtalo de nuevo.')
    }
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    guardarFicha()
  }

  return (
    <div className="mt-6">
      <Stepper pasoActual={paso} titulos={TITULOS_PASO} onIrAPaso={irAPaso} />

      <div className="mt-4">
        <MedidorCompletitud porcentaje={porcentajeCompletitud} />
      </div>

      <form onSubmit={enviar} className="mt-6 flex flex-col gap-5">
        {paso === 1 && (
          <>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Nombre comercial</span>
              <input
                type="text"
                required
                value={nombreComercial}
                onChange={(e) => setNombreComercial(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900"
              />
            </label>

            <div className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Oficios</span>
              <p className="mb-2 text-xs text-neutral-500">
                Elige una categoría y desmarca los oficios que no haces. El primero de la lista será tu oficio principal.
              </p>
              <SelectorChipsCategoria
                familias={familias}
                categorias={categorias}
                valores={categoriaIds}
                onChange={setCategoriaIds}
              />
            </div>

            <div className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Zonas donde trabajas</span>
              <p className="mb-2 text-xs text-neutral-500">
                Busca comunidades enteras o ciudades sueltas y añade las que necesites.
              </p>
              <BuscadorZonasChips zonas={zonas} valores={zonaIds} onChange={setZonaIds} />
            </div>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Localidad</span>
              <input
                type="text"
                required
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900"
              />
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">
                Descripción breve (para la tarjeta del directorio)
              </span>
              <input
                type="text"
                required
                maxLength={140}
                placeholder="Ej. Fontanero con 10 años de experiencia en reformas de baños y cocinas"
                value={descripcionBreve}
                onChange={(e) => setDescripcionBreve(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900"
              />
            </label>

            <fieldset className="grid gap-3 sm:grid-cols-2">
              <legend className="mb-1 text-sm font-medium text-neutral-700">Contacto (al menos uno)</legend>
              <input
                type="tel"
                placeholder="Teléfono"
                value={contacto.telefono ?? ''}
                onChange={(e) => setContacto({ ...contacto, telefono: e.target.value || undefined })}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
              />
              <input
                type="tel"
                placeholder="WhatsApp"
                value={contacto.whatsapp ?? ''}
                onChange={(e) => setContacto({ ...contacto, whatsapp: e.target.value || undefined })}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={contacto.email ?? ''}
                onChange={(e) => setContacto({ ...contacto, email: e.target.value || undefined })}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
              />
              <input
                type="url"
                placeholder="Sitio web"
                value={contacto.web ?? ''}
                onChange={(e) => setContacto({ ...contacto, web: e.target.value || undefined })}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
              />
            </fieldset>
          </>
        )}

        {paso === 2 && (
          <>
            <p className="text-sm text-neutral-500">
              Opcional, pero merece la pena: las especialidades aparecen en las búsquedas del directorio, y la
              descripción es lo primero que lee un cliente al entrar en tu ficha. Puedes saltarlo y añadirlo más
              adelante desde aquí mismo.
            </p>

            <div className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Especialidades</span>
              <p className="mb-2 text-xs text-neutral-500">
                Cada una puede llevar su propia explicación (opcional) de en qué consiste ese trabajo.
              </p>
              {especialidades.length > 0 && (
                <div className="mb-3 flex flex-col gap-2">
                  {especialidades.map((especialidad) => (
                    <div key={especialidad.nombre} className="rounded-lg border border-neutral-200 bg-white p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
                          {especialidad.nombre}
                        </span>
                        <button
                          type="button"
                          onClick={() => quitarEspecialidad(especialidad.nombre)}
                          aria-label={`Quitar ${especialidad.nombre}`}
                          className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={especialidad.descripcion}
                        onChange={(e) => actualizarDescripcionEspecialidad(especialidad.nombre, e.target.value)}
                        placeholder="Describe en qué consiste (opcional)"
                        className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={especialidadNueva}
                  onChange={(e) => setEspecialidadNueva(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      anadirEspecialidad()
                    }
                  }}
                  placeholder="Ej. Reforma de baños"
                  className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900"
                />
                <button
                  type="button"
                  onClick={anadirEspecialidad}
                  className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  <Plus className="h-4 w-4" /> Añadir
                </button>
              </div>
            </div>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Sobre ti</span>
              <p className="mb-1 text-xs text-neutral-500">
                Preséntate: tu experiencia, cómo trabajas... Esto no es por especialidad, es lo que un cliente lee
                al entrar en tu ficha.
              </p>
              <textarea
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900"
              />
            </label>
          </>
        )}

        {paso === 3 && (
          <>
            <p className="text-sm text-neutral-500">
              También opcional. Los perfiles con foto y trabajos reales destacan más.
            </p>

            <div className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Foto de perfil o logotipo</span>
              <div className="flex items-center gap-3">
                {fotoPerfilUrl && <img src={fotoPerfilUrl} alt="" className="h-24 w-24 rounded-xl object-cover" />}
                <label
                  htmlFor="foto-perfil-input"
                  className={cn(
                    'flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-neutral-300 text-neutral-500 hover:border-brand-400 hover:text-brand-600',
                    subiendoFoto && 'pointer-events-none opacity-50',
                  )}
                >
                  <ImagePlus className="h-5 w-5" />
                  <span className="text-xs font-medium">{subiendoFoto ? 'Subiendo…' : fotoPerfilUrl ? 'Cambiar' : 'Añadir'}</span>
                </label>
                <input
                  id="foto-perfil-input"
                  type="file"
                  accept="image/*"
                  onChange={subirFotoPerfil}
                  disabled={subiendoFoto}
                  className="hidden"
                />
              </div>
            </div>

            <div className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Fotografías</span>
              <div className="flex flex-wrap gap-3">
                {fotosTrabajos.map((url) => (
                  <div key={url} className="group relative h-24 w-24 overflow-hidden rounded-lg">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFotosTrabajos(fotosTrabajos.filter((f) => f !== url))}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                      aria-label="Quitar foto"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <label
                  htmlFor="foto-trabajo-input"
                  className={cn(
                    'flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 text-neutral-500 hover:border-brand-400 hover:text-brand-600',
                    subiendoFoto && 'pointer-events-none opacity-50',
                  )}
                >
                  <ImagePlus className="h-5 w-5" />
                  <span className="text-xs font-medium">{subiendoFoto ? 'Subiendo…' : 'Añadir'}</span>
                </label>
                <input
                  id="foto-trabajo-input"
                  type="file"
                  accept="image/*"
                  onChange={subirFotoTrabajo}
                  disabled={subiendoFoto}
                  className="hidden"
                />
              </div>
            </div>
          </>
        )}

        {error && <p className="text-sm text-danger-500">{error}</p>}
        {guardadoOk && <p className="text-sm text-success-500">Ficha guardada correctamente.</p>}

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            {paso > 1 && (
              <Button type="button" variante="secundario" onClick={atras}>
                Atrás
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {paso === 1 && (
              <Button
                type="button"
                variante="secundario"
                disabled={guardar.isPending || subiendoFoto}
                onClick={guardarFicha}
              >
                {guardar.isPending ? 'Guardando…' : profesional ? 'Guardar y salir' : 'Publicar ya'}
              </Button>
            )}
            {paso < TOTAL_PASOS ? (
              <Button type="button" onClick={siguiente}>
                Siguiente
              </Button>
            ) : (
              <Button type="submit" disabled={guardar.isPending || subiendoFoto}>
                {guardar.isPending ? 'Guardando…' : profesional ? 'Guardar cambios' : 'Publicar ficha'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

type IdTarjeta = 'basicos' | 'oficios' | 'zonas' | 'contacto' | 'especialidades' | 'fotos'

type PropsGestion = {
  userId: string
  familias: Familia[]
  categorias: Categoria[]
  zonas: Zona[]
  profesional: Profesional
}

function TarjetaEditable({
  titulo,
  icono: Icono,
  editando,
  onEditar,
  onCancelar,
  onGuardar,
  guardando,
  guardadoOk,
  resumen,
  children,
  siempreVisible = false,
}: {
  titulo: string
  icono: React.ComponentType<{ className?: string }>
  editando: boolean
  onEditar: () => void
  onCancelar: () => void
  onGuardar: () => void
  guardando: boolean
  guardadoOk?: boolean
  resumen?: React.ReactNode
  children: React.ReactNode
  /** La tarjeta de Fotos no se colapsa en un resumen: se ve siempre abierta. */
  siempreVisible?: boolean
}) {
  const mostrarFormulario = siempreVisible || editando

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50">
            <Icono className="h-4 w-4 text-brand-600" aria-hidden="true" />
          </span>
          <h3 className="font-semibold text-neutral-900">{titulo}</h3>
        </div>
        {!siempreVisible && !editando && (
          <button
            type="button"
            onClick={onEditar}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Editar
          </button>
        )}
      </div>

      {mostrarFormulario ? (
        <div className="mt-4 flex flex-col gap-3 border-t border-neutral-100 pt-4">
          {children}
          <div className="flex items-center gap-2">
            <Button type="button" tamano="md" onClick={onGuardar} disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </Button>
            <Button type="button" variante="secundario" tamano="md" onClick={onCancelar} disabled={guardando}>
              Cancelar
            </Button>
            {guardadoOk && <span className="text-sm text-success-500">Guardado.</span>}
          </div>
        </div>
      ) : (
        <div className="mt-3 pl-[42px] text-sm text-neutral-600">{resumen}</div>
      )}
    </div>
  )
}

function GestionarPerfil({ userId, familias, categorias, zonas, profesional }: PropsGestion) {
  const guardar = useGuardarMiProfesional()

  const [nombreComercial, setNombreComercial] = useState(profesional.nombreComercial)
  const [categoriaIds, setCategoriaIds] = useState<string[]>(profesional.oficios.map((o) => o.id))
  const [zonaIds, setZonaIds] = useState<string[]>(
    zonas.filter((z) => profesional.zonasTrabajo.includes(z.slug)).map((z) => z.id),
  )
  const [especialidades, setEspecialidades] = useState<Especialidad[]>(profesional.especialidades)
  const [especialidadNueva, setEspecialidadNueva] = useState('')
  const [localidad, setLocalidad] = useState(profesional.localidad)
  const [descripcionBreve, setDescripcionBreve] = useState(profesional.descripcionBreve)
  const [descripcion, setDescripcion] = useState(profesional.descripcion)
  const [contacto, setContacto] = useState<MediosContacto>(profesional.contacto)
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState<string | null>(profesional.fotoPerfilUrl ?? null)
  const [fotosTrabajos, setFotosTrabajos] = useState<string[]>(profesional.fotosTrabajos)
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guardadoOk, setGuardadoOk] = useState<IdTarjeta | null>(null)
  const [tarjetaEditando, setTarjetaEditando] = useState<IdTarjeta | null>(null)

  function abrirTarjeta(id: IdTarjeta) {
    setError(null)
    setGuardadoOk(null)
    setTarjetaEditando(id)
  }

  function anadirEspecialidad() {
    const valor = especialidadNueva.trim()
    if (valor && !especialidades.some((e) => e.nombre === valor)) {
      setEspecialidades([...especialidades, { nombre: valor, descripcion: '' }])
    }
    setEspecialidadNueva('')
  }

  function actualizarDescripcionEspecialidad(nombre: string, descripcionEsp: string) {
    setEspecialidades((actuales) => actuales.map((e) => (e.nombre === nombre ? { ...e, descripcion: descripcionEsp } : e)))
  }

  function quitarEspecialidad(nombre: string) {
    setEspecialidades((actuales) => actuales.filter((e) => e.nombre !== nombre))
  }

  async function subirFotoPerfil(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0]
    if (!archivo) return
    setSubiendoFoto(true)
    try {
      setFotoPerfilUrl(await subirFoto(userId, archivo))
    } catch {
      setError('No se ha podido subir la foto. Inténtalo de nuevo.')
    } finally {
      setSubiendoFoto(false)
    }
  }

  async function subirFotoTrabajo(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0]
    if (!archivo) return
    setSubiendoFoto(true)
    try {
      const url = await subirFoto(userId, archivo)
      setFotosTrabajos((actuales) => [...actuales, url])
    } catch {
      setError('No se ha podido subir la foto. Inténtalo de nuevo.')
    } finally {
      setSubiendoFoto(false)
    }
  }

  function datosValidos(): boolean {
    if (
      !nombreComercial.trim() ||
      categoriaIds.length === 0 ||
      zonaIds.length === 0 ||
      !localidad.trim() ||
      !descripcionBreve.trim()
    ) {
      setError('Rellena el nombre, al menos un oficio, al menos una zona, la localidad y una descripción breve.')
      return false
    }
    if (!contacto.telefono && !contacto.whatsapp && !contacto.email && !contacto.web) {
      setError('Añade al menos un medio de contacto.')
      return false
    }
    return true
  }

  async function guardarTarjeta() {
    setError(null)
    setGuardadoOk(null)
    if (!datosValidos()) return
    const idTarjeta = tarjetaEditando
    try {
      await guardar.mutateAsync({
        idExistente: profesional.id,
        datos: {
          nombreComercial,
          categoriaIds,
          especialidades,
          localidad,
          zonaIds,
          descripcionBreve,
          descripcion,
          fotoPerfilUrl,
          fotosTrabajos,
          contacto,
        },
      })
      setTarjetaEditando(null)
      setGuardadoOk(idTarjeta)
    } catch {
      setError('No se ha podido guardar. Inténtalo de nuevo.')
    }
  }

  function cancelarBasicos() {
    setNombreComercial(profesional.nombreComercial)
    setLocalidad(profesional.localidad)
    setDescripcionBreve(profesional.descripcionBreve)
    setTarjetaEditando(null)
  }

  function cancelarOficios() {
    setCategoriaIds(profesional.oficios.map((o) => o.id))
    setTarjetaEditando(null)
  }

  function cancelarZonas() {
    setZonaIds(zonas.filter((z) => profesional.zonasTrabajo.includes(z.slug)).map((z) => z.id))
    setTarjetaEditando(null)
  }

  function cancelarContacto() {
    setContacto(profesional.contacto)
    setTarjetaEditando(null)
  }

  function cancelarEspecialidades() {
    setEspecialidades(profesional.especialidades)
    setDescripcion(profesional.descripcion)
    setTarjetaEditando(null)
  }

  function cancelarFotos() {
    setFotoPerfilUrl(profesional.fotoPerfilUrl ?? null)
    setFotosTrabajos(profesional.fotosTrabajos)
    setTarjetaEditando(null)
  }

  const contactoTexto = [contacto.telefono, contacto.whatsapp, contacto.email, contacto.web].filter(Boolean).join(' · ')
  const oficiosSeleccionados = categorias.filter((c) => categoriaIds.includes(c.id))
  const zonasSeleccionadas = zonas.filter((z) => zonaIds.includes(z.id))

  return (
    <div className="mt-6 flex flex-col gap-4">
      {error && <p className="text-sm text-danger-500">{error}</p>}

      <TarjetaEditable
        titulo="Datos básicos"
        icono={User}
        editando={tarjetaEditando === 'basicos'}
        onEditar={() => abrirTarjeta('basicos')}
        onCancelar={cancelarBasicos}
        onGuardar={guardarTarjeta}
        guardando={guardar.isPending}
        resumen={
          <>
            <p className="font-medium text-neutral-900">{nombreComercial}</p>
            <p>{localidad}</p>
            <p className="mt-1">{descripcionBreve}</p>
            {guardadoOk === 'basicos' && <p className="mt-1 text-success-500">Guardado.</p>}
          </>
        }
      >
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Nombre comercial</span>
          <input
            type="text"
            required
            value={nombreComercial}
            onChange={(e) => setNombreComercial(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Localidad</span>
          <input
            type="text"
            required
            value={localidad}
            onChange={(e) => setLocalidad(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">
            Descripción breve (para la tarjeta del directorio)
          </span>
          <input
            type="text"
            required
            maxLength={140}
            placeholder="Ej. Fontanero con 10 años de experiencia en reformas de baños y cocinas"
            value={descripcionBreve}
            onChange={(e) => setDescripcionBreve(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900"
          />
        </label>
      </TarjetaEditable>

      <TarjetaEditable
        titulo="Oficios"
        icono={Briefcase}
        editando={tarjetaEditando === 'oficios'}
        onEditar={() => abrirTarjeta('oficios')}
        onCancelar={cancelarOficios}
        onGuardar={guardarTarjeta}
        guardando={guardar.isPending}
        resumen={
          <>
            {oficiosSeleccionados.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {oficiosSeleccionados.map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
                  >
                    <IconoCategoria iconoUrl={c.iconoUrl} nombre={c.nombre} className="h-3.5 w-3.5" />
                    {c.nombre}
                  </span>
                ))}
              </div>
            ) : (
              <p>Sin oficios todavía</p>
            )}
            {guardadoOk === 'oficios' && <p className="mt-1 text-success-500">Guardado.</p>}
          </>
        }
      >
        <p className="text-xs text-neutral-500">
          Elige una categoría y desmarca los oficios que no haces. El primero de la lista será tu oficio principal.
        </p>
        <SelectorChipsCategoria familias={familias} categorias={categorias} valores={categoriaIds} onChange={setCategoriaIds} />
      </TarjetaEditable>

      <TarjetaEditable
        titulo="Zonas donde trabajas"
        icono={MapPin}
        editando={tarjetaEditando === 'zonas'}
        onEditar={() => abrirTarjeta('zonas')}
        onCancelar={cancelarZonas}
        onGuardar={guardarTarjeta}
        guardando={guardar.isPending}
        resumen={
          <>
            {zonasSeleccionadas.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {zonasSeleccionadas.map((z) => (
                  <span
                    key={z.id}
                    className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
                  >
                    {z.nombre}
                  </span>
                ))}
              </div>
            ) : (
              <p>Sin zonas todavía</p>
            )}
            {guardadoOk === 'zonas' && <p className="mt-1 text-success-500">Guardado.</p>}
          </>
        }
      >
        <p className="text-xs text-neutral-500">Busca comunidades enteras o ciudades sueltas y añade las que necesites.</p>
        <BuscadorZonasChips zonas={zonas} valores={zonaIds} onChange={setZonaIds} />
      </TarjetaEditable>

      <TarjetaEditable
        titulo="Contacto"
        icono={Phone}
        editando={tarjetaEditando === 'contacto'}
        onEditar={() => abrirTarjeta('contacto')}
        onCancelar={cancelarContacto}
        onGuardar={guardarTarjeta}
        guardando={guardar.isPending}
        resumen={
          <>
            <p>{contactoTexto || 'Sin datos de contacto todavía'}</p>
            {guardadoOk === 'contacto' && <p className="mt-1 text-success-500">Guardado.</p>}
          </>
        }
      >
        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="mb-1 text-sm font-medium text-neutral-700">Al menos un medio de contacto</legend>
          <input
            type="tel"
            placeholder="Teléfono"
            value={contacto.telefono ?? ''}
            onChange={(e) => setContacto({ ...contacto, telefono: e.target.value || undefined })}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
          />
          <input
            type="tel"
            placeholder="WhatsApp"
            value={contacto.whatsapp ?? ''}
            onChange={(e) => setContacto({ ...contacto, whatsapp: e.target.value || undefined })}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={contacto.email ?? ''}
            onChange={(e) => setContacto({ ...contacto, email: e.target.value || undefined })}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
          />
          <input
            type="url"
            placeholder="Sitio web"
            value={contacto.web ?? ''}
            onChange={(e) => setContacto({ ...contacto, web: e.target.value || undefined })}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
          />
        </fieldset>
      </TarjetaEditable>

      <TarjetaEditable
        titulo="Especialidades y presentación"
        icono={FileText}
        editando={tarjetaEditando === 'especialidades'}
        onEditar={() => abrirTarjeta('especialidades')}
        onCancelar={cancelarEspecialidades}
        onGuardar={guardarTarjeta}
        guardando={guardar.isPending}
        resumen={
          <>
            <p>{especialidades.map((e) => e.nombre).join(', ') || 'Sin especialidades todavía'}</p>
            <p className="mt-1 line-clamp-2">{descripcion || 'Sin presentación todavía'}</p>
            {guardadoOk === 'especialidades' && <p className="mt-1 text-success-500">Guardado.</p>}
          </>
        }
      >
        <div className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Especialidades</span>
          <p className="mb-2 text-xs text-neutral-500">
            Cada una puede llevar su propia explicación (opcional) de en qué consiste ese trabajo.
          </p>
          {especialidades.length > 0 && (
            <div className="mb-3 flex flex-col gap-2">
              {especialidades.map((especialidad) => (
                <div key={especialidad.nombre} className="rounded-lg border border-neutral-200 bg-white p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
                      {especialidad.nombre}
                    </span>
                    <button
                      type="button"
                      onClick={() => quitarEspecialidad(especialidad.nombre)}
                      aria-label={`Quitar ${especialidad.nombre}`}
                      className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={especialidad.descripcion}
                    onChange={(e) => actualizarDescripcionEspecialidad(especialidad.nombre, e.target.value)}
                    placeholder="Describe en qué consiste (opcional)"
                    className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={especialidadNueva}
              onChange={(e) => setEspecialidadNueva(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  anadirEspecialidad()
                }
              }}
              placeholder="Ej. Reforma de baños"
              className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900"
            />
            <button
              type="button"
              onClick={anadirEspecialidad}
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <Plus className="h-4 w-4" /> Añadir
            </button>
          </div>
        </div>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Sobre ti</span>
          <p className="mb-1 text-xs text-neutral-500">
            Preséntate: tu experiencia, cómo trabajas... Esto no es por especialidad, es lo que un cliente lee al
            entrar en tu ficha.
          </p>
          <textarea
            rows={4}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900"
          />
        </label>
      </TarjetaEditable>

      <TarjetaEditable
        titulo="Fotos"
        icono={ImagePlus}
        siempreVisible
        editando={tarjetaEditando === 'fotos'}
        onEditar={() => abrirTarjeta('fotos')}
        onCancelar={cancelarFotos}
        onGuardar={guardarTarjeta}
        guardando={guardar.isPending}
        guardadoOk={guardadoOk === 'fotos'}
      >
        <div className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Foto de perfil o logotipo</span>
          <div className="flex items-center gap-3">
            {fotoPerfilUrl && <img src={fotoPerfilUrl} alt="" className="h-24 w-24 rounded-xl object-cover" />}
            <label
              htmlFor="gestion-foto-perfil-input"
              className={cn(
                'flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-neutral-300 text-neutral-500 hover:border-brand-400 hover:text-brand-600',
                subiendoFoto && 'pointer-events-none opacity-50',
              )}
            >
              <ImagePlus className="h-5 w-5" />
              <span className="text-xs font-medium">{subiendoFoto ? 'Subiendo…' : fotoPerfilUrl ? 'Cambiar' : 'Añadir'}</span>
            </label>
            <input
              id="gestion-foto-perfil-input"
              type="file"
              accept="image/*"
              onChange={subirFotoPerfil}
              disabled={subiendoFoto}
              className="hidden"
            />
          </div>
        </div>

        <div className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Fotografías</span>
          <div className="flex flex-wrap gap-3">
            {fotosTrabajos.map((url) => (
              <div key={url} className="group relative h-24 w-24 overflow-hidden rounded-lg">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFotosTrabajos(fotosTrabajos.filter((f) => f !== url))}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  aria-label="Quitar foto"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <label
              htmlFor="gestion-foto-trabajo-input"
              className={cn(
                'flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 text-neutral-500 hover:border-brand-400 hover:text-brand-600',
                subiendoFoto && 'pointer-events-none opacity-50',
              )}
            >
              <ImagePlus className="h-5 w-5" />
              <span className="text-xs font-medium">{subiendoFoto ? 'Subiendo…' : 'Añadir'}</span>
            </label>
            <input
              id="gestion-foto-trabajo-input"
              type="file"
              accept="image/*"
              onChange={subirFotoTrabajo}
              disabled={subiendoFoto}
              className="hidden"
            />
          </div>
        </div>
      </TarjetaEditable>
    </div>
  )
}
