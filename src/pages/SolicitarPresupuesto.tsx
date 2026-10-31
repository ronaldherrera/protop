import { type FormEvent, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BuscadorZonaUnica } from '../components/directorio/BuscadorZonas'
import { SelectorCategoria } from '../components/directorio/SelectorCategoria'
import { LoadingState } from '../components/estado/LoadingState'
import { Button } from '../components/ui/Button'
import { useCategorias, useFamilias, useZonas } from '../features/directorio/queries'
import { useCrearBorradorSolicitud } from '../features/solicitudes/queries'
import { subirFotoSolicitud } from '../lib/storage'
import { useAuth } from '../features/auth/useAuth'
import { useSeo } from '../lib/useSeo'
import { SEO_SOLICITAR } from '../app/seoPaginas'

const PASOS_SOLICITUD = [
  {
    titulo: 'Describes el trabajo',
    texto: 'Qué hay que hacer, dónde y para cuándo, con fotos si quieres. No hace falta saber de obras.',
  },
  {
    titulo: 'Llega a profesionales de tu zona',
    texto: 'Solo a los de ese oficio que trabajan en tu localidad. Tu dirección y tu teléfono no se publican.',
  },
  {
    titulo: 'Comparas sus propuestas',
    texto: 'Todas con la misma estructura: alcance, materiales, exclusiones, plazo e importe orientativo.',
  },
]

const TOTAL_PASOS = 3

export function SolicitarPresupuesto() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const familias = useFamilias()
  const categorias = useCategorias()
  const zonas = useZonas()
  const crear = useCrearBorradorSolicitud()
  useSeo(SEO_SOLICITAR.titulo, SEO_SOLICITAR.descripcion)

  const [paso, setPaso] = useState(1)
  const [titulo, setTitulo] = useState('')
  const [categoriaElegida, setCategoriaId] = useState<string | null>(null)
  const [descripcion, setDescripcion] = useState('')
  const [zonaElegida, setZonaId] = useState<string | null>(null)
  const [medidasCantidades, setMedidasCantidades] = useState('')
  const [fechaDeseada, setFechaDeseada] = useState('')
  const [fotos, setFotos] = useState<string[]>([])
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const [informacionAdicional, setInformacionAdicional] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Desde una página de oficio («Electricistas en Madrid») el oficio y la localidad llegan ya elegidos.
  const [parametros] = useSearchParams()
  const categoriaInicial = categorias.data?.find((c) => c.slug === parametros.get('categoria'))?.id
  const zonaInicial = zonas.data?.find((z) => z.slug === parametros.get('zona'))?.id
  // Lo que elija la persona manda; mientras no toque el campo, vale lo que trae el enlace.
  const categoriaId = categoriaElegida ?? categoriaInicial ?? ''
  const zonaId = zonaElegida ?? zonaInicial ?? ''

  async function subirFoto(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0]
    if (!archivo || !user) return
    setSubiendoFoto(true)
    try {
      const ruta = await subirFotoSolicitud(user.id, archivo)
      setFotos((actuales) => [...actuales, ruta])
    } catch {
      setError('No se ha podido subir la foto.')
    } finally {
      setSubiendoFoto(false)
    }
  }

  function siguiente() {
    setError(null)
    if (paso === 1 && (!titulo.trim() || !categoriaId || !descripcion.trim())) {
      setError('Rellena el título, el oficio y la descripción.')
      return
    }
    if (paso === 2 && !zonaId) {
      setError('Elige la localidad del trabajo.')
      return
    }
    setPaso((p) => Math.min(p + 1, TOTAL_PASOS))
  }

  function atras() {
    setError(null)
    setPaso((p) => Math.max(p - 1, 1))
  }

  async function guardarBorrador(evento: FormEvent) {
    evento.preventDefault()
    setError(null)
    try {
      const id = await crear.mutateAsync({
        titulo,
        categoriaId,
        zonaId,
        descripcion,
        medidasCantidades,
        fechaDeseada,
        informacionAdicional,
        fotos,
      })
      navigate(`/solicitudes/${id}`)
    } catch {
      setError('No se ha podido guardar la solicitud. Inténtalo de nuevo.')
    }
  }

  if (!user) {
    return (
      <div>
        <section className="corcho border-b border-[#a87a4a]">
          <div className="tablon-clavado mx-auto grid max-w-6xl items-start gap-x-10 gap-y-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:py-16">
            <div>
              <div className="chincheta rotate-[-0.7deg] rounded-tarjeta bg-white p-6 pt-8 shadow-tarjeta-alzada sm:p-9">
                <h1 className="titular text-[2.6rem] leading-[1.02] text-neutral-900 sm:text-6xl">
                  Cuéntalo una vez y que te escriban ellos
                </h1>
                <p className="mt-5 max-w-lg text-lg text-neutral-600">
                  Prepara la ficha de tu trabajo y recibe propuestas de varios profesionales de tu zona, listas para
                  comparar. Sin llamar uno a uno.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Button
                    type="button"
                    tamano="lg"
                    onClick={() => navigate(`/acceso?volver=${encodeURIComponent(`/solicitar-presupuesto?${parametros}`)}`)}
                  >
                    Empezar mi solicitud
                  </Button>
                  <span className="text-sm text-neutral-500">
                    Es gratis. Necesitas una cuenta para recibir las propuestas; si ya la tienes, entra con ella.
                  </span>
                </div>
              </div>
            </div>

            <figure className="m-0 rotate-[1.8deg] lg:mt-8">
              <div className="relative rounded-sm bg-[#fffdf6] p-6 pt-8 shadow-tarjeta-alzada">
                <span
                  className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[-3deg] bg-[#efe3c4]/90 shadow-sm"
                  aria-hidden="true"
                />
                <span className="absolute right-4 top-4 rounded-full bg-metro-100 px-2.5 py-0.5 text-xs font-semibold text-metro-800">
                  Ejemplo
                </span>
                <p className="font-mano text-[2rem] font-bold leading-none text-neutral-900">Cambiar el plato de ducha</p>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                  <dt className="text-neutral-500">Oficio</dt>
                  <dd className="text-neutral-800">Fontanería</dd>
                  <dt className="text-neutral-500">Dónde</dt>
                  <dd className="text-neutral-800">Camargo</dd>
                  <dt className="text-neutral-500">Cuándo</dt>
                  <dd className="text-neutral-800">Antes de Navidad, con flexibilidad</dd>
                  <dt className="text-neutral-500">Medidas</dt>
                  <dd className="text-neutral-800">Plato de 120 × 80 cm</dd>
                </dl>
                <p className="mt-4 border-t-[1.5px] border-dashed border-neutral-200 pt-3 text-sm text-neutral-600">
                  Tu dirección y tu teléfono no aparecen: solo lo necesario para que el profesional sepa si encaja.
                </p>
              </div>
            </figure>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6" aria-labelledby="titulo-como">
          <h2 id="titulo-como" className="text-3xl text-neutral-900 sm:text-4xl">
            Cómo funciona
          </h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {PASOS_SOLICITUD.map((paso, indice) => (
              <li key={paso.titulo} className="border-t-2 border-ink pt-4">
                <p className="titular text-5xl font-extrabold text-brand-500" aria-hidden="true">
                  {indice + 1}
                </p>
                <h3 className="mt-2 text-xl font-bold text-neutral-900">{paso.titulo}</h3>
                <p className="mt-2 text-neutral-600">{paso.texto}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 grid gap-6 rounded-tarjeta bg-carton p-6 ring-1 ring-neutral-200 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Qué cuesta</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Nada. Pedir presupuestos en Protop es gratis, y los profesionales tampoco pagan por responderte.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Si prefieres llamar tú</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Busca en el directorio y contacta directamente con quien quieras: el teléfono está en su ficha.
              </p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (familias.isLoading || categorias.isLoading || zonas.isLoading) {
    return <LoadingState etiqueta="Cargando…" />
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <h1 className="titular text-4xl text-neutral-900 sm:text-5xl">Solicitar presupuestos</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Describe tu trabajo en unos pasos. No hace falta que sepas de obras: cuanta más información des, mejor
        podrán ajustar su propuesta los profesionales.
      </p>

      <div className="mt-6 flex items-center gap-3" aria-label={`Paso ${paso} de ${TOTAL_PASOS}`}>
        {Array.from({ length: TOTAL_PASOS }, (_, indice) => (
          <span
            key={indice}
            className={`h-1.5 flex-1 rounded-full ${indice < paso ? 'bg-brand-500' : 'bg-neutral-300'}`}
            aria-hidden="true"
          />
        ))}
        <span className="shrink-0 text-sm font-semibold text-neutral-600">
          Paso {paso} de {TOTAL_PASOS}
        </span>
      </div>

      <form onSubmit={paso === TOTAL_PASOS ? guardarBorrador : (e) => e.preventDefault()} className="mt-3 flex flex-col gap-4">
        {paso === 1 && (
          <>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Título del trabajo</span>
              <input
                type="text"
                required
                placeholder="Ej. Reformar el baño completo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
              />
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Oficio</span>
              <SelectorCategoria
                familias={familias.data ?? []}
                categorias={categorias.data ?? []}
                value={categoriaId}
                onChange={setCategoriaId}
                campoValor="id"
                opcionVacia="Selecciona un oficio"
                required
              />
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Describe el trabajo</span>
              <textarea
                required
                rows={4}
                placeholder="Qué necesitas, estado actual, qué te gustaría conseguir…"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
              />
            </label>
          </>
        )}

        {paso === 2 && (
          <>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Localidad</span>
              <BuscadorZonaUnica
                zonas={zonas.data ?? []}
                valor={zonaId}
                onChange={setZonaId}
                campoValor="id"
                placeholder="Busca la localidad del proyecto…"
              />
              <span className="mt-1 block text-xs text-neutral-500">
                No pediremos tu dirección exacta — solo lo necesario para que el profesional sepa si encaja.
              </span>
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Medidas o cantidades (si las conoces)</span>
              <input
                type="text"
                placeholder="Ej. 8 m², 2 ventanas…"
                value={medidasCantidades}
                onChange={(e) => setMedidasCantidades(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
              />
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Cuándo te gustaría hacerlo</span>
              <input
                type="text"
                placeholder="Ej. Lo antes posible, en las próximas semanas, soy flexible…"
                value={fechaDeseada}
                onChange={(e) => setFechaDeseada(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
              />
            </label>

            <div className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Fotografías (opcional)</span>
              <div className="flex flex-wrap gap-2">
                {fotos.map((ruta) => (
                  <span key={ruta} className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                    Foto añadida
                  </span>
                ))}
              </div>
              <input type="file" accept="image/*" onChange={subirFoto} disabled={subiendoFoto} className="mt-2" />
            </div>
          </>
        )}

        {paso === 3 && (
          <>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Información adicional (opcional)</span>
              <textarea
                rows={3}
                placeholder="Cualquier otro detalle que ayude a los profesionales a entender el trabajo"
                value={informacionAdicional}
                onChange={(e) => setInformacionAdicional(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
              />
            </label>

            <div className="rounded-xl border border-neutral-200 p-4 text-sm">
              <p className="font-medium text-neutral-900">{titulo}</p>
              <p className="mt-1 text-neutral-600">{descripcion}</p>
              {medidasCantidades && <p className="mt-1 text-neutral-500">Medidas: {medidasCantidades}</p>}
              {fechaDeseada && <p className="mt-1 text-neutral-500">Cuándo: {fechaDeseada}</p>}
            </div>

            <p className="text-xs text-neutral-500">
              Se guardará como borrador. Desde tu área particular podrás revisarla y, cuando quieras, enviarla para
              que los profesionales la vean.
            </p>
          </>
        )}

        {error && <p className="text-sm text-danger-500">{error}</p>}

        <div className="mt-2 flex justify-between">
          {paso > 1 ? (
            <Button type="button" variante="secundario" onClick={atras}>
              Atrás
            </Button>
          ) : (
            <span />
          )}
          {paso < TOTAL_PASOS ? (
            <Button type="button" onClick={siguiente}>
              Siguiente
            </Button>
          ) : (
            <Button type="submit" disabled={crear.isPending}>
              {crear.isPending ? 'Guardando…' : 'Guardar borrador'}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
