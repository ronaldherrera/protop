// Título y descripción de las páginas públicas fijas, en un solo sitio para revisarlos juntos.
import { SITIO } from '../features/blog/seo'

export type SeoPagina = { titulo: string; descripcion: string; jsonLd?: object }

export const SEO_INICIO: SeoPagina = {
  titulo: 'Protop — Profesionales de reformas y reparaciones en toda España',
  descripcion:
    'Electricistas, fontaneros, pintores, carpinteros y más cerca de ti, en toda España: contacto directo y gratis, presupuestos y valoraciones con factura revisada.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Protop',
    url: SITIO,
    inLanguage: 'es-ES',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITIO}/profesionales?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
}

export const SEO_PARA_PROFESIONALES: SeoPagina = {
  titulo: 'Publica gratis tu ficha de profesional de reformas | Protop',
  descripcion:
    'Tu tarjeta en el tablón de reformas de toda España: ficha gratis, sin cuota y sin comisión por los trabajos. Recibe contactos y solicitudes de tu oficio y tu zona.',
}

export const SEO_SOLICITAR: SeoPagina = {
  titulo: 'Pide presupuestos de reformas y reparaciones gratis | Protop',
  descripcion:
    'Describe tu trabajo una vez y recibe propuestas de varios profesionales de tu zona, con la misma estructura para compararlas. Sin llamar uno a uno.',
}
