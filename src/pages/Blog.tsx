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

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold text-brand-600">Blog</p>
      <h1 className="mt-1 text-3xl font-bold text-neutral-900 sm:text-4xl">Consejos para tu próxima reforma</h1>
      <p className="mt-3 max-w-2xl text-neutral-600">
        Precios orientativos, señales de alarma y cómo comparar presupuestos sin que te la cuelen — oficio a oficio.
      </p>

      <div className="mt-10 flex flex-col gap-4">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md focus-visible:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{post.oficioNombre}</p>
            <h2 className="text-lg font-semibold text-neutral-900">{post.titulo}</h2>
            <p className="text-sm text-neutral-600">{post.extracto}</p>
            <p className="mt-2 text-xs text-neutral-400">
              {formatearFecha(post.fechaPublicacion)} · {post.tiempoLecturaMin} min de lectura
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
