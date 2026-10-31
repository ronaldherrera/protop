import { ChevronDown, FileText } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { HuecoGoogle } from '../components/monetizacion/HuecoGoogle'
import { baseBoton, tamanosBoton, variantesBoton } from '../components/ui/estilosBoton'
import { formatearFecha, seccionesDe } from '../features/blog/anclas'
import { H2 } from '../features/blog/ArticuloUI'
import { ARTICULOS } from '../features/blog/articulos'
import { obtenerPost, POSTS, type PostBlog } from '../features/blog/posts'
import { datosEstructuradosGuia, tituloGuia } from '../features/blog/seo'
import { cn } from '../lib/cn'
import { rutaOficio } from '../features/seo/oficios'
import { useSeo } from '../lib/useSeo'

function Indice({ secciones }: { secciones: { id: string; texto: string }[] }) {
  if (secciones.length < 3) return null

  return (
    <nav aria-label="En esta guía" className="mt-8 rounded-tarjeta bg-white p-5 ring-1 ring-neutral-200">
      <p className="font-semibold text-neutral-900">En esta guía</p>
      <ol className="mt-3 flex flex-col gap-1.5 text-[0.95rem]">
        {secciones.map((seccion) => (
          <li key={seccion.id}>
            <a href={`#${seccion.id}`} className="text-brand-700 hover:underline">
              {seccion.texto}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function BlogPost() {
  const { slug } = useParams()
  const post = obtenerPost(slug)

  useSeo(post ? tituloGuia(post) : 'Guías | Protop', post?.metaDescripcion ?? '', {
    jsonLd: post ? datosEstructuradosGuia(post) : undefined,
    imagen: post?.imagen,
  })

  if (!post) return <Navigate to="/blog" replace />

  const Articulo = ARTICULOS[post.slug]
  const relacionados = post.relacionados
    .map((s) => POSTS.find((p) => p.slug === s))
    .filter((p): p is PostBlog => Boolean(p))
  const actualizado = post.fechaActualizacion && post.fechaActualizacion !== post.fechaPublicacion

  return (
    <div>
      <section className="corcho border-b border-[#a87a4a]">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <nav aria-label="Estás en" className="text-sm text-white/90 [text-shadow:0_1px_2px_rgb(0_0_0/0.35)]">
            <Link to="/" className="hover:underline">
              Inicio
            </Link>{' '}
            ›{' '}
            <Link to="/blog" className="hover:underline">
              Guías
            </Link>{' '}
            › <span>{post.categoriaNombre}</span>
          </nav>
          <div className="chincheta mt-6 rotate-[-0.5deg] rounded-tarjeta bg-white p-6 pt-8 shadow-tarjeta-alzada sm:p-9">
            <p className="text-sm font-semibold text-brand-700">Si buscas {post.oficioNombre}</p>
            <h1 className="titular mt-2 text-[2.1rem] leading-[1.05] text-neutral-900 sm:text-5xl">{post.titulo}</h1>
            <p className="mt-4 text-sm text-neutral-500">
              {actualizado
                ? `Actualizada el ${formatearFecha(post.fechaActualizacion!)}`
                : formatearFecha(post.fechaPublicacion)}{' '}
              · {post.tiempoLecturaMin} min de lectura
            </p>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <img
          src={post.imagen}
          alt={post.imagenAlt}
          width={1200}
          height={675}
          className="aspect-video w-full rounded-bloque object-cover"
          fetchPriority="high"
        />

        <Indice secciones={seccionesDe(Articulo, H2)} />

        <div className="mt-4">
          <Articulo />
        </div>

        {post.preguntas.length > 0 && (
          <section aria-labelledby="titulo-preguntas" className="mt-14">
            <h2 id="titulo-preguntas" className="text-[1.7rem] text-neutral-900">
              Preguntas frecuentes
            </h2>
            <div className="mt-5 flex flex-col gap-2">
              {post.preguntas.map((p) => (
                <details
                  key={p.pregunta}
                  className="group rounded-tarjeta bg-white ring-1 ring-neutral-200 open:shadow-tarjeta"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
                    {p.pregunta}
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-neutral-500 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="px-4 pb-4 leading-relaxed text-neutral-700">{p.respuesta}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 rounded-bloque bg-ink p-7 text-white">
          <h2 className="text-2xl">¿Necesitas un {post.oficioNombre}?</h2>
          <p className="mt-2 text-neutral-300">
            Busca profesionales de tu zona con valoraciones de clientes que han enseñado la factura, o cuenta tu trabajo
            una vez y deja que te escriban ellos.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to={rutaOficio(post.categoriaSlug)}
              className={cn(baseBoton, variantesBoton.primario, tamanosBoton.lg)}
            >
              Ver profesionales de {post.categoriaNombre}
            </Link>
            <Link
              to="/solicitar-presupuesto"
              className={cn(baseBoton, 'bg-white/10 text-white hover:bg-white/20', tamanosBoton.lg)}
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              Pedir presupuestos gratis
            </Link>
          </div>
        </div>

        {relacionados.length > 0 && (
          <section aria-labelledby="titulo-relacionados" className="mt-14">
            <h2 id="titulo-relacionados" className="text-[1.7rem] text-neutral-900">
              Sigue leyendo
            </h2>
            <ul className="tablon-clavado mt-6 grid gap-x-5 gap-y-7 sm:grid-cols-3">
              {relacionados.map((r) => (
                <li key={r.slug}>
                  <Link
                    to={`/blog/${r.slug}`}
                    className="flex h-full flex-col rounded-tarjeta bg-white p-4 shadow-tarjeta transition-shadow hover:shadow-tarjeta-alzada"
                  >
                    <span className="text-xs font-semibold text-brand-700">Si buscas {r.oficioNombre}</span>
                    <span className="mt-1.5 font-semibold leading-snug text-neutral-900">{r.titulo}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <HuecoGoogle className="mt-12" />
      </article>
    </div>
  )
}
