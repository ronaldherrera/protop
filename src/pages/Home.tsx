import { CheckCircle2, FileText, Percent, Search, ShieldCheck, Star } from 'lucide-react'
import { type FormEvent, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BuscadorZonaUnica } from '../components/directorio/BuscadorZonas'
import { SelectorCategoria } from '../components/directorio/SelectorCategoria'
import { TarjetaProfesional } from '../components/directorio/TarjetaProfesional'
import { LoadingState } from '../components/estado/LoadingState'
import { Button } from '../components/ui/Button'
import { ordenarProfesionales } from '../features/directorio/filtrado'
import { useCategorias, useFamilias, useProfesionales, useZonas } from '../features/directorio/queries'

export function Home() {
  const navigate = useNavigate()
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
      <section className="border-b border-neutral-200 bg-brand-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="max-w-2xl text-3xl font-bold text-neutral-900 sm:text-4xl">
            Encuentra profesionales de reformas y hogar en Santander
          </h1>
          <p className="mt-3 max-w-xl text-neutral-600">
            El tablón digital de siempre, ahora online: fichas de profesionales, valoraciones con factura y
            presupuestos, todo en un mismo sitio.
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

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
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

          <div className="rounded-xl border border-neutral-200 bg-white p-6">
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
