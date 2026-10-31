import { ImagePlus, Plus, X } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { BuscadorZonasChips } from '../directorio/BuscadorZonas'
import { SelectorChipsCategoria } from '../directorio/SelectorChipsCategoria'
import { Button } from '../ui/Button'
import { MedidorCompletitud } from '../ui/MedidorCompletitud'
import { Stepper } from '../ui/Stepper'
import { calcularCompletitudPorcentaje } from '../../features/directorio/completitud'
import { cn } from '../../lib/cn'
import { useGuardarMiProfesional, useMiProfesional } from '../../features/directorio/queries'
import { subirFoto } from '../../lib/storage'
import type { Categoria, Especialidad, Familia, MediosContacto, Zona } from '../../types/profesional'

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

export function FormularioFicha({ userId, familias, categorias, zonas, profesional }: Props) {
  const guardar = useGuardarMiProfesional()
  const borrador = useState(() => leerBorrador(userId))[0]

  const [paso, setPaso] = useState(borrador?.paso ?? 1)
  const [nombreComercial, setNombreComercial] = useState(
    borrador?.nombreComercial ?? profesional?.nombreComercial ?? '',
  )
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
  const [descripcionBreve, setDescripcionBreve] = useState(
    borrador?.descripcionBreve ?? profesional?.descripcionBreve ?? '',
  )
  const [descripcion, setDescripcion] = useState(borrador?.descripcion ?? profesional?.descripcion ?? '')
  const [contacto, setContacto] = useState<MediosContacto>(borrador?.contacto ?? profesional?.contacto ?? {})
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState<string | null>(
    borrador?.fotoPerfilUrl ?? profesional?.fotoPerfilUrl ?? null,
  )
  const [fotosTrabajos, setFotosTrabajos] = useState<string[]>(
    borrador?.fotosTrabajos ?? profesional?.fotosTrabajos ?? [],
  )
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
                Elige una categoría y desmarca los oficios que no haces. El primero de la lista será tu oficio
                principal.
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
                onChange={(e) =>
                  setContacto({
                    ...contacto,
                    telefono: e.target.value || undefined,
                  })
                }
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
              />
              <input
                type="tel"
                placeholder="WhatsApp"
                value={contacto.whatsapp ?? ''}
                onChange={(e) =>
                  setContacto({
                    ...contacto,
                    whatsapp: e.target.value || undefined,
                  })
                }
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={contacto.email ?? ''}
                onChange={(e) =>
                  setContacto({
                    ...contacto,
                    email: e.target.value || undefined,
                  })
                }
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
                  <span className="text-xs font-medium">
                    {subiendoFoto ? 'Subiendo…' : fotoPerfilUrl ? 'Cambiar' : 'Añadir'}
                  </span>
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
