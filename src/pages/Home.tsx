import { FileText, Search } from 'lucide-react'
import { type FormEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TarjetaProfesional } from '../components/directorio/TarjetaProfesional'
import { LoadingState } from '../components/estado/LoadingState'
import { Button } from '../components/ui/Button'
import { ordenarProfesionales } from '../features/directorio/filtrado'
import { useCategorias, useProfesionales, useZonas } from '../features/directorio/queries'

export function Home() {
  const navigate = useNavigate()
  const [categoria, setCategoria] = useState('')
  const [zona, setZona] = useState('')

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
              <select
                value={categoria}
                onChange={(evento) => setCategoria(evento.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
              >
                <option value="">Cualquier oficio</option>
                {(categorias.data ?? []).map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex-1 text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Localidad</span>
              <select
                value={zona}
                onChange={(evento) => setZona(evento.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
              >
                <option value="">Cualquier localidad</option>
                {(zonas.data ?? []).map((z) => (
                  <option key={z.slug} value={z.slug}>
                    {z.nombre}
                  </option>
                ))}
              </select>
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
