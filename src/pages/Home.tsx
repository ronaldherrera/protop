import { Search } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BuscadorZonaUnica } from '../components/directorio/BuscadorZonas'
import { SelectorCategoria } from '../components/directorio/SelectorCategoria'
import { TarjetaProfesional } from '../components/directorio/TarjetaProfesional'
import { EmptyState } from '../components/estado/EmptyState'
import { LoadingState } from '../components/estado/LoadingState'
import { Button } from '../components/ui/Button'
import { baseBoton, tamanosBoton, variantesBoton } from '../components/ui/estilosBoton'
import { useAuth } from '../features/auth/useAuth'
import { useBusquedaProfesionales, useCategorias, useFamilias, useZonas } from '../features/directorio/queries'
import { useModo } from '../features/modo/useModo'
import { useIndiceOficios } from '../features/seo/indice'
import { oficioSeoDeCategoria, rutaOficio } from '../features/seo/oficios'
import { useResumenSolicitudesAbiertas } from '../features/solicitudes/queries'
import { PapeletaPresupuestos } from '../components/portada/PapeletaPresupuestos'
import { TarjetaEnBlanco } from '../components/portada/TarjetaEnBlanco'
import { RejillaOficios } from '../components/portada/RejillaOficios'
import { claseCampo, claseEtiqueta } from '../components/ui/estilosFormulario'
import { cn } from '../lib/cn'
import { useSeo } from '../lib/useSeo'
import { SEO_INICIO } from '../app/seoPaginas'

const MAXIMO_TABLON = 6
const formatoCifra = new Intl.NumberFormat('es-ES')

// Lo que cuesta Protop a un profesional (modelo de negocio: sección 3 del documento de producto).
const CEROS = [
  { cifra: '0 €', texto: 'por publicar y mantener tu ficha' },
  { cifra: '0 %', texto: 'de comisión por los trabajos que consigas' },
  { cifra: '0 €', texto: 'por responder a solicitudes y enviar presupuestos' },
]

// Atajos de la portada: oficios habituales en una reforma o una avería (sin datos de búsquedas detrás).
const OFICIOS_FRECUENTES = [
  { slug: 'fontaneria', nombre: 'Fontanería' },
  { slug: 'electricidad', nombre: 'Electricidad' },
  { slug: 'pintura-decoracion', nombre: 'Pintura' },
  { slug: 'albanileria', nombre: 'Albañilería' },
  { slug: 'climatizacion', nombre: 'Aire acondicionado' },
  { slug: 'urgencias-24h', nombre: 'Urgencias 24 h' },
]

const PASOS_REPUTACION = [
  {
    titulo: 'Contratas a quien quieras',
    texto: 'Por Protop o por tu cuenta, llamando al teléfono de su ficha. No hace falta pasar por nosotros.',
  },
  {
    titulo: 'Subes la factura del trabajo',
    texto: 'Se guarda de forma privada. Nunca aparece en la ficha ni se puede descargar desde fuera.',
  },
  {
    titulo: 'Protop la revisa a mano',
    texto: 'Comprobamos que la factura corresponde a ese profesional y a ese trabajo, y que no está repetida.',
  },
  {
    titulo: 'Se publica tu valoración',
    texto: 'Seis conceptos de 1 a 5, sin comentarios libres. Cuenta igual que la de cualquier otro cliente.',
  },
]

export function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { modo } = useModo()
  const [categoria, setCategoria] = useState('')
  const [familia, setFamilia] = useState('')
  const [zona, setZona] = useState('')

  useSeo(SEO_INICIO.titulo, SEO_INICIO.descripcion, { jsonLd: SEO_INICIO.jsonLd })
  const familias = useFamilias()
  const categorias = useCategorias()
  const zonas = useZonas()
  const indice = useIndiceOficios()
  const resumenAbiertas = useResumenSolicitudesAbiertas()
  const abiertas = resumenAbiertas.data ?? {}
  const totalAbiertas = Object.values(abiertas).reduce((suma, n) => suma + n, 0)

  const familiaActiva = familias.data?.find((f) => f.slug === familia)
  const categoriasBuscadas = categoria
    ? [categoria]
    : familiaActiva
      ? (categorias.data ?? []).filter((c) => c.familiaId === familiaActiva.id).map((c) => c.slug)
      : []

  const profesionales = useBusquedaProfesionales({ categorias: categoriasBuscadas, zona, texto: '' })
  const totalResultados = profesionales.data?.pages[0]?.total ?? 0
  const tablon = (profesionales.data?.pages[0]?.resultados ?? []).slice(0, MAXIMO_TABLON)
  const hayDemo = tablon.some(({ profesional }) => profesional.esDemo)
  const zonaActiva = zonas.data?.find((z) => z.slug === zona)

  function rutaDirectorio() {
    // Con un oficio elegido, su página propia («/electricistas/madrid»): la misma que encuentra Google.
    if (categoria && oficioSeoDeCategoria(categoria)) return rutaOficio(categoria, zona || undefined)
    const parametros = new URLSearchParams()
    if (categoria) parametros.set('categoria', categoria)
    else if (familia) parametros.set('familia', familia)
    if (zona) parametros.set('zona', zona)
    return `/profesionales${parametros.toString() ? `?${parametros}` : ''}`
  }

  function buscar(evento: FormEvent) {
    evento.preventDefault()
    navigate(rutaDirectorio())
  }

  return (
    <div>
      <section className="corcho border-b border-[#a87a4a]" aria-label="El tablón">
        <div className="tablon-clavado mx-auto grid max-w-6xl gap-x-10 gap-y-12 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[1.45fr_1fr] lg:pb-16 lg:pt-14">
          <div className="lg:row-span-2">
            <form
              onSubmit={buscar}
              aria-label="Buscar profesionales"
              className="chincheta rotate-[-0.8deg] rounded-tarjeta bg-white p-6 pt-8 shadow-tarjeta-alzada sm:p-9"
            >
              <h1 className="titular text-[2.6rem] leading-[1.02] text-neutral-900 sm:text-6xl">¿Quién te lo arregla?</h1>
              <p className="mt-4 max-w-lg text-neutral-600">
                El tablón de los profesionales de reformas de toda España. Como el de la ferretería de toda la vida,
                pero con valoraciones de clientes que han enseñado la factura.
              </p>
              {(indice.data?.totalFichas ?? 0) > 0 && (
                <p className="mt-2 text-sm font-medium text-neutral-700">
                  {formatoCifra.format(indice.data!.totalFichas)} negocios en {formatoCifra.format(indice.data!.totalMunicipios)}{' '}
                  municipios, con su teléfono a la vista.
                </p>
              )}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className={claseEtiqueta}>¿Qué necesitas?</span>
                  <SelectorCategoria
                    familias={familias.data ?? []}
                    categorias={categorias.data ?? []}
                    value={categoria}
                    onChange={(valor) => {
                      setCategoria(valor)
                      setFamilia('')
                    }}
                    opcionVacia="Cualquier oficio"
                    className={claseCampo}
                  />
                </label>
                <div>
                  <span className={claseEtiqueta}>¿Dónde?</span>
                  <BuscadorZonaUnica
                    zonas={zonas.data ?? []}
                    valor={zona}
                    onChange={setZona}
                    placeholder="Escribe tu localidad"
                    etiqueta="¿Dónde?"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {OFICIOS_FRECUENTES.map((oficio) => (
                  <button
                    key={oficio.slug}
                    type="button"
                    onClick={() => {
                      setCategoria(categoria === oficio.slug ? '' : oficio.slug)
                      setFamilia('')
                    }}
                    aria-pressed={categoria === oficio.slug}
                    className={cn(
                      'rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset transition-colors',
                      categoria === oficio.slug
                        ? 'bg-brand-600 text-white ring-brand-600'
                        : 'bg-white text-neutral-700 ring-neutral-300 hover:ring-neutral-500',
                    )}
                  >
                    {oficio.nombre}
                  </button>
                ))}
              </div>

              <Button type="submit" tamano="lg" className="mt-6 w-full sm:w-auto">
                <Search className="h-4 w-4" aria-hidden="true" />
                Buscar en el tablón
              </Button>
            </form>
          </div>

          <div className="rotate-[1.8deg] sm:mx-auto sm:max-w-md lg:mx-0 lg:mt-2">
            <PapeletaPresupuestos />
          </div>

          <div className="rotate-[-2.2deg] sm:mx-auto sm:max-w-md lg:mx-0 lg:ml-6">
            <TarjetaEnBlanco />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6" aria-labelledby="titulo-oficios">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="titulo-oficios" className="text-2xl text-neutral-900 sm:text-3xl">
            Todo lo que se arregla en casa
          </h2>
          <Link to="/profesionales" className="text-sm font-semibold text-brand-700 hover:underline">
            Ver todo el directorio
          </Link>
        </div>
        <div className="mt-5">
          <RejillaOficios categorias={categorias.data ?? []} familias={familias.data ?? []} abiertas={abiertas} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6" aria-labelledby="titulo-tablon">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="titulo-tablon" className="text-2xl text-neutral-900 sm:text-3xl">
            {zonaActiva ? `El tablón de ${zonaActiva.nombre}` : 'El tablón de toda España'}
          </h2>
          {!profesionales.isLoading && totalResultados > 0 && (
            <Link
              to={rutaDirectorio()}
              className="text-sm font-semibold text-brand-700 hover:underline"
            >
              Ver {totalResultados === 1 ? 'el resultado' : `los ${totalResultados} resultados`} en el directorio
            </Link>
          )}
        </div>

        {(familias.data ?? []).length > 0 && (
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Filtrar por familia de servicios">
            {[{ slug: '', nombre: 'Todos los oficios', iconoUrl: null, id: 'todas' }, ...(familias.data ?? [])].map((f) => {
              const activa = !categoria && familia === f.slug
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={activa}
                  onClick={() => {
                    setFamilia(f.slug)
                    setCategoria('')
                  }}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset transition-colors',
                    activa
                      ? 'bg-brand-600 text-white ring-brand-600'
                      : 'bg-white text-neutral-700 ring-neutral-300 hover:ring-neutral-500',
                  )}
                >
                  {f.iconoUrl && <img src={f.iconoUrl} alt="" className={cn('h-4 w-4', activa && 'brightness-0 invert')} />}
                  {f.nombre}
                </button>
              )
            })}
          </div>
        )}

        {hayDemo && (
          <p className="mt-4 text-sm text-neutral-600">
            Estas fichas son de ejemplo para que veas cómo funciona el directorio. Todavía no hay profesionales
            reales dados de alta.
          </p>
        )}

        <div className="mt-6">
          {profesionales.isLoading ? (
            <LoadingState etiqueta="Cargando el tablón…" />
          ) : tablon.length === 0 ? (
            <EmptyState
              titulo="Todavía no hay profesionales con ese oficio en esa zona"
              descripcion="Prueba con otra localidad cercana, o pide presupuestos y haremos llegar tu solicitud a profesionales adecuados."
              accion={
                <Link to="/solicitar-presupuesto" className={cn(baseBoton, variantesBoton.primario, tamanosBoton.md)}>
                  Pedir presupuestos
                </Link>
              }
            />
          ) : (
            <div className="tablon-clavado grid gap-x-5 gap-y-7 pt-2 sm:grid-cols-2 lg:grid-cols-3">
              {tablon.map(({ profesional, patrocinado }) => (
                <TarjetaProfesional key={profesional.id} profesional={profesional} patrocinado={patrocinado} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white" aria-labelledby="titulo-reputacion">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 id="titulo-reputacion" className="text-3xl text-neutral-900 sm:text-4xl">
              Aquí las estrellas solo llegan con factura
            </h2>
            <p className="mt-4 max-w-sm text-neutral-600">
              Un perfil nuevo empieza sin puntuación, no con cinco estrellas. Pagar por aparecer destacado
              nunca cambia la nota de nadie.
            </p>
          </div>
          <ol className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {PASOS_REPUTACION.map((paso, indice) => (
              <li key={paso.titulo} className="flex gap-4">
                <span
                  className="titular flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-100 text-lg text-accent-600"
                  aria-hidden="true"
                >
                  {indice + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">{paso.titulo}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">{paso.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {user ? (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          {modo === 'profesional' ? (
            <BandaAccion
              titulo="Solicitudes de tu oficio y tu zona"
              texto="Revisa los trabajos que han publicado los particulares y envía tu propuesta sin coste."
              accion="Ver solicitudes"
              onClick={() => navigate('/profesional')}
            />
          ) : (
            <BandaAccion
              titulo="¿Prefieres que te escriban ellos?"
              texto="Describe el trabajo una vez y recibe propuestas de varios profesionales en tu área, listas para comparar."
              accion="Nueva solicitud"
              onClick={() => navigate('/solicitar-presupuesto')}
            />
          )}
        </section>
      ) : (
        <section className="bg-ink text-white" aria-labelledby="titulo-profesionales">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
            <div>
              <h2 id="titulo-profesionales" className="text-3xl sm:text-5xl">
                Clava tu tarjeta en el tablón
              </h2>
              {totalAbiertas > 0 && (
                <p className="mt-4 inline-flex rounded-full bg-brand-500/15 px-3 py-1 text-sm font-semibold text-brand-200">
                  Ahora mismo hay {totalAbiertas} {totalAbiertas === 1 ? 'trabajo esperando' : 'trabajos esperando'}{' '}
                  presupuesto
                </p>
              )}
              <p className="mt-4 max-w-md text-neutral-300">
                Tu ficha, tus fotos y tus valoraciones, gratis. Responder a solicitudes y enviar presupuestos
                tampoco cuesta nada, y Protop no cobra comisión por los trabajos que consigas.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  to="/acceso?rol=profesional"
                  className={cn(baseBoton, variantesBoton.primario, tamanosBoton.lg)}
                >
                  Publicar mi ficha gratis
                </Link>
                <Link
                  to="/para-profesionales"
                  className="font-semibold text-neutral-200 underline decoration-white/30 underline-offset-4 hover:decoration-white"
                >
                  Cómo funciona para profesionales
                </Link>
              </div>
            </div>
            <dl className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {CEROS.map((cero) => (
                <div key={cero.cifra + cero.texto} className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
                  <dt className="titular text-5xl text-brand-400">{cero.cifra}</dt>
                  <dd className="mt-2 text-sm leading-snug text-neutral-300">{cero.texto}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}
    </div>
  )
}

function BandaAccion({
  titulo,
  texto,
  accion,
  onClick,
}: {
  titulo: string
  texto: string
  accion: string
  onClick: () => void
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-6 rounded-bloque bg-ink p-8 text-white sm:flex-row sm:items-center">
      <div>
        <h2 className="text-2xl sm:text-3xl">{titulo}</h2>
        <p className="mt-2 max-w-xl text-neutral-300">{texto}</p>
      </div>
      <Button type="button" tamano="lg" onClick={onClick} className="shrink-0">
        {accion}
      </Button>
    </div>
  )
}
