import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BuscaTuNegocio } from '../components/profesional/BuscaTuNegocio'
import { ListaInteresDestacado } from '../components/profesional/ListaInteresDestacado'
import { baseBoton, tamanosBoton, variantesBoton } from '../components/ui/estilosBoton'
import { useIndiceOficios } from '../features/seo/indice'
import { cn } from '../lib/cn'
import { useSeo } from '../lib/useSeo'
import { SEO_PARA_PROFESIONALES } from '../app/seoPaginas'

const formatoCifra = new Intl.NumberFormat('es-ES')

const PASOS = [
  {
    titulo: 'Publica tu ficha',
    texto: 'Tus oficios, las localidades donde trabajas, fotos de tus trabajos y cómo quieres que te contacten.',
  },
  {
    titulo: 'Recibe contactos y solicitudes',
    texto: 'Los particulares te llaman directamente desde tu ficha, o publican trabajos de tu oficio en tu zona.',
  },
  {
    titulo: 'Gana reputación con cada factura',
    texto: 'Cuando un cliente valora tu trabajo con la factura, la nota sube o baja. Nadie la puede comprar.',
  },
]

const GRATIS = [
  'Crear y mantener tu ficha, con fotos y servicios',
  'Recibir contactos directos de particulares',
  'Ver las solicitudes de tu oficio y tu zona',
  'Responder y enviar presupuestos orientativos',
  'Recibir valoraciones verificadas',
]

export function ParaProfesionales() {
  useSeo(SEO_PARA_PROFESIONALES.titulo, SEO_PARA_PROFESIONALES.descripcion)
  const enlaceAlta = cn(baseBoton, variantesBoton.primario, tamanosBoton.lg)
  const indice = useIndiceOficios()
  const fichas = indice.data?.totalFichas ?? 0
  const municipios = indice.data?.totalMunicipios ?? 0

  return (
    <div>
      <section className="corcho border-b border-[#a87a4a]">
        <div className="tablon-clavado mx-auto grid max-w-6xl items-start gap-x-10 gap-y-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:py-16">
          <div>
            <div className="chincheta rotate-[-0.7deg] rounded-tarjeta bg-white p-6 pt-8 shadow-tarjeta-alzada sm:p-9">
              <h1 className="titular text-[2.6rem] leading-[1.02] text-neutral-900 sm:text-6xl">
                Que te llame quien busca tu oficio
              </h1>
              <p className="mt-5 max-w-lg text-lg text-neutral-600">
                Protop es el tablón donde la gente busca a quién llamar para una obra o una avería. Tu ficha es gratis,
                sin cuota, y no cobramos comisión por los trabajos que consigas.
              </p>
              {fichas > 0 && (
                <p className="mt-4 max-w-lg text-neutral-700">
                  Ya hay <strong className="text-neutral-900">{formatoCifra.format(fichas)} negocios</strong> en{' '}
                  <strong className="text-neutral-900">{formatoCifra.format(municipios)} municipios</strong>. Puede que
                  el tuyo esté entre ellos.
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link to="/acceso?rol=profesional" className={enlaceAlta}>
                  Crear mi ficha gratis
                </Link>
                <span className="text-sm text-neutral-500">Si ya tienes cuenta, entra con ella.</span>
              </div>
            </div>
          </div>

          <div className="rotate-[1.2deg] lg:mt-10">
            <div className="chincheta rounded-tarjeta bg-white p-6 pt-8 shadow-tarjeta-alzada">
              <h2 className="text-2xl text-neutral-900">¿Ya estás en Protop?</h2>
              <p className="mt-2 text-sm text-neutral-600">
                Muchas fichas las hemos creado con los datos públicos de cada negocio. Si encuentras la tuya,
                reclámala gratis y pasa a ser tuya: fotos, servicios, zonas y solicitudes.
              </p>
              <div className="mt-5">
                <BuscaTuNegocio />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6" aria-labelledby="titulo-pasos">
        <h2 id="titulo-pasos" className="text-3xl text-neutral-900 sm:text-4xl">
          Cómo funciona
        </h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3">
          {PASOS.map((paso, indice) => (
            <li key={paso.titulo} className="border-t-2 border-ink pt-4">
              <p className="titular text-5xl font-extrabold text-brand-500" aria-hidden="true">
                {indice + 1}
              </p>
              <h3 className="mt-2 text-xl font-bold text-neutral-900">{paso.titulo}</h3>
              <p className="mt-2 text-neutral-600">{paso.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-neutral-200 bg-white" aria-labelledby="titulo-precio">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 id="titulo-precio" className="text-3xl text-neutral-900 sm:text-4xl">
              Qué es gratis y qué no
            </h2>
            <p className="mt-4 max-w-md text-neutral-600">
              Lo esencial no cuesta nada, ni ahora ni después. Responder a una solicitud nunca tiene coste.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Gratis</h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {GRATIS.map((elemento) => (
                  <li key={elemento} className="flex gap-2 text-sm text-neutral-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                    {elemento}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">De pago, si quieres (próximamente)</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                El Plan Destacado: apareces entre los primeros cuando alguien busca tu oficio, siempre marcado
                como «Patrocinado». Se paga al mes, por oficio, y lo das de baja cuando quieras.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                Pagar por destacar no cambia tu puntuación ni la de nadie.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6" aria-labelledby="titulo-destacado">
        <div className="grid gap-8 rounded-tarjeta bg-white p-6 shadow-tarjeta ring-1 ring-neutral-200 sm:p-9 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 id="titulo-destacado" className="text-3xl text-neutral-900">
              Plan Destacado: sal el primero en tu oficio
            </h2>
            <p className="mt-3 text-neutral-600">
              Cuando alguien busca tu oficio en tu zona, tu ficha aparece arriba, entre como mucho tres destacados,
              marcada como «Patrocinado». Pagas al mes, por oficio, sin permanencia.
            </p>
            <p className="mt-3 text-neutral-600">
              Todavía no se puede contratar. Apúntate y te avisamos el primero, con el precio de tu oficio.
            </p>
          </div>
          <ListaInteresDestacado />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-tarjeta bg-ink p-8 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl">Tu ficha está lista en unos minutos</h2>
            <p className="mt-2 text-neutral-300">Con una sola cuenta puedes ser profesional y también pedir presupuestos.</p>
          </div>
          <Link to="/acceso?rol=profesional" className={cn(enlaceAlta, 'shrink-0')}>
            Publicar mi ficha gratis
          </Link>
        </div>
      </section>
    </div>
  )
}
