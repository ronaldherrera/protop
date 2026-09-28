import { Plus, X } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/estado/EmptyState'
import { ErrorState } from '../components/estado/ErrorState'
import { LoadingState } from '../components/estado/LoadingState'
import { GestionTrabajos } from '../components/trabajos/GestionTrabajos'
import { Button } from '../components/ui/Button'
import { useAuth } from '../features/auth/useAuth'
import {
  useCategorias,
  useGuardarMiProfesional,
  useMiProfesional,
  useZonas,
} from '../features/directorio/queries'
import { useSolicitudesDisponibles } from '../features/solicitudes/queries'
import { subirFoto } from '../lib/storage'
import type { MediosContacto } from '../types/profesional'

export function AreaProfesional() {
  const { user } = useAuth()
  const miProfesional = useMiProfesional()
  const categorias = useCategorias()
  const zonas = useZonas()

  if (miProfesional.isLoading || categorias.isLoading || zonas.isLoading) {
    return <LoadingState etiqueta="Cargando tu ficha…" />
  }

  if (miProfesional.isError || categorias.isError || zonas.isError || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <ErrorState descripcion="No hemos podido cargar tu área profesional. Inténtalo de nuevo en unos segundos." />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Tu perfil de profesional</h1>
      <p className="mt-1 text-sm text-neutral-600">
        {miProfesional.data
          ? 'Edita los datos que ven los particulares en el directorio.'
          : 'Rellena estos datos para aparecer en el directorio de Protop. Gratis, sin comisión por el trabajo.'}
      </p>

      {miProfesional.data && (
        <Link
          to={`/profesionales/${miProfesional.data.slug}`}
          className="mt-2 inline-block text-sm font-medium text-brand-700 hover:underline"
        >
          Ver mi perfil público →
        </Link>
      )}

      <FormularioFicha
        key={miProfesional.data?.id ?? 'nueva'}
        userId={user.id}
        categorias={categorias.data ?? []}
        zonas={zonas.data ?? []}
        profesional={miProfesional.data ?? null}
      />

      {miProfesional.data && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-neutral-900">Trabajos publicados</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Muestra trabajos reales en tu perfil. Puedes vincular al cliente para que, si quiere, deje un
            comentario — es opcional y no afecta a tu puntuación oficial.
          </p>
          <div className="mt-3">
            <GestionTrabajos profesionalId={miProfesional.data.id} />
          </div>
        </div>
      )}

      {miProfesional.data && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-neutral-900">Solicitudes disponibles para ti</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Solicitudes abiertas en tu oficio y zona. Responder es gratis.
          </p>
          <SolicitudesDisponibles />
        </div>
      )}
    </div>
  )
}

function SolicitudesDisponibles() {
  const solicitudes = useSolicitudesDisponibles()

  if (solicitudes.isLoading) {
    return <LoadingState etiqueta="Cargando solicitudes…" />
  }

  if (solicitudes.isError) {
    return <ErrorState descripcion="No hemos podido cargar las solicitudes disponibles." />
  }

  if (!solicitudes.data || solicitudes.data.length === 0) {
    return (
      <div className="mt-3">
        <EmptyState titulo="No hay solicitudes disponibles ahora mismo" />
      </div>
    )
  }

  return (
    <ul className="mt-3 flex flex-col gap-2">
      {solicitudes.data.map((s) => (
        <li key={s.id}>
          <Link
            to={`/solicitudes/${s.id}`}
            className="block rounded-lg border border-neutral-200 px-4 py-3 hover:bg-neutral-50"
          >
            <p className="text-sm font-medium text-neutral-900">{s.titulo}</p>
            <p className="text-xs text-neutral-500">
              {s.categoriaNombre} · {s.zonaNombre}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}

type Props = {
  userId: string
  categorias: { id: string; slug: string; nombre: string }[]
  zonas: { id: string; slug: string; nombre: string }[]
  profesional: ReturnType<typeof useMiProfesional>['data'] | null
}

function FormularioFicha({ userId, categorias, zonas, profesional }: Props) {
  const guardar = useGuardarMiProfesional()

  const [nombreComercial, setNombreComercial] = useState(profesional?.nombreComercial ?? '')
  const [categoriaId, setCategoriaId] = useState(
    () => categorias.find((c) => c.slug === profesional?.oficioPrincipal)?.id ?? '',
  )
  const [zonaIds, setZonaIds] = useState<string[]>(() =>
    zonas.filter((z) => profesional?.zonasTrabajo.includes(z.slug)).map((z) => z.id),
  )
  const [especialidades, setEspecialidades] = useState<string[]>(profesional?.especialidades ?? [])
  const [especialidadNueva, setEspecialidadNueva] = useState('')
  const [localidad, setLocalidad] = useState(profesional?.localidad ?? '')
  const [descripcionBreve, setDescripcionBreve] = useState(profesional?.descripcionBreve ?? '')
  const [descripcion, setDescripcion] = useState(profesional?.descripcion ?? '')
  const [contacto, setContacto] = useState<MediosContacto>(profesional?.contacto ?? {})
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState<string | null>(profesional?.fotoPerfilUrl ?? null)
  const [fotosTrabajos, setFotosTrabajos] = useState<string[]>(profesional?.fotosTrabajos ?? [])
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guardadoOk, setGuardadoOk] = useState(false)

  function anadirEspecialidad() {
    const valor = especialidadNueva.trim()
    if (valor && !especialidades.includes(valor)) {
      setEspecialidades([...especialidades, valor])
    }
    setEspecialidadNueva('')
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

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    setError(null)
    setGuardadoOk(false)

    if (!categoriaId) {
      setError('Elige un oficio.')
      return
    }
    if (zonaIds.length === 0) {
      setError('Elige al menos una zona de trabajo.')
      return
    }
    if (!contacto.telefono && !contacto.whatsapp && !contacto.email && !contacto.web) {
      setError('Añade al menos un medio de contacto.')
      return
    }

    try {
      await guardar.mutateAsync({
        idExistente: profesional?.id ?? null,
        datos: {
          nombreComercial,
          categoriaId,
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
      setGuardadoOk(true)
    } catch {
      setError('No se ha podido guardar la ficha. Inténtalo de nuevo.')
    }
  }

  return (
    <form onSubmit={enviar} className="mt-6 flex flex-col gap-5">
      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Nombre comercial</span>
        <input
          type="text"
          required
          value={nombreComercial}
          onChange={(e) => setNombreComercial(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
        />
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Oficio principal</span>
        <select
          required
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
        >
          <option value="">Selecciona un oficio</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="text-sm">
        <legend className="mb-1 font-medium text-neutral-700">Zonas donde trabajas</legend>
        <div className="flex flex-wrap gap-2">
          {zonas.map((zona) => {
            const activa = zonaIds.includes(zona.id)
            return (
              <button
                type="button"
                key={zona.id}
                onClick={() =>
                  setZonaIds((actuales) =>
                    activa ? actuales.filter((id) => id !== zona.id) : [...actuales, zona.id],
                  )
                }
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  activa ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-neutral-300 text-neutral-600'
                }`}
              >
                {zona.nombre}
              </button>
            )
          })}
        </div>
      </fieldset>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Localidad</span>
        <input
          type="text"
          required
          value={localidad}
          onChange={(e) => setLocalidad(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
        />
      </label>

      <div className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Especialidades</span>
        <div className="flex flex-wrap gap-2">
          {especialidades.map((especialidad) => (
            <span
              key={especialidad}
              className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-700"
            >
              {especialidad}
              <button
                type="button"
                onClick={() => setEspecialidades(especialidades.filter((e) => e !== especialidad))}
                aria-label={`Quitar ${especialidad}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
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
            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
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
        <span className="mb-1 block font-medium text-neutral-700">Descripción breve (para la tarjeta del directorio)</span>
        <input
          type="text"
          required
          maxLength={140}
          value={descripcionBreve}
          onChange={(e) => setDescripcionBreve(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
        />
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Descripción completa</span>
        <textarea
          required
          rows={4}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
        />
      </label>

      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="mb-1 text-sm font-medium text-neutral-700">Medios de contacto</legend>
        <input
          type="tel"
          placeholder="Teléfono"
          value={contacto.telefono ?? ''}
          onChange={(e) => setContacto({ ...contacto, telefono: e.target.value || undefined })}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900"
        />
        <input
          type="tel"
          placeholder="WhatsApp"
          value={contacto.whatsapp ?? ''}
          onChange={(e) => setContacto({ ...contacto, whatsapp: e.target.value || undefined })}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={contacto.email ?? ''}
          onChange={(e) => setContacto({ ...contacto, email: e.target.value || undefined })}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900"
        />
        <input
          type="url"
          placeholder="Sitio web"
          value={contacto.web ?? ''}
          onChange={(e) => setContacto({ ...contacto, web: e.target.value || undefined })}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900"
        />
      </fieldset>

      <div className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Foto de perfil o logotipo</span>
        <div className="flex items-center gap-3">
          {fotoPerfilUrl && <img src={fotoPerfilUrl} alt="" className="h-16 w-16 rounded-xl object-cover" />}
          <input type="file" accept="image/*" onChange={subirFotoPerfil} disabled={subiendoFoto} />
        </div>
      </div>

      <div className="text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Fotografías de trabajos</span>
        <div className="flex flex-wrap gap-3">
          {fotosTrabajos.map((url) => (
            <div key={url} className="relative">
              <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => setFotosTrabajos(fotosTrabajos.filter((f) => f !== url))}
                className="absolute -right-2 -top-2 rounded-full bg-white p-0.5 shadow"
                aria-label="Quitar foto"
              >
                <X className="h-4 w-4 text-neutral-700" />
              </button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" onChange={subirFotoTrabajo} disabled={subiendoFoto} className="mt-2" />
      </div>

      {error && <p className="text-sm text-danger-500">{error}</p>}
      {guardadoOk && <p className="text-sm text-success-500">Ficha guardada correctamente.</p>}

      <Button type="submit" disabled={guardar.isPending || subiendoFoto} className="sm:w-auto">
        {guardar.isPending ? 'Guardando…' : 'Guardar ficha'}
      </Button>
    </form>
  )
}
