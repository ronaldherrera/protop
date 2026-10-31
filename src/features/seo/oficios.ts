// Páginas de oficio para Google: /electricistas, /electricistas/madrid… Cada oficio (categoría de la base) tiene
// la palabra con la que la gente lo busca y un texto propio, para que cada página diga algo útil y no sea solo
// una lista. Si se añade una categoría en la base, hay que añadirla aquí para que tenga página.

export type PreguntaOficio = { pregunta: string; respuesta: string }

export type OficioSeo = {
  /** Slug de la categoría en la base. */
  categoria: string
  /** Primer tramo de la URL: lo que se escribe en Google («electricistas»). */
  url: string
  /** Para el titular: «Electricistas en Madrid». */
  plural: string
  /** En una frase: «un electricista». */
  singular: string
  /** Qué hace y cuándo llamarle, en dos frases. */
  intro: string
  /** Qué pedir que venga en el presupuesto. */
  consejos: string[]
  preguntas: PreguntaOficio[]
}

export const OFICIOS_SEO: OficioSeo[] = [
  {
    categoria: 'electricidad',
    url: 'electricistas',
    plural: 'Electricistas',
    singular: 'un electricista',
    intro:
      'Enchufes que saltan, un cuadro antiguo, el boletín para dar de alta la luz o una instalación nueva en la reforma. Un electricista autorizado puede firmar el certificado (CIE) que pide la compañía.',
    consejos: [
      'Que indique si está autorizado para emitir el boletín eléctrico (CIE), si lo necesitas.',
      'Precio cerrado por punto de luz o enchufe, no solo «mano de obra más material».',
      'Si el cuadro se cambia, qué protecciones lleva (diferencial, magnetotérmicos, sobretensiones).',
    ],
    preguntas: [
      {
        pregunta: '¿Cuándo hace falta un boletín eléctrico?',
        respuesta:
          'Al dar de alta la luz en una vivienda nueva, al subir la potencia por encima de lo que permite la instalación o tras una reforma eléctrica importante. Solo puede emitirlo un instalador autorizado.',
      },
      {
        pregunta: '¿Qué hago si salta el diferencial y no vuelve a subir?',
        respuesta:
          'Baja todos los interruptores del cuadro, sube el diferencial y ve subiendo los circuitos uno a uno: el que lo hace saltar es el que tiene la avería. Si no lo localizas, llama a un electricista y no fuerces el diferencial.',
      },
    ],
  },
  {
    categoria: 'fontaneria',
    url: 'fontaneros',
    plural: 'Fontaneros',
    singular: 'un fontanero',
    intro:
      'Fugas, atascos, cisternas que no paran, cambiar la bañera por un plato de ducha o renovar las tuberías. Si hay agua saliendo, cierra la llave de paso antes de llamar.',
    consejos: [
      'Desplazamiento y primera hora por separado, para comparar presupuestos de verdad.',
      'Qué material de tubería usa (multicapa, cobre, PPR) y si incluye las pruebas de presión.',
      'Si hay que abrir pared o suelo, quién repone el alicatado y quién retira los escombros.',
    ],
    preguntas: [
      {
        pregunta: '¿Quién paga una fuga que afecta al vecino de abajo?',
        respuesta:
          'Normalmente el seguro de hogar de la vivienda donde está la avería. Si la tubería es comunitaria (bajantes, montantes generales), lo cubre la comunidad. Avisa a tu seguro antes de reparar si puedes.',
      },
      {
        pregunta: '¿Merece la pena cambiar la bañera por un plato de ducha?',
        respuesta:
          'Para la mayoría de casas sí: es más cómodo y seguro, sobre todo para personas mayores. El trabajo suele hacerse en uno o dos días si no hay que mover desagües.',
      },
    ],
  },
  {
    categoria: 'albanileria',
    url: 'albaniles',
    plural: 'Albañiles',
    singular: 'un albañil',
    intro:
      'Reformas de baño y cocina, tabiques, alicatados, soleras o pequeñas reparaciones de obra. Para una reforma completa conviene que un mismo responsable coordine a los demás oficios.',
    consejos: [
      'Partidas separadas: demolición, retirada de escombros, albañilería y materiales.',
      'Plazo de ejecución por escrito y qué pasa si se alarga.',
      'Si la obra necesita licencia o comunicación previa al ayuntamiento, quién la tramita.',
    ],
    preguntas: [
      {
        pregunta: '¿Necesito licencia para reformar el baño o la cocina?',
        respuesta:
          'Casi siempre basta una comunicación previa o declaración responsable al ayuntamiento, si no tocas estructura ni fachada. Cada ayuntamiento tiene su trámite: pregúntalo antes de empezar.',
      },
      {
        pregunta: '¿Cómo comparo presupuestos de reforma?',
        respuesta:
          'Pide que todos presupuesten las mismas partidas y calidades de material. Un presupuesto mucho más barato suele dejar fuera algo: escombros, remates o materiales.',
      },
    ],
  },
  {
    categoria: 'pintura-decoracion',
    url: 'pintores',
    plural: 'Pintores',
    singular: 'un pintor',
    intro:
      'Pintar un piso entero o una habitación, quitar gotelé, alisar paredes, lacar puertas o pintar la fachada. El estado de las paredes cambia mucho el precio.',
    consejos: [
      'Precio por metro cuadrado o por estancia, con el número de manos incluido.',
      'Marca y tipo de pintura, y si incluye reparar grietas y desconchones.',
      'Si protege suelos y muebles y si deja todo limpio al terminar.',
    ],
    preguntas: [
      {
        pregunta: '¿Cuánto se tarda en pintar un piso?',
        respuesta:
          'Un piso de unos 80 m² suele llevar de dos a cuatro días, según cuántas manos y cuánta preparación necesiten las paredes. Quitar gotelé añade varios días.',
      },
      {
        pregunta: '¿Merece la pena quitar el gotelé?',
        respuesta:
          'Si vas a pintar de todas formas, sí: la pared queda más moderna y fácil de limpiar. Se puede rascar o tapar con una capa de alisado.',
      },
    ],
  },
  {
    categoria: 'pladur-falsos-techos',
    url: 'instaladores-de-pladur',
    plural: 'Instaladores de pladur',
    singular: 'un instalador de pladur',
    intro:
      'Tabiques de placa de yeso, falsos techos para esconder instalaciones o poner focos, trasdosados para aislar y muebles a medida de pladur.',
    consejos: [
      'Tipo de placa (normal, hidrófuga para baños, ignífuga) y grosor de la perfilería.',
      'Si incluye aislamiento dentro del tabique y el acabado listo para pintar.',
      'Precio por metro cuadrado y qué remates están incluidos.',
    ],
    preguntas: [
      {
        pregunta: '¿El pladur aísla del ruido?',
        respuesta:
          'Sí, si se monta con lana mineral dentro y doble placa. Un tabique de pladur bien hecho puede aislar más que uno de ladrillo fino.',
      },
    ],
  },
  {
    categoria: 'suelos-tarimas',
    url: 'instaladores-de-suelos',
    plural: 'Instaladores de suelos y tarimas',
    singular: 'un instalador de suelos',
    intro:
      'Tarima flotante, parquet, suelo vinílico o porcelánico, y acuchillar y barnizar suelos de madera. El estado del suelo de debajo decide si se puede poner encima.',
    consejos: [
      'Si incluye retirar el suelo viejo, nivelar y la base aislante.',
      'Rodapiés, remates en puertas y cortes de puertas incluidos o aparte.',
      'Marca, clase de uso y garantía del material.',
    ],
    preguntas: [
      {
        pregunta: '¿Se puede poner tarima encima del suelo que ya tengo?',
        respuesta:
          'En muchos casos sí, si el suelo está firme y nivelado. Hay que contar con que las puertas pueden necesitar recortarse.',
      },
    ],
  },
  {
    categoria: 'gas-calefaccion',
    url: 'calefaccion-y-gas',
    plural: 'Técnicos de calefacción y gas',
    singular: 'un técnico de calefacción',
    intro:
      'Instalar o cambiar la caldera, la revisión obligatoria del gas, radiadores que no calientan o suelo radiante. Para el gas hace falta una empresa habilitada.',
    consejos: [
      'Marca y modelo de la caldera, y si incluye retirar la antigua y la puesta en marcha.',
      'Si emite el certificado de la instalación de gas cuando hace falta.',
      'Garantía de la caldera y de la mano de obra, por separado.',
    ],
    preguntas: [
      {
        pregunta: '¿Cada cuánto hay que revisar la caldera?',
        respuesta:
          'La instalación de gas pasa una inspección obligatoria cada cinco años, y la caldera debe revisarse según su fabricante, normalmente cada uno o dos años.',
      },
    ],
  },
  {
    categoria: 'climatizacion',
    url: 'aire-acondicionado',
    plural: 'Instaladores de aire acondicionado',
    singular: 'un instalador de aire acondicionado',
    intro:
      'Instalar un split o aire por conductos, bombas de calor, mantenimiento y recarga de gas. Para manipular gases refrigerantes hace falta un instalador habilitado.',
    consejos: [
      'Metros de tubería incluidos en la instalación básica y precio del metro extra.',
      'Dónde va la máquina exterior y si hace falta permiso de la comunidad.',
      'Potencia en frigorías adecuada a los metros de la estancia.',
    ],
    preguntas: [
      {
        pregunta: '¿Aire acondicionado o bomba de calor?',
        respuesta:
          'Casi todos los equipos actuales son bomba de calor: enfrían en verano y calientan en invierno con poco consumo. Si vas a usarlo también para calefacción, mira la eficiencia en modo calor.',
      },
    ],
  },
  {
    categoria: 'energia-solar',
    url: 'placas-solares',
    plural: 'Instaladores de placas solares',
    singular: 'un instalador de placas solares',
    intro:
      'Autoconsumo con placas fotovoltaicas en casa o en la comunidad, baterías y legalización de la instalación. Hay ayudas y bonificaciones municipales que cambian según el lugar.',
    consejos: [
      'Potencia en kWp, marca de paneles e inversor y producción estimada al año.',
      'Si incluye la legalización, el certificado y la gestión de la compensación de excedentes.',
      'Garantías del panel, del inversor y de la instalación por separado.',
    ],
    preguntas: [
      {
        pregunta: '¿Compensan las placas solares?',
        respuesta:
          'Suelen compensar cuando gastas buena parte de la luz en las horas de sol y tienes un tejado bien orientado. Pide una estimación de ahorro con tus facturas reales.',
      },
    ],
  },
  {
    categoria: 'carpinteria-madera',
    url: 'carpinteros',
    plural: 'Carpinteros',
    singular: 'un carpintero',
    intro:
      'Muebles a medida, armarios empotrados, cocinas, puertas de interior y reparaciones de madera. Un buen carpintero mide en casa antes de dar el precio final.',
    consejos: [
      'Material del tablero o la madera y de los herrajes (bisagras, guías).',
      'Si incluye montaje, transporte y retirar lo viejo.',
      'Plazo de fabricación y de montaje, por separado.',
    ],
    preguntas: [
      {
        pregunta: '¿Mueble a medida o de tienda?',
        respuesta:
          'A medida aprovechas cada centímetro y huecos difíciles, como bajo escaleras o buhardillas. Para espacios estándar, un mueble de tienda bien montado sale más barato.',
      },
    ],
  },
  {
    categoria: 'carpinteria-aluminio-pvc',
    url: 'carpinteria-de-aluminio',
    plural: 'Carpinterías de aluminio y PVC',
    singular: 'una carpintería de aluminio',
    intro:
      'Ventanas de aluminio con rotura de puente térmico o de PVC, cerramientos de terraza, mamparas y puertas. Cambiar las ventanas es de las mejoras que más se notan en la factura de calefacción.',
    consejos: [
      'Perfil (aluminio con RPT o PVC), serie y tipo de vidrio (doble, bajo emisivo).',
      'Si incluye retirar las ventanas viejas, remates y sellado.',
      'Si el cerramiento de terraza necesita permiso de la comunidad o del ayuntamiento.',
    ],
    preguntas: [
      {
        pregunta: '¿Aluminio o PVC?',
        respuesta:
          'Los dos aíslan bien si son de calidad: el PVC suele aislar algo más por el mismo precio y el aluminio con RPT permite perfiles más finos y grandes superficies.',
      },
    ],
  },
  {
    categoria: 'puertas-ventanas',
    url: 'puertas-y-ventanas',
    plural: 'Puertas y ventanas',
    singular: 'un instalador de puertas y ventanas',
    intro:
      'Puertas de entrada y de interior, puertas blindadas o acorazadas, ventanas y cristalería. Cambiar las puertas de interior renueva una casa sin obra.',
    consejos: [
      'Medidas tomadas en casa y si incluye el premarco o hay que adaptar el hueco.',
      'Herrajes, manillas y cerradura incluidos y su calidad.',
      'Retirada de las puertas viejas y remates de tapajuntas.',
    ],
    preguntas: [
      {
        pregunta: '¿Puerta blindada o acorazada?',
        respuesta:
          'La blindada tiene alma de madera con chapa de acero; la acorazada es de estructura metálica entera y resiste mucho más. Para un piso suele bastar una blindada con buena cerradura.',
      },
    ],
  },
  {
    categoria: 'persianas-cerramientos',
    url: 'persianas-y-toldos',
    plural: 'Persianas, toldos y cerramientos',
    singular: 'un especialista en persianas',
    intro:
      'Reparar persianas que no suben, cambiar cintas y lamas, motorizar persianas, toldos y cerramientos de terraza.',
    consejos: [
      'Si es reparación, desplazamiento y precio de la pieza por separado.',
      'Para motorizar: marca del motor y si se puede manejar con el móvil.',
      'Para toldos: tejido, tipo de brazo y garantía.',
    ],
    preguntas: [
      {
        pregunta: '¿Se puede motorizar una persiana que ya tengo?',
        respuesta:
          'Sí, en la mayoría de casos se cambia el eje por uno con motor sin tocar la persiana. Hace falta llevar corriente hasta el cajón.',
      },
    ],
  },
  {
    categoria: 'limpieza',
    url: 'empresas-de-limpieza',
    plural: 'Empresas de limpieza',
    singular: 'una empresa de limpieza',
    intro:
      'Limpieza de fin de obra, limpiezas a fondo, comunidades, oficinas y locales. Después de una reforma, una limpieza profesional ahorra muchos días.',
    consejos: [
      'Qué incluye exactamente (cristales, interior de armarios, electrodomésticos).',
      'Si llevan productos y maquinaria propios.',
      'Precio por servicio, por horas o por metro cuadrado.',
    ],
    preguntas: [
      {
        pregunta: '¿Qué es una limpieza de fin de obra?',
        respuesta:
          'Quitar polvo de obra, restos de pintura, cemento y silicona de suelos, cristales y sanitarios. Se hace cuando han terminado todos los oficios.',
      },
    ],
  },
  {
    categoria: 'jardineria',
    url: 'jardineros',
    plural: 'Jardineros',
    singular: 'un jardinero',
    intro:
      'Mantenimiento de jardines, césped natural o artificial, riego automático y diseño de jardines y terrazas.',
    consejos: [
      'Frecuencia de visitas y qué incluye cada una.',
      'Si retiran los restos de poda.',
      'Para riego automático: programador, zonas y garantía.',
    ],
    preguntas: [
      {
        pregunta: '¿Césped natural o artificial?',
        respuesta:
          'El artificial casi no necesita mantenimiento ni agua, pero se calienta al sol. El natural es más fresco y agradable, pero pide riego y siega.',
      },
    ],
  },
  {
    categoria: 'poda-zonas-verdes',
    url: 'poda-de-arboles',
    plural: 'Poda de árboles y zonas verdes',
    singular: 'un servicio de poda',
    intro:
      'Poda en altura, tala de árboles, desbroce de fincas y mantenimiento de zonas verdes de comunidades.',
    consejos: [
      'Si la poda en altura se hace con plataforma o trepando, y seguro de responsabilidad civil.',
      'Retirada y gestión de los restos incluidas.',
      'Si un árbol necesita permiso municipal para talarse.',
    ],
    preguntas: [
      {
        pregunta: '¿Cuándo se podan los árboles?',
        respuesta:
          'La mayoría en invierno, cuando están en reposo. Las podas de mantenimiento ligeras se pueden hacer en otras épocas.',
      },
    ],
  },
  {
    categoria: 'piscinas',
    url: 'piscinas',
    plural: 'Empresas de piscinas',
    singular: 'una empresa de piscinas',
    intro:
      'Construcción y reforma de piscinas, mantenimiento, tratamiento del agua, depuradoras y reparación de fugas.',
    consejos: [
      'Para mantenimiento: visitas al mes y productos incluidos.',
      'Para obra: tipo de vaso, revestimiento y equipo de depuración.',
      'Licencia de obra y quién la tramita.',
    ],
    preguntas: [
      {
        pregunta: '¿Cómo sé si mi piscina pierde agua?',
        respuesta:
          'Pon un cubo con agua en el primer escalón y marca el nivel dentro y fuera. Si en un día la piscina baja más que el cubo, hay fuga y no solo evaporación.',
      },
    ],
  },
  {
    categoria: 'impermeabilizaciones',
    url: 'impermeabilizaciones',
    plural: 'Impermeabilización y tejados',
    singular: 'un especialista en impermeabilización',
    intro:
      'Goteras, terrazas que filtran, humedades por capilaridad, retejados y cubiertas. Antes de reparar hay que saber de dónde entra el agua.',
    consejos: [
      'Diagnóstico del origen de la humedad antes del presupuesto.',
      'Sistema que propone (lámina, membrana líquida, retejado) y garantía en años.',
      'Si hace falta andamio o plataforma y si está incluido.',
    ],
    preguntas: [
      {
        pregunta: '¿Quién paga una gotera en un edificio?',
        respuesta:
          'Si entra por la cubierta o la fachada, que son comunes, la paga la comunidad. Si viene de la terraza privada de un vecino, puede pagarla él o la comunidad según los estatutos.',
      },
    ],
  },
  {
    categoria: 'aislamiento',
    url: 'aislamiento-termico',
    plural: 'Aislamiento térmico y acústico',
    singular: 'un especialista en aislamiento',
    intro:
      'Insuflado de cámaras, trasdosados, aislamiento por el exterior (SATE), buhardillas y aislamiento acústico entre viviendas.',
    consejos: [
      'Material, espesor y conductividad del aislante.',
      'Si la obra se hace por dentro o por fuera y cuánto espacio se pierde.',
      'Si da derecho a ayudas de eficiencia energética y si las tramita.',
    ],
    preguntas: [
      {
        pregunta: '¿Qué es el insuflado de cámaras?',
        respuesta:
          'Rellenar el hueco entre las dos hojas de la fachada con aislante por unos pequeños agujeros. Se hace en uno o dos días y sin obra dentro de casa.',
      },
    ],
  },
  {
    categoria: 'rehabilitacion-fachadas',
    url: 'rehabilitacion-de-fachadas',
    plural: 'Rehabilitación de fachadas',
    singular: 'una empresa de rehabilitación de fachadas',
    intro:
      'Pintar y reparar fachadas, quitar humedades, aislamiento exterior (SATE) y obras por la inspección técnica del edificio (ITE).',
    consejos: [
      'Andamio, licencia y ocupación de vía pública incluidos o aparte.',
      'Tratamiento de grietas y del hierro oxidado antes de pintar.',
      'Garantía de la pintura o el revestimiento en años.',
    ],
    preguntas: [
      {
        pregunta: '¿Hay ayudas para rehabilitar la fachada?',
        respuesta:
          'Muchas comunidades autónomas y ayuntamientos tienen ayudas, sobre todo si la obra mejora el aislamiento. Pregunta a la empresa si las conoce y las tramita.',
      },
    ],
  },
  {
    categoria: 'derribos-desescombros',
    url: 'derribos-y-desescombros',
    plural: 'Derribos y desescombros',
    singular: 'una empresa de derribos',
    intro:
      'Tirar tabiques, vaciar pisos y locales, retirada de escombros y contenedores. Antes de tirar un tabique hay que saber si es de carga.',
    consejos: [
      'Si incluye contenedor o sacos, transporte y gestión de residuos.',
      'Quién comprueba que el tabique no es de carga.',
      'Protección de zonas comunes y del resto de la vivienda.',
    ],
    preguntas: [
      {
        pregunta: '¿Cómo sé si un tabique es de carga?',
        respuesta:
          'No se puede saber solo mirándolo. Pide los planos del edificio o que un técnico lo revise antes de tirarlo.',
      },
    ],
  },
  {
    categoria: 'urgencias-24h',
    url: 'urgencias-24-horas',
    plural: 'Reparaciones urgentes 24 horas',
    singular: 'un servicio de urgencias',
    intro:
      'Cerrajeros, fugas de agua, apagones y cristales rotos a cualquier hora. En una urgencia, pide el precio del desplazamiento antes de que vengan.',
    consejos: [
      'Precio del desplazamiento y de la primera hora, de día y de noche.',
      'Que te den factura con el detalle del trabajo.',
      'Si tu seguro de hogar cubre la urgencia: llámale primero.',
    ],
    preguntas: [
      {
        pregunta: '¿Cuánto cobra un cerrajero de urgencia?',
        respuesta:
          'Depende mucho de la hora y del tipo de cerradura. Pide siempre el precio cerrado por teléfono antes de que salga, y desconfía de precios que no te quieren decir.',
      },
    ],
  },
]

const POR_CATEGORIA = new Map(OFICIOS_SEO.map((oficio) => [oficio.categoria, oficio]))
const POR_URL = new Map(OFICIOS_SEO.map((oficio) => [oficio.url, oficio]))

export const oficioSeoDeCategoria = (categoria: string) => POR_CATEGORIA.get(categoria)
export const oficioSeoDeUrl = (url: string) => POR_URL.get(url)

/** Página de un oficio en toda España o en un lugar (municipio o comunidad). */
export function rutaOficio(categoria: string, lugarSlug?: string): string {
  const oficio = POR_CATEGORIA.get(categoria)
  if (!oficio) return `/profesionales?categoria=${categoria}${lugarSlug ? `&zona=${lugarSlug}` : ''}`
  return lugarSlug ? `/${oficio.url}/${lugarSlug}` : `/${oficio.url}`
}
