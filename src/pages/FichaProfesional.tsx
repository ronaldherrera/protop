import { Check, ChevronRight, Globe, Mail, MapPin, Phone, Share2 } from 'lucide-react'
import { type ComponentType, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CarruselFotos } from '../components/directorio/CarruselFotos'
import { AvisarProfesional } from '../components/directorio/AvisarProfesional'
import { DesgloseValoraciones } from '../components/directorio/DesgloseValoraciones'
import { PedirBajaFicha } from '../components/directorio/PedirBajaFicha'
import { IconoCategoria } from '../components/directorio/IconoCategoria'
import { ListaValoracionesPublicas } from '../components/directorio/ListaValoracionesPublicas'
import { EmptyState } from '../components/estado/EmptyState'
import { ErrorState } from '../components/estado/ErrorState'
import { LoadingState } from '../components/estado/LoadingState'
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon'
import { FormularioComentario } from '../components/trabajos/FormularioComentario'
import { TarjetaTrabajoPublico } from '../components/trabajos/TarjetaTrabajoPublico'
import { Avatar } from '../components/ui/Avatar'
import { imagenDeProfesional, portadaDeProfesional } from '../features/directorio/imagen'
import { Button } from '../components/ui/Button'
import { baseBoton, tamanosBoton, variantesBoton } from '../components/ui/estilosBoton'
import { formatearPuntuacion, textoTrabajosValorados } from '../lib/formatoPuntuacion'
import { FormularioValoracion } from '../components/valoraciones/FormularioValoracion'
import { useAuth } from '../features/auth/useAuth'
import { useMiProfesional, useProfesional } from '../features/directorio/queries'
import { registrarVisita } from '../features/directorio/visitas'
import { SITIO } from '../features/blog/seo'
import { oficioSeoDeCategoria, rutaOficio } from '../features/seo/oficios'
import { nombreLegible } from '../features/seo/indice'
import { HuecoGoogle } from '../components/monetizacion/HuecoGoogle'
import { EsTuNegocio } from '../components/directorio/EsTuNegocio'
import { MasProfesionalesCerca } from '../components/directorio/MasProfesionalesCerca'
import { useTrabajosDeProfesional } from '../features/trabajos/queries'
import { useValoracionesPublicas } from '../features/valoraciones/queries'
import { cn } from '../lib/cn'
import { useSeo } from '../lib/useSeo'
import type { MediosContacto, Profesional } from '../types/profesional'

const TRABAJOS_POR_PAGINA = 5

type MedioContacto = {
  id: string
  etiqueta: string
  detalle?: string
  href: string
  Icono: ComponentType<{ className?: string }>
  externo: boolean
}

function mediosDeContacto(contacto: MediosContacto): MedioContacto[] {
  const medios: MedioContacto[] = []
  if (contacto.telefono) {
    medios.push({ id: 'telefono', etiqueta: 'Llamar', detalle: contacto.telefono, href: `tel:${contacto.telefono}`, Icono: Phone, externo: false })
  }
  if (contacto.whatsapp) {
    medios.push({
      id: 'whatsapp',
      etiqueta: 'WhatsApp',
      href: `https://wa.me/${contacto.whatsapp.replace(/[^0-9]/g, '')}`,
      Icono: WhatsAppIcon,
      externo: true,
    })
  }
  if (contacto.email) {
    medios.push({ id: 'email', etiqueta: 'Email', detalle: contacto.email, href: `mailto:${contacto.email}`, Icono: Mail, externo: false })
  }
  if (contacto.web) {
    medios.push({ id: 'web', etiqueta: 'Sitio web', href: contacto.web, Icono: Globe, externo: true })
  }
  return medios
}

/** schema.org del negocio. La valoración solo se incluye si hay trabajos valorados de verdad (se ven en la ficha). */
function datosEstructurados(profesional: Profesional) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: profesional.nombreComercial,
    description: profesional.descripcion || profesional.descripcionBreve,
    url: `${SITIO}/profesionales/${profesional.slug}`,
    image: new URL(profesional.fotoPerfilUrl ?? imagenDeProfesional(profesional), SITIO).href,
    telephone: profesional.contacto.telefono,
    email: profesional.contacto.email,
    address: { '@type': 'PostalAddress', addressLocality: profesional.localidad, addressCountry: 'ES' },
    areaServed: profesional.zonasTrabajoNombres.map((nombre) => ({ '@type': 'City', name: nombre })),
    ...(profesional.puntuacionGlobal !== null && profesional.trabajosValorados > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(profesional.puntuacionGlobal.toFixed(2)),
            bestRating: 5,
            worstRating: 1,
            ratingCount: profesional.trabajosValorados,
          },
        }
      : {}),
  }
}

export function FichaProfesional() {
  const { slug } = useParams<{ slug: string }>()
  const { data: profesional, isLoading, isError } = useProfesional(slug)
  const { user } = useAuth()
  const miProfesional = useMiProfesional()
  const trabajos = useTrabajosDeProfesional(profesional?.id)
  const valoracionesPublicas = useValoracionesPublicas(profesional?.id)
  const esPropia = Boolean(user && profesional && miProfesional.data?.slug === profesional.slug)
  const [valorando, setValorando] = useState(false)
  const [trabajosVisibles, setTrabajosVisibles] = useState(TRABAJOS_POR_PAGINA)
  const [enlaceCopiado, setEnlaceCopiado] = useState(false)
  const [pidiendoBaja, setPidiendoBaja] = useState(false)

  const slugVisitable = profesional && !profesional.esDemo && !esPropia ? profesional.slug : undefined
  useEffect(() => {
    if (slugVisitable) registrarVisita(slugVisitable)
  }, [slugVisitable])

  useSeo(
    profesional ? `${profesional.nombreComercial}: ${profesional.categoriaNombre} en ${profesional.localidad} | Protop` : 'Ficha profesional | Protop',
    profesional
      ? `${profesional.descripcionBreve} ${profesional.puntuacionGlobal !== null ? `${profesional.trabajosValorados} trabajos valorados con factura.` : 'Contacto directo y gratis en Protop.'}`
      : 'Ficha de un profesional de reformas y reparaciones en Protop.',
    {
      // Las fichas de ejemplo no son negocios reales: fuera de Google y sin datos estructurados.
      noIndex: !profesional || profesional.esDemo,
      jsonLd: profesional && !profesional.esDemo ? datosEstructurados(profesional) : undefined,
      imagen: profesional ? (profesional.fotoPerfilUrl ?? imagenDeProfesional(profesional)) : undefined,
    },
  )

  if (isLoading) {
    return <LoadingState etiqueta="Cargando ficha…" />
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <ErrorState descripcion="No hemos podido cargar esta ficha. Inténtalo de nuevo en unos segundos." />
      </div>
    )
  }

  if (!profesional) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <EmptyState
          titulo="No encontramos esta ficha"
          descripcion="Puede que el enlace esté mal escrito o que el profesional ya no esté disponible."
          accion={
            <Link to="/profesionales" className={cn(baseBoton, variantesBoton.secundario, tamanosBoton.md)}>
              Volver al directorio
            </Link>
          }
        />
      </div>
    )
  }

  // En las fichas de ejemplo no enlazamos los teléfonos: podrían pertenecer a alguien real.
  const portada = portadaDeProfesional(profesional)
  const oficioPrincipal = oficioSeoDeCategoria(profesional.oficioPrincipal)
  const medios = profesional.esDemo ? [] : mediosDeContacto(profesional.contacto)
  const [principal, ...secundarios] = medios

  async function compartir() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: `${profesional!.nombreComercial} en Protop`, url })
      } catch {
        // El usuario ha cerrado el diálogo de compartir: no es un error.
      }
      return
    }
    await navigator.clipboard.writeText(url)
    setEnlaceCopiado(true)
    window.setTimeout(() => setEnlaceCopiado(false), 2500)
  }

  return (
    <div className="pb-24 lg:pb-0">
      {profesional.sinReclamar && !profesional.esDemo && (
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 text-sm sm:px-6">
            <p className="text-neutral-700">
              Ficha creada por Protop con datos públicos del negocio
              {profesional.datosDeOpenStreetMap && (
                <>
                  {' '}
                  (©{' '}
                  <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline">
                    colaboradores de OpenStreetMap
                  </a>
                  )
                </>
              )}
              . ¿Es el tuyo?
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <Link to={`/reclamar/${profesional.slug}`} className="font-semibold text-brand-700 hover:underline">
                Reclámala gratis
              </Link>
              <button
                type="button"
                onClick={() => setPidiendoBaja(true)}
                className="font-medium text-neutral-600 hover:text-neutral-900 hover:underline"
              >
                Pedir que la borremos
              </button>
            </div>
          </div>
        </div>
      )}

      {(profesional.esDemo || esPropia) && (
        <div className={cn('border-b', profesional.esDemo ? 'border-warning-500/20 bg-warning-100' : 'border-brand-200 bg-brand-50')}>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm sm:px-6">
            {profesional.esDemo ? (
              <p className="text-warning-500">
                Ficha de ejemplo. Este profesional no existe y sus datos de contacto están desactivados.
              </p>
            ) : (
              <>
                <p className="text-brand-800">Esta es tu ficha pública, tal como la ve un particular.</p>
                <Link to="/profesional" className="font-semibold text-brand-800 hover:underline">
                  Volver a mi área
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <section className="corcho border-b border-[#a87a4a]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_20rem] lg:gap-12">
          <div className="min-w-0 rotate-[-0.6deg] rounded-tarjeta bg-white p-6 pt-8 shadow-tarjeta-alzada sm:p-9">
            {oficioPrincipal && (
              <nav aria-label="Ruta de navegación" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-neutral-500">
                <Link to={rutaOficio(oficioPrincipal.categoria)} className="hover:text-neutral-800 hover:underline">
                  {oficioPrincipal.plural}
                </Link>
                {profesional.zonasTrabajo[0] && (
                  <>
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    <Link
                      to={rutaOficio(oficioPrincipal.categoria, profesional.zonasTrabajo[0])}
                      className="hover:text-neutral-800 hover:underline"
                    >
                      {nombreLegible(profesional.zonasTrabajoNombres[0] ?? '')}
                    </Link>
                  </>
                )}
              </nav>
            )}
            {portada.tipo !== 'foto' && (
              <img
                src={portada.src}
                alt={portada.tipo === 'logo' ? `Logotipo de ${profesional.nombreComercial}` : ''}
                width={1200}
                height={560}
                className={cn(
                  'mb-6 aspect-[15/7] w-full rounded-xl',
                  portada.tipo === 'logo' ? 'bg-white object-contain p-3 ring-1 ring-neutral-100' : 'object-cover',
                )}
              />
            )}
            <div className="flex flex-wrap gap-2">
              {profesional.oficios.map((oficio) => (
                <Link
                  key={oficio.id}
                  to={rutaOficio(oficio.slug, profesional.zonasTrabajo[0])}
                  className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-200"
                >
                  <IconoCategoria iconoUrl={oficio.iconoUrl} nombre={oficio.nombre} className="h-4 w-4" />
                  {oficio.nombre}
                </Link>
              ))}
            </div>

            <div className="mt-5 flex items-start gap-5">
              <div className="min-w-0 flex-1">
                <h1 className="titular text-5xl leading-[0.98] text-neutral-900 sm:text-6xl">
                  {profesional.nombreComercial}
                </h1>
                <p className="mt-3 flex items-start gap-1.5 text-neutral-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" aria-hidden="true" />
                  <span>
                    {profesional.localidad}
                    {profesional.zonasTrabajoNombres.length > 0 && (
                      <> · trabaja en {profesional.zonasTrabajoNombres.join(', ')}</>
                    )}
                  </span>
                </p>
              </div>
              {portada.tipo !== 'logo' && (
                <Avatar
                  nombre={profesional.nombreComercial}
                  fotoUrl={profesional.fotoPerfilUrl}
                  className="hidden h-24 w-24 shrink-0 rounded-tarjeta object-cover text-3xl sm:flex"
                />
              )}
            </div>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-700">
              {profesional.descripcion || profesional.descripcionBreve}
            </p>
          </div>

          <aside className="lg:self-start" aria-label="Contacto directo">
            <div className="relative rotate-[1.2deg] rounded-sm bg-[#fffdf6] p-5 pt-7 shadow-tarjeta-alzada">
              <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-4deg] bg-[#efe3c4]/90 shadow-sm" aria-hidden="true" />
              <h2 className="font-mano text-3xl font-bold leading-none text-neutral-900">Contacto directo</h2>
              <p className="mt-1 text-sm text-neutral-600">Gratis y sin intermediarios: hablas con el profesional.</p>

              {medios.length === 0 ? (
                <p className="mt-4 text-sm text-neutral-500">
                  {profesional.esDemo ? 'El contacto está desactivado en las fichas de ejemplo.' : 'Este profesional todavía no ha añadido datos de contacto.'}
                </p>
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  {medios.map((medio, indice) => (
                    <EnlaceContacto
                      key={medio.id}
                      medio={medio}
                      destacado={indice === 0}
                      onClick={() => registrarVisita(profesional.slug, 'contacto')}
                    />
                  ))}
                </div>
              )}

              {profesional.sinReclamar && !profesional.esDemo && <AvisarProfesional profesional={profesional} />}

              <button
                type="button"
                onClick={compartir}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 hover:text-neutral-950"
              >
                {enlaceCopiado ? <Check className="h-4 w-4 text-success-500" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
                {enlaceCopiado ? 'Enlace copiado' : 'Compartir ficha'}
              </button>
            </div>

            {profesional.sinReclamar && !profesional.esDemo && (
              <EsTuNegocio slug={profesional.slug} />
            )}
          </aside>
        </div>
      </section>

      {/* Misma columna que la cabecera: deja libre el ancho del contacto (20rem + 3rem de hueco). */}
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10 sm:px-6 lg:pr-[calc(23rem+1.5rem)]">
        <section aria-labelledby="titulo-reputacion">
          <h2 id="titulo-reputacion" className="text-3xl text-neutral-900">
            Reputación
          </h2>
          <div className="mt-5 rounded-tarjeta bg-carton p-6 shadow-tarjeta ring-1 ring-neutral-200">
            {profesional.puntuacionGlobal === null ? (
              <div>
                <p className="titular text-3xl font-extrabold text-neutral-900">Sin valoraciones verificadas</p>
                <p className="mt-2 max-w-lg text-sm text-neutral-600">
                  Ningún cliente ha valorado todavía un trabajo con factura revisada. Los perfiles nuevos empiezan
                  así, sin puntuación.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
                <p className="titular cifras text-7xl font-extrabold leading-none text-neutral-900">
                  {formatearPuntuacion(profesional.puntuacionGlobal)}
                  <span className="text-3xl text-neutral-400">/5</span>
                </p>
                <div className="pb-1">
                  <p className="font-semibold text-neutral-900">{textoTrabajosValorados(profesional.trabajosValorados)}</p>
                  {valoracionesPublicas.data && <ListaValoracionesPublicas valoraciones={valoracionesPublicas.data} />}
                </div>
              </div>
            )}

            {Object.keys(profesional.desglosePorConcepto).length > 0 && (
              <div className="mt-8 border-t border-neutral-200 pt-6">
                <DesgloseValoraciones desglose={profesional.desglosePorConcepto} />
              </div>
            )}

            <p className="mt-6 text-xs leading-relaxed text-neutral-500">
              El índice refleja experiencias de clientes con factura revisada por Protop. No es una garantía del
              resultado de futuros trabajos, y los anuncios no lo modifican.
            </p>
          </div>

          {!profesional.esDemo && !esPropia && (
            <div className="mt-4">
              {user ? (
                <Button type="button" variante="secundario" onClick={() => setValorando(true)}>
                  Valorar un trabajo con factura
                </Button>
              ) : (
                <Link to="/acceso" className="text-sm font-semibold text-brand-700 hover:underline">
                  Entra en tu cuenta para valorar un trabajo con este profesional
                </Link>
              )}
            </div>
          )}
        </section>

        {!profesional.esDemo && <HuecoGoogle />}

        {profesional.fotosTrabajos.length > 0 && (
          <section aria-labelledby="titulo-fotos">
            <h2 id="titulo-fotos" className="text-3xl text-neutral-900">
              Fotos de trabajos
            </h2>
            <div className="mt-5">
              <CarruselFotos fotos={profesional.fotosTrabajos} nombreAlt={profesional.nombreComercial} />
            </div>
          </section>
        )}

        {profesional.especialidades.length > 0 && (
          <section aria-labelledby="titulo-especialidades">
            <h2 id="titulo-especialidades" className="text-3xl text-neutral-900">
              Especialidades
            </h2>
            <ul className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {profesional.especialidades.map((especialidad) => (
                <li key={especialidad.nombre} className="border-l-2 border-brand-500 pl-4">
                  <h3 className="text-lg font-bold text-neutral-900">{especialidad.nombre}</h3>
                  {especialidad.descripcion && (
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">{especialidad.descripcion}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {profesional.distintivos.length > 0 && (
          <section aria-labelledby="titulo-distintivos">
            <h2 id="titulo-distintivos" className="text-3xl text-neutral-900">
              Qué ha comprobado Protop
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {profesional.distintivos.map((distintivo) => (
                <li key={distintivo.id} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-neutral-900">{distintivo.etiqueta}</p>
                    <p className="text-sm text-neutral-600">{distintivo.explicacion}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {trabajos.data && trabajos.data.length > 0 && (
          <section aria-labelledby="titulo-trabajos">
            <h2 id="titulo-trabajos" className="text-3xl text-neutral-900">
              Trabajos publicados
            </h2>
            <div className="mt-5 flex flex-col gap-4">
              {trabajos.data.slice(0, trabajosVisibles).map((trabajo) => (
                <div key={trabajo.id}>
                  <TarjetaTrabajoPublico trabajo={trabajo} />
                  {user && trabajo.clienteId === user.id && !trabajo.comentario && (
                    <div className="mt-2">
                      <FormularioComentario trabajoId={trabajo.id} profesionalId={profesional.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {trabajosVisibles < trabajos.data.length && (
              <div className="mt-4 flex justify-center">
                <Button
                  type="button"
                  variante="secundario"
                  onClick={() => setTrabajosVisibles((v) => v + TRABAJOS_POR_PAGINA)}
                >
                  Ver más trabajos
                </Button>
              </div>
            )}
          </section>
        )}

        {!profesional.esDemo && <MasProfesionalesCerca profesional={profesional} />}
      </div>

      {pidiendoBaja && (
        <PedirBajaFicha
          profesionalId={profesional.id}
          nombre={profesional.nombreComercial}
          onCerrar={() => setPidiendoBaja(false)}
        />
      )}

      {valorando && <FormularioValoracion profesionalId={profesional.id} onCerrar={() => setValorando(false)} />}

      {principal && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur lg:hidden">
          <EnlaceContacto
            medio={principal}
            destacado
            className="flex-1"
            onClick={() => registrarVisita(profesional.slug, 'contacto')}
          />
          {secundarios[0] && (
            <EnlaceContacto medio={secundarios[0]} compacto onClick={() => registrarVisita(profesional.slug, 'contacto')} />
          )}
        </div>
      )}
    </div>
  )
}

function EnlaceContacto({
  medio,
  destacado = false,
  compacto = false,
  className,
  onClick,
}: {
  medio: MedioContacto
  destacado?: boolean
  compacto?: boolean
  className?: string
  onClick?: () => void
}) {
  const { Icono } = medio
  return (
    <a
      href={medio.href}
      target={medio.externo ? '_blank' : undefined}
      rel={medio.externo ? 'noreferrer' : undefined}
      aria-label={compacto ? medio.etiqueta : undefined}
      onClick={onClick}
      className={cn(
        baseBoton,
        destacado ? variantesBoton.primario : variantesBoton.secundario,
        tamanosBoton.lg,
        compacto ? 'w-12 px-0' : 'justify-start',
        className,
      )}
    >
      <Icono className="h-5 w-5 shrink-0" aria-hidden="true" />
      {!compacto && (
        <>
          <span>{medio.etiqueta}</span>
          {medio.detalle && <span className="ml-auto truncate text-sm font-normal opacity-80">{medio.detalle}</span>}
        </>
      )}
    </a>
  )
}
