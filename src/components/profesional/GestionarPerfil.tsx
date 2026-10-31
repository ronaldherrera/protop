import { Briefcase, FileText, ImagePlus, MapPin, Pencil, Phone, Plus, User, X } from 'lucide-react'
import { useState } from 'react'
import { BuscadorZonasChips } from '../directorio/BuscadorZonas'
import { IconoCategoria } from '../directorio/IconoCategoria'
import { SelectorChipsCategoria } from '../directorio/SelectorChipsCategoria'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'
import { useGuardarMiProfesional } from '../../features/directorio/queries'
import { subirFoto } from '../../lib/storage'
import type { Categoria, Especialidad, Familia, MediosContacto, Profesional, Zona } from '../../types/profesional'

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

export function GestionarPerfil({ userId, familias, categorias, zonas, profesional }: PropsGestion) {
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
    setEspecialidades((actuales) =>
      actuales.map((e) => (e.nombre === nombre ? { ...e, descripcion: descripcionEsp } : e)),
    )
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
        <SelectorChipsCategoria
          familias={familias}
          categorias={categorias}
          valores={categoriaIds}
          onChange={setCategoriaIds}
        />
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
        <p className="text-xs text-neutral-500">
          Busca comunidades enteras o ciudades sueltas y añade las que necesites.
        </p>
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
            Preséntate: tu experiencia, cómo trabajas... Esto no es por especialidad, es lo que un cliente lee al entrar
            en tu ficha.
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
              <span className="text-xs font-medium">
                {subiendoFoto ? 'Subiendo…' : fotoPerfilUrl ? 'Cambiar' : 'Añadir'}
              </span>
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
