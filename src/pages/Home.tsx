import { CheckCircle2, FileText, Percent, Search, ShieldCheck, Star } from 'lucide-react'
import { type FormEvent, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BuscadorZonaUnica } from '../components/directorio/BuscadorZonas'
import { SelectorCategoria } from '../components/directorio/SelectorCategoria'
import { TarjetaProfesional } from '../components/directorio/TarjetaProfesional'
import { LoadingState } from '../components/estado/LoadingState'
import { Button } from '../components/ui/Button'
import { useAuth } from '../features/auth/useAuth'
import { ordenarProfesionales } from '../features/directorio/filtrado'
import { useCategorias, useFamilias, useProfesionales, useZonas } from '../features/directorio/queries'
import { useModo } from '../features/modo/useModo'

export function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { modo } = useModo()
  const [categoria, setCategoria] = useState('')
  const [zona, setZona] = useState('')

  const familias = useFamilias()
  const categorias = useCategorias()
  const zonas = useZonas()
  const profesionales = useProfesionales()

  const destacados = useMemo(
    () => ordenarProfesionales(profesionales.data ?? []).slice(0, 3),
    [profesionales.data],
  )

  function buscar(evento: FormEvent) {
    evento.preventDefault()
    const parametros = new URLSearchParams()
    if (categoria) parametros.set('categoria', categoria)
    if (zona) parametros.set('zona', zona)
    navigate(`/profesionales${parametros.toString() ? `?${parametros}` : ''}`)
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-50">
        <img
          src="/fotos/hero-profesional.webp"
          alt="Profesional de reformas sonriendo con los brazos cruzados en una vivienda reformada y luminosa"
          className="absolute inset-0 h-full w-full object-cover object-[78%_15%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-50 from-35% via-brand-50/90 via-65% to-brand-50/10" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
              El profesional que necesitas, a la vuelta de la esquina
            </h1>
            <p className="mt-4 text-lg text-neutral-700">
              Fichas reales, valoraciones con factura y presupuestos claros. Sin comisiones, sin
              sorpresas, sin llamar uno a uno.
            </p>

            <form
              onSubmit={buscar}
              className="mt-8 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-end"
            >
              <label className="flex-1 text-sm">
                <span className="mb-1 block font-medium text-neutral-700">Oficio o servicio</span>
                <SelectorCategoria
                  familias={familias.data ?? []}
                  categorias={categorias.data ?? []}
                  value={categoria}
                  onChange={setCategoria}
                />
              </label>

              <label className="flex-1 text-sm">
                <span className="mb-1 block font-medium text-neutral-700">Localidad</span>
                <BuscadorZonaUnica zonas={zonas.data ?? []} valor={zona} onChange={setZona} placeholder="Cualquier localidad" />
              </label>

              <Button type="submit" tamano="lg" className="sm:w-auto">
                <Search className="h-4 w-4" aria-hidden="true" />
                Buscar un profesional
              </Button>
            </form>

            <div className="mt-4">
              <Button
                type="button"
                variante="secundario"
                onClick={() => navigate('/solicitar-presupuesto')}
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                Solicitar presupuestos
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-xl font-semibold text-neutral-900">Explora por familia de servicios</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {(familias.data ?? []).map((familia) => (
            <Link
              key={familia.id}
              to={`/profesionales?familia=${familia.slug}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-white p-4 text-center hover:shadow-md"
            >
              {familia.iconoUrl && <img src={familia.iconoUrl} alt="" className="h-10 w-10" />}
              <span className="text-sm font-medium text-neutral-800">{familia.nombre}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <img
            src="/fotos/reforma-en-marcha.webp"
            alt="Reforma de una vivienda en marcha, con herramientas y materiales de obra"
            className="aspect-video w-full rounded-2xl object-cover shadow-sm lg:order-2"
            loading="lazy"
          />
          <div className="lg:order-1">
            <h2 className="text-2xl font-bold text-neutral-900">Trabajos de verdad, no fotos de catálogo</h2>
            <p className="mt-3 text-neutral-600">
              Cada ficha de Protop es un profesional real trabajando en tu zona. Las valoraciones
              solo se publican si hay una factura detrás — nada de estrellas compradas ni perfiles
              inflados.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {user ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            {modo === 'profesional' ? (
              <>
                <h2 className="text-lg font-semibold text-neutral-900">Solicitudes disponibles para ti</h2>
                <p className="mt-2 text-sm text-neutral-700">
                  Revisa las solicitudes abiertas de tu oficio y zona, o explora todas libremente desde tu perfil.
                </p>
                <Button type="button" className="mt-4" onClick={() => navigate('/profesional')}>
                  Ver mis solicitudes
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-neutral-900">¿Necesitas un presupuesto?</h2>
                <p className="mt-2 text-sm text-neutral-700">
                  Describe el trabajo y recibe propuestas de varios profesionales, sin llamar uno a uno.
                </p>
                <Button type="button" className="mt-4" onClick={() => navigate('/solicitar-presupuesto')}>
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  Nueva solicitud
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <img
                src="/fotos/profesional-cliente.webp"
                alt="Profesional mostrando un presupuesto a una clienta en su vivienda"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h2 className="text-lg font-semibold text-neutral-900">Para particulares</h2>
                <ul className="mt-4 flex flex-col gap-3 text-sm text-neutral-700">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                    Solo valoraciones respaldadas por factura y revisadas por Protop — no estrellas compradas.
                  </li>
                  <li className="flex items-start gap-2">
                    <Search className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                    Busca y contacta directamente con el profesional, siempre gratis.
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                    O pide varios presupuestos y compáralos en un mismo sitio, sin llamar uno a uno.
                  </li>
                </ul>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <img
                src="/fotos/herramientas-flatlay.webp"
                alt="Herramientas de profesionales de reformas y mantenimiento del hogar"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h2 className="text-lg font-semibold text-neutral-900">Para profesionales</h2>
                <ul className="mt-4 flex flex-col gap-3 text-sm text-neutral-700">
                  <li className="flex items-start gap-2">
                    <Percent className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                    Sin comisión por el trabajo: lo que cobras es tuyo, el 100%.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                    Registrarte, responder solicitudes y enviar presupuestos no cuesta nada.
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                    Tu reputación depende de trabajos reales verificados, no de cuánto pagues por destacar.
                  </li>
                </ul>
                <Button type="button" className="mt-4" onClick={() => navigate('/acceso?rol=profesional')}>
                  Publicar mi ficha gratis
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">Algunos profesionales del directorio</h2>
        </div>
        {destacados.some((profesional) => profesional.esDemo) && (
          <p className="mb-6 text-sm text-neutral-500">
            Datos de demostración para probar el directorio — todavía no hay profesionales reales dados de alta.
          </p>
        )}
        {profesionales.isLoading ? (
          <LoadingState etiqueta="Cargando profesionales…" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((profesional) => (
              <TarjetaProfesional key={profesional.id} profesional={profesional} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
