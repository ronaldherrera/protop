import { ArrowLeft, FileText } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ARTICULOS } from '../features/blog/articulos'
import { POSTS } from '../features/blog/posts'
import { Button } from '../components/ui/Button'
import { useSeo } from '../lib/useSeo'

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const post = POSTS.find((p) => p.slug === slug)

  useSeo(
    post ? `${post.titulo} | Protop` : 'Protop — Encuentra profesionales de confianza',
    post?.metaDescripcion ?? '',
  )

  if (!post) return <Navigate to="/blog" replace />

  const Articulo = ARTICULOS[post.slug]

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver al blog
      </Link>

      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-600">{post.oficioNombre}</p>
      <h1 className="mt-1 text-3xl font-bold text-neutral-900 sm:text-4xl">{post.titulo}</h1>
      <p className="mt-3 text-sm text-neutral-500">
        {formatearFecha(post.fechaPublicacion)} · {post.tiempoLecturaMin} min de lectura
      </p>

      <div className="mt-8">
        <Articulo />
      </div>

      <div className="mt-12 rounded-xl border border-neutral-200 bg-brand-50 p-6">
        <h2 className="text-lg font-semibold text-neutral-900">¿Necesitas un {post.oficioNombre}?</h2>
        <p className="mt-1 text-sm text-neutral-700">
          Describe el trabajo una vez y recibe propuestas de varios profesionales de tu zona, o consulta
          directamente el directorio.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="button" onClick={() => navigate('/solicitar-presupuesto')}>
            <FileText className="h-4 w-4" aria-hidden="true" />
            Solicitar presupuesto
          </Button>
          <Button
            type="button"
            variante="secundario"
            onClick={() => navigate(`/profesionales?categoria=${post.categoriaSlug}`)}
          >
            Ver profesionales de {post.categoriaNombre}
          </Button>
        </div>
      </div>
    </article>
  )
}
