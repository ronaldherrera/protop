import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BuscadorZonaUnica } from '../components/directorio/BuscadorZonas'
import { SelectorCategoria } from '../components/directorio/SelectorCategoria'
import { LoadingState } from '../components/estado/LoadingState'
import { Button } from '../components/ui/Button'
import { useCategorias, useFamilias, useZonas } from '../features/directorio/queries'
import { useCrearBorradorSolicitud } from '../features/solicitudes/queries'
import { subirFotoSolicitud } from '../lib/storage'
import { useAuth } from '../features/auth/useAuth'

const TOTAL_PASOS = 3

export function SolicitarPresupuesto() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const familias = useFamilias()
  const categorias = useCategorias()
  const zonas = useZonas()
  const crear = useCrearBorradorSolicitud()

  const [paso, setPaso] = useState(1)
  const [titulo, setTitulo] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [zonaId, setZonaId] = useState('')
  const [medidasCantidades, setMedidasCantidades] = useState('')
  const [fechaDeseada, setFechaDeseada] = useState('')
  const [fotos, setFotos] = useState<string[]>([])
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const [informacionAdicional, setInformacionAdicional] = useState('')
  const [error, setError] = useState<string | null>(null)

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
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-neutral-900">Solicitar presupuestos</h1>
        <p className="mt-2 text-neutral-600">
          Necesitas una cuenta para preparar tu solicitud y recibir propuestas de varios profesionales.
        </p>
        <Button type="button" className="mt-4" onClick={() => navigate('/acceso')}>
          Acceder o crear cuenta
        </Button>
      </div>
    )
  }

  if (familias.isLoading || categorias.isLoading || zonas.isLoading) {
    return <LoadingState etiqueta="Cargando…" />
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Solicitar presupuestos</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Describe tu trabajo en unos pasos. No hace falta que sepas de obras: cuanta más información des, mejor
        podrán ajustar su propuesta los profesionales.
      </p>

      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-neutral-400">
        Paso {paso} de {TOTAL_PASOS}
      </p>

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
