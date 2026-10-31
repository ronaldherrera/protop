import { POSTS, type PostBlog } from './posts'

// Siempre el dominio público: estos datos van en el HTML que lee Google, también el generado en el build.
export const SITIO = 'https://protop.es'

export const SEO_LISTADO_GUIAS = {
  titulo: 'Guías de reformas y reparaciones: precios y consejos | Protop',
  descripcion:
    'Precios orientativos, humedades, boletín eléctrico, caldera, baño y cocina: guías claras para pedir presupuestos con criterio.',
}

export function tituloGuia(post: PostBlog): string {
  return `${post.titulo} | Protop`
}

/** schema.org de una guía: artículo, preguntas frecuentes y ruta de navegación. */
export function datosEstructuradosGuia(post: PostBlog) {
  const url = `${SITIO}/blog/${post.slug}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.titulo,
        description: post.metaDescripcion,
        image: `${SITIO}${post.imagen}`,
        datePublished: post.fechaPublicacion,
        dateModified: post.fechaActualizacion ?? post.fechaPublicacion,
        inLanguage: 'es-ES',
        mainEntityOfPage: url,
        author: { '@type': 'Organization', name: 'Protop', url: SITIO },
        publisher: {
          '@type': 'Organization',
          name: 'Protop',
          logo: { '@type': 'ImageObject', url: `${SITIO}/icono-512.png` },
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: post.preguntas.map((p) => ({
          '@type': 'Question',
          name: p.pregunta,
          acceptedAnswer: { '@type': 'Answer', text: p.respuesta },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITIO },
          { '@type': 'ListItem', position: 2, name: 'Guías', item: `${SITIO}/blog` },
          { '@type': 'ListItem', position: 3, name: post.titulo, item: url },
        ],
      },
    ],
  }
}

/** schema.org del listado de guías. */
export function datosEstructuradosListado() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Guías de reformas y reparaciones',
    url: `${SITIO}/blog`,
    inLanguage: 'es-ES',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: POSTS.map((post, indice) => ({
        '@type': 'ListItem',
        position: indice + 1,
        url: `${SITIO}/blog/${post.slug}`,
        name: post.titulo,
      })),
    },
  }
}
