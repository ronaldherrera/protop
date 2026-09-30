import { Link } from 'react-router-dom'
import { POSTS } from '../features/blog/posts'
import { useSeo } from '../lib/useSeo'

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function Blog() {
  useSeo(
    'Blog de reformas y hogar | Protop',
    'Precios orientativos, señales de alarma y consejos prácticos de fontanería, electricidad, climatización, pintura y reformas para pedir presupuestos con más criterio.',
  )

  const [destacado, ...resto] = POSTS

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold text-brand-600">Blog</p>
      <h1 className="mt-1 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
        Consejos para tu próxima reforma
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-neutral-600">
        Precios orientativos, señales de alarma y cómo comparar presupuestos sin que te la cuelen — oficio a oficio.
      </p>

      <Link
        to={`/blog/${destacado.slug}`}
        className="mt-10 grid gap-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-md focus-visible:shadow-md sm:grid-cols-2"
      >
        <img
          src={destacado.imagen}
          alt=""
          className="aspect-[4/3] w-full object-cover sm:aspect-auto sm:h-full"
          loading="lazy"
        />
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{destacado.oficioNombre}</p>
          <h2 className="mt-2 text-2xl font-bold text-neutral-900">{destacado.titulo}</h2>
          <p className="mt-3 text-neutral-600">{destacado.extracto}</p>
          <p className="mt-4 text-xs text-neutral-400">
            {formatearFecha(destacado.fechaPublicacion)} · {destacado.tiempoLecturaMin} min de lectura
          </p>
        </div>
      </Link>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {resto.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md focus-visible:shadow-md"
          >
            <img src={post.imagen} alt="" className="aspect-[16/10] w-full object-cover" loading="lazy" />
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{post.oficioNombre}</p>
              <h2 className="mt-1.5 text-lg font-semibold text-neutral-900">{post.titulo}</h2>
              <p className="mt-2 text-sm text-neutral-600">{post.extracto}</p>
              <p className="mt-auto pt-4 text-xs text-neutral-400">
                {formatearFecha(post.fechaPublicacion)} · {post.tiempoLecturaMin} min de lectura
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
