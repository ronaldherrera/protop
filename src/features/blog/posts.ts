export type PostBlog = {
  slug: string
  titulo: string
  metaDescripcion: string
  extracto: string
  categoriaSlug: string
  categoriaNombre: string
  oficioNombre: string
  fechaPublicacion: string
  tiempoLecturaMin: number
  imagen: string
}

export const POSTS: PostBlog[] = [
  {
    slug: 'cuanto-cuesta-un-fontanero',
    imagen: '/fotos/blog/cuanto-cuesta-un-fontanero.webp',
    titulo: 'Cuánto cuesta un fontanero: precios orientativos y cómo evitar sustos',
    metaDescripcion:
      'Precios orientativos de fontanería por tipo de trabajo, qué factores los mueven y cómo pedir presupuesto sin sorpresas en la factura final.',
    extracto:
      'Qué factores cambian el precio de un fontanero, rangos orientativos por tipo de trabajo y cómo detectar un presupuesto inflado antes de aceptarlo.',
    categoriaSlug: 'fontaneria',
    categoriaNombre: 'fontanería',
    oficioNombre: 'fontanero',
    fechaPublicacion: '2026-09-24',
    tiempoLecturaMin: 6,
  },
  {
    slug: 'cuando-llamar-a-un-electricista',
    imagen: '/fotos/blog/cuando-llamar-a-un-electricista.webp',
    titulo: 'Señales de que necesitas un electricista ya (y no dentro de un mes)',
    metaDescripcion:
      'Síntomas eléctricos que no conviene posponer, qué revisa un electricista en una inspección y cuándo es obligatorio el boletín eléctrico.',
    extracto:
      'Un plomo que salta, un enchufe caliente o un olor raro no son casualidad. Estas son las señales que de verdad requieren un electricista con urgencia.',
    categoriaSlug: 'electricidad',
    categoriaNombre: 'electricidad',
    oficioNombre: 'electricista',
    fechaPublicacion: '2026-09-25',
    tiempoLecturaMin: 5,
  },
  {
    slug: 'aire-acondicionado-o-bomba-de-calor',
    imagen: '/fotos/blog/aire-acondicionado-o-bomba-de-calor.webp',
    titulo: 'Aire acondicionado o bomba de calor: qué instalar en casa y qué cuesta',
    metaDescripcion:
      'Diferencias entre aire acondicionado y bomba de calor, cuándo compensa cada una y precios orientativos de instalación según el tipo de vivienda.',
    extracto:
      'No son lo mismo y el precio tampoco: comparamos aire acondicionado y bomba de calor para que sepas qué pedir antes de llamar a un instalador.',
    categoriaSlug: 'climatizacion',
    categoriaNombre: 'climatización',
    oficioNombre: 'técnico de climatización',
    fechaPublicacion: '2026-09-27',
    tiempoLecturaMin: 6,
  },
  {
    slug: 'cuanto-cuesta-pintar-un-piso',
    imagen: '/fotos/blog/cuanto-cuesta-pintar-un-piso.webp',
    titulo: 'Cuánto cuesta pintar un piso: cómo se calcula el presupuesto por m²',
    metaDescripcion:
      'Cómo calculan los pintores el precio por metro cuadrado, qué encarece una mano de pintura y precios orientativos para un piso completo.',
    extracto:
      'El precio de pintar no es solo "tantos euros el metro": el estado de la pared, el número de manos y los acabados cambian el presupuesto final.',
    categoriaSlug: 'pintura-decoracion',
    categoriaNombre: 'pintura',
    oficioNombre: 'pintor',
    fechaPublicacion: '2026-09-28',
    tiempoLecturaMin: 6,
  },
  {
    slug: 'como-organizar-una-reforma-integral',
    imagen: '/fotos/blog/como-organizar-una-reforma-integral.webp',
    titulo: 'Reforma integral paso a paso: fases, plazos y cómo comparar presupuestos',
    metaDescripcion:
      'Las fases de una reforma integral en orden, cuánto suele durar cada una y cómo pedir presupuestos que de verdad se puedan comparar entre sí.',
    extracto:
      'Demolición, instalaciones, alicatados, pintura... una reforma integral tiene un orden que no conviene saltarse. Así se planifica de principio a fin.',
    categoriaSlug: 'albanileria',
    categoriaNombre: 'albañilería',
    oficioNombre: 'albañil',
    fechaPublicacion: '2026-09-29',
    tiempoLecturaMin: 7,
  },
]
