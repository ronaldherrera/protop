import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HuecoGoogle } from '../components/monetizacion/HuecoGoogle'
import { formatearFecha } from '../features/blog/anclas'
import { POSTS, type PostBlog } from '../features/blog/posts'
import { datosEstructuradosListado, SEO_LISTADO_GUIAS } from '../features/blog/seo'
import { cn } from '../lib/cn'
import { useSeo } from '../lib/useSeo'

// Temas con al menos dos guías, en orden de más a menos guías: es el filtro de la parte de arriba.
const TEMAS = Object.entries(
  POSTS.flatMap((post) => post.temas).reduce<Record<string, number>>((cuenta, tema) => {
    cuenta[tema] = (cuenta[tema] ?? 0) + 1
    return cuenta
  }, {}),
)
  .filter(([, total]) => total >= 2)
  .sort((a, b) => b[1] - a[1])
  .map(([tema]) => tema)

function TarjetaGuia({ post, grande = false }: { post: PostBlog; grande?: boolean }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-tarjeta bg-white shadow-tarjeta transition-shadow hover:shadow-tarjeta-alzada',
        grande && 'md:grid md:grid-cols-[1.15fr_1fr]',
      )}
    >
      <img
        src={post.imagen}
        alt={post.imagenAlt}
        width={1200}
        height={675}
        className={cn('aspect-video w-full shrink-0 object-cover', grande && 'md:h-full')}
        loading="lazy"
      />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-sm font-semibold text-brand-700">Si buscas {post.oficioNombre}</p>
        <h2 className={cn('mt-1.5 text-neutral-900 group-hover:text-brand-700', grande ? 'text-3xl' : 'text-xl leading-snug')}>
          {post.titulo}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{post.extracto}</p>
        <p className="mt-auto pt-4 text-xs text-neutral-500">
          {formatearFecha(post.fechaPublicacion)} · {post.tiempoLecturaMin} min de lectura
        </p>
      </div>
    </Link>
  )
}

export function Blog() {
  const [tema, setTema] = useState<string | null>(null)

  useSeo(SEO_LISTADO_GUIAS.titulo, SEO_LISTADO_GUIAS.descripcion, { jsonLd: datosEstructuradosListado() })

  const visibles = tema ? POSTS.filter((post) => post.temas.includes(tema)) : POSTS
  const [destacada, ...resto] = visibles

  return (
    <div>
      <section className="corcho border-b border-[#a87a4a]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="chincheta max-w-3xl rotate-[-0.5deg] rounded-tarjeta bg-white p-6 pt-8 shadow-tarjeta-alzada sm:p-9">
            <h1 className="titular text-[2.4rem] leading-[1.02] text-neutral-900 sm:text-6xl">Guías para tu casa</h1>
            <p className="mt-4 max-w-xl text-lg text-neutral-600">
              Lo que conviene saber antes de llamar a un profesional: precios orientativos, señales de alarma y cómo
              comparar presupuestos, pensado para quien va a contratar una obra.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar guías por tema">
          {[null, ...TEMAS].map((t) => (
            <button
              key={t ?? 'todas'}
              type="button"
              aria-pressed={tema === t}
              onClick={() => setTema(t)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-semibold first-letter:uppercase ring-1 ring-inset transition-colors',
                tema === t ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-neutral-700 ring-neutral-300 hover:ring-neutral-500',
              )}
            >
              {t ?? 'Todas'}
            </button>
          ))}
        </div>

        {destacada && (
          <div className="mt-10">
            <TarjetaGuia post={destacada} grande />
          </div>
        )}

        <HuecoGoogle className="mt-8" />

        <ul className="tablon-clavado mt-10 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {resto.map((post) => (
            <li key={post.slug}>
              <TarjetaGuia post={post} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
