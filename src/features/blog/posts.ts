export type PreguntaFrecuente = { pregunta: string; respuesta: string }

export type PostBlog = {
  slug: string
  titulo: string
  metaDescripcion: string
  extracto: string
  categoriaSlug: string
  categoriaNombre: string
  oficioNombre: string
  fechaPublicacion: string
  /** Última revisión del contenido (para Google y para el lector). */
  fechaActualizacion?: string
  tiempoLecturaMin: number
  imagen: string
  /** Qué se ve en la portada (alt de la imagen: accesibilidad y Google Imágenes). */
  imagenAlt: string
  /** Preguntas reales que responde la guía: se muestran al final y van como datos estructurados. */
  preguntas: PreguntaFrecuente[]
  /** Slugs de otras guías que conviene leer después. */
  relacionados: string[]
  /** Temas para agrupar y enlazar guías entre sí. */
  temas: string[]
}

export const POSTS: PostBlog[] = [
  {
    slug: 'humedades-en-casa-cantabria',
    imagen: '/fotos/blog/humedades-en-casa-cantabria.webp',
    imagenAlt: 'Registro de humedad de un dormitorio en papel cuadriculado, pegado con cinta en una pared con una mancha de humedad',
    titulo: 'Humedades en casa en Cantabria: cómo saber de qué tipo son y cómo se arreglan',
    metaDescripcion:
      'Condensación, capilaridad o filtración: cómo distinguir la humedad de tu casa en Cantabria, qué puedes hacer tú y a qué profesional llamar en cada caso.',
    extracto:
      'Manchas negras, pintura abombada u olor a cerrado: cada humedad tiene una causa distinta y una solución distinta. Así la identificas antes de pagar.',
    categoriaSlug: 'impermeabilizaciones',
    categoriaNombre: 'impermeabilizaciones',
    oficioNombre: 'especialista en humedades',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 7,
    preguntas: [
      {
        pregunta: '¿Cómo sé si la humedad de mi pared es por condensación?',
        respuesta:
          'La condensación aparece sobre todo en invierno, en esquinas, techos y alrededor de las ventanas, y suele traer puntos negros de moho. Si empeora con la casa cerrada y mejora al ventilar, casi seguro es condensación.',
      },
      {
        pregunta: '¿Sirve la pintura antihumedad?',
        respuesta:
          'Ayuda contra el moho de la condensación, pero no arregla una humedad por capilaridad o por filtración: si el agua sigue entrando, la mancha vuelve. Primero hay que cortar la causa.',
      },
      {
        pregunta: '¿Quién paga una humedad que viene de la fachada o del tejado?',
        respuesta:
          'La fachada y el tejado suelen ser elementos comunes, así que la reparación corresponde normalmente a la comunidad de propietarios. Comunícalo por escrito al presidente o al administrador.',
      },
    ],
    relacionados: ['pintar-fachada-zona-costera-cantabria', 'como-comparar-presupuestos-de-reforma', 'cuanto-cuesta-pintar-un-piso'],
    temas: ['humedades', 'fachadas', 'mantenimiento'],
  },
  {
    slug: 'cuanto-cuesta-reformar-un-bano',
    imagen: '/fotos/blog/cuanto-cuesta-reformar-un-bano.webp',
    imagenAlt: 'Muestrario de azulejos blancos, un metro de cinta y un pósit con las cuentas de un baño de 4 m² sobre el suelo de obra',
    titulo: 'Cuánto cuesta reformar un baño: partidas, precios orientativos y cómo comparar',
    metaDescripcion:
      'Qué incluye una reforma de baño, rangos de precio orientativos según el tipo de reforma y cómo pedir presupuestos que se puedan comparar de verdad.',
    extracto:
      'Un baño de 4 m² puede costar el doble que otro igual. Te explicamos qué partidas lo componen y qué mueve el precio de verdad.',
    categoriaSlug: 'albanileria',
    categoriaNombre: 'albañilería',
    oficioNombre: 'profesional de reformas',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 7,
    preguntas: [
      {
        pregunta: '¿Cuánto tarda una reforma completa de baño?',
        respuesta:
          'Una reforma completa de un baño de tamaño normal suele llevar entre una y tres semanas, según si se cambian las instalaciones y los tiempos de secado de los materiales.',
      },
      {
        pregunta: '¿Necesito permiso del ayuntamiento para reformar el baño?',
        respuesta:
          'Una reforma interior sin tocar la estructura suele tramitarse como obra menor o comunicación previa, pero cada ayuntamiento tiene sus reglas. Pregúntalo en el tuyo antes de empezar.',
      },
      {
        pregunta: '¿Conviene cambiar las tuberías al reformar el baño?',
        respuesta:
          'En viviendas de más de 30 años, sí suele compensar: después del alicatado nuevo, cambiarlas obliga a romperlo otra vez.',
      },
    ],
    relacionados: ['cambiar-banera-por-plato-de-ducha', 'como-comparar-presupuestos-de-reforma', 'cuanto-cuesta-un-fontanero'],
    temas: ['baño', 'reformas', 'precios'],
  },
  {
    slug: 'boletin-electrico-cie',
    imagen: '/fotos/blog/boletin-electrico-cie.webp',
    imagenAlt: 'Certificado de instalación eléctrica con el sello del instalador, sujeto con una pinza sobre una mesa de madera',
    titulo: 'Boletín eléctrico (CIE): qué es, cuándo te lo piden y cómo conseguirlo',
    metaDescripcion:
      'Qué es el certificado de instalación eléctrica, cuándo es necesario (alta, subir potencia, reformas, cambio de titular), cuánto cuesta y cómo pedirlo.',
    extracto:
      'Dar de alta la luz, subir la potencia o vender un piso: el boletín aparece en todos. Te contamos cuándo lo necesitas y cómo se consigue.',
    categoriaSlug: 'electricidad',
    categoriaNombre: 'electricidad',
    oficioNombre: 'electricista',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 6,
    preguntas: [
      {
        pregunta: '¿El boletín eléctrico caduca?',
        respuesta:
          'No caduca, pero si tiene más de 20 años la distribuidora puede pedir que se revise la instalación cuando cambias el titular u otra condición del contrato.',
      },
      {
        pregunta: '¿Cuánto cuesta el boletín eléctrico?',
        respuesta:
          'Para una vivienda que ya cumple, la revisión y emisión suele moverse entre 70 y 300 €. Si hay que adecuar la instalación, ese trabajo va aparte.',
      },
      {
        pregunta: '¿Quién puede hacer el boletín?',
        respuesta: 'Solo un instalador electricista autorizado, que después lo registra ante el organismo de industria de la comunidad autónoma.',
      },
    ],
    relacionados: ['cuando-llamar-a-un-electricista', 'como-comparar-presupuestos-de-reforma', 'como-organizar-una-reforma-integral'],
    temas: ['electricidad', 'trámites'],
  },
  {
    slug: 'revision-caldera-de-gas',
    imagen: '/fotos/blog/revision-caldera-de-gas.webp',
    imagenAlt: 'Etiqueta de cartón de revisión de la caldera de gas con la fecha de la próxima revisión, atada a la tubería de cobre',
    titulo: 'Revisión de la caldera de gas: cada cuánto toca y quién la tiene que hacer',
    metaDescripcion:
      'La diferencia entre el mantenimiento de la caldera (cada 2 años, RITE) y la inspección de la instalación de gas (cada 5 años), y cómo evitar visitas falsas.',
    extracto:
      'Mantenimiento de la caldera e inspección del gas no son lo mismo. Te explicamos cada cuánto toca cada una y quién debe hacerla.',
    categoriaSlug: 'gas-calefaccion',
    categoriaNombre: 'gas y calefacción',
    oficioNombre: 'técnico de calefacción',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 5,
    preguntas: [
      {
        pregunta: '¿Cada cuánto hay que revisar la caldera de gas?',
        respuesta:
          'Según el RITE, las calderas domésticas de hasta 70 kW necesitan mantenimiento cada 2 años, salvo que el fabricante pida una frecuencia mayor, como una revisión anual.',
      },
      {
        pregunta: '¿Cada cuánto es la inspección de gas?',
        respuesta: 'La inspección periódica de la instalación de gas se hace cada 5 años y la organiza la distribuidora, que avisa de la fecha.',
      },
      {
        pregunta: '¿Cómo sé si una revisión de gas es falsa?',
        respuesta:
          'La inspección oficial la avisa la distribuidora con antelación y por escrito. Si alguien se presenta sin aviso, compruébalo llamando al teléfono oficial y no pagues en efectivo a quien no puedas identificar.',
      },
    ],
    relacionados: ['aire-acondicionado-o-bomba-de-calor', 'humedades-en-casa-cantabria', 'como-comparar-presupuestos-de-reforma'],
    temas: ['calefacción', 'mantenimiento', 'trámites'],
  },
  {
    slug: 'cambiar-banera-por-plato-de-ducha',
    imagen: '/fotos/blog/cambiar-banera-por-plato-de-ducha.webp',
    imagenAlt: 'Plano de un baño a lápiz con la bañera tachada y un plato de ducha de 160 × 70 dibujado en su lugar',
    titulo: 'Cambiar la bañera por un plato de ducha: cómo se hace, plazos y precio',
    metaDescripcion:
      'Pasos para cambiar la bañera por un plato de ducha, cuántos días se tarda, qué decisiones cambian el precio y cómo hacerlo accesible.',
    extracto:
      'Más espacio, más seguridad y menos limpieza, en muy pocos días y sin reformar todo el baño. Así se hace.',
    categoriaSlug: 'fontaneria',
    categoriaNombre: 'fontanería',
    oficioNombre: 'fontanero',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 5,
    preguntas: [
      {
        pregunta: '¿Cuánto se tarda en cambiar una bañera por un plato de ducha?',
        respuesta: 'Si el desagüe no da problemas, entre 1 y 3 días, más el tiempo de secado de las siliconas antes de usar la ducha.',
      },
      {
        pregunta: '¿Hay que cambiar todo el alicatado?',
        respuesta:
          'No necesariamente: se repone el azulejo de la zona que se pica. Si no encuentras el mismo, se puede revestir toda la zona de ducha con un panel o un porcelánico nuevo.',
      },
      {
        pregunta: '¿Cuánto cuesta cambiar la bañera por un plato de ducha?',
        respuesta: 'Como referencia, entre 1.000 y 3.000 € según el plato, la mampara, la grifería y el estado del desagüe.',
      },
    ],
    relacionados: ['cuanto-cuesta-reformar-un-bano', 'cuanto-cuesta-un-fontanero', 'como-comparar-presupuestos-de-reforma'],
    temas: ['baño', 'reformas', 'accesibilidad'],
  },
  {
    slug: 'como-comparar-presupuestos-de-reforma',
    imagen: '/fotos/blog/como-comparar-presupuestos-de-reforma.webp',
    imagenAlt: 'Tres presupuestos de reforma sujetos con imanes en la nevera; en uno, los sanitarios van aparte y están rodeados con rotulador rojo',
    titulo: 'Cómo comparar presupuestos de reforma: los 8 puntos que tienes que mirar',
    metaDescripcion:
      'Alcance, materiales, IVA, exclusiones, plazos y pagos: la lista para poner varios presupuestos de reforma en igualdad de condiciones y elegir bien.',
    extracto:
      'Si un presupuesto cuesta el doble que otro, casi nunca es un engaño: es que no presupuestan lo mismo. Así se comparan bien.',
    categoriaSlug: 'albanileria',
    categoriaNombre: 'reformas',
    oficioNombre: 'profesional de reformas',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 5,
    preguntas: [
      {
        pregunta: '¿Cuántos presupuestos conviene pedir para una reforma?',
        respuesta: 'Tres suele ser un buen número: suficiente para comparar sin perder semanas en visitas.',
      },
      {
        pregunta: '¿Qué IVA lleva una reforma de vivienda?',
        respuesta:
          'Depende de la obra. En algunas reformas y reparaciones de vivienda habitual se puede aplicar un IVA reducido: pregúntalo al profesional y comprueba que el presupuesto indica qué IVA aplica.',
      },
      {
        pregunta: '¿Un presupuesto orientativo es un contrato?',
        respuesta:
          'No. Una estimación orientativa sirve para comparar. Antes de empezar la obra, pide el presupuesto definitivo por escrito, después de la visita.',
      },
    ],
    relacionados: ['como-organizar-una-reforma-integral', 'cuanto-cuesta-reformar-un-bano', 'cuanto-cuesta-reformar-una-cocina'],
    temas: ['reformas', 'presupuestos'],
  },
  {
    slug: 'pintar-fachada-zona-costera-cantabria',
    imagen: '/fotos/blog/pintar-fachada-zona-costera-cantabria.webp',
    imagenAlt: 'Abanico de cartas de colores para exterior junto a una nota sobre pintura de fachada contra el salitre',
    titulo: 'Pintar la fachada en la costa de Cantabria: cómo hacer que dure más',
    metaDescripcion:
      'Por qué las fachadas junto al mar se estropean antes (salitre, lluvia, verdín) y cómo prepararlas y pintarlas para que la pintura dure años.',
    extracto:
      'Salitre, lluvia con viento y verdín: en la costa cantábrica la preparación de la fachada importa más que la pintura.',
    categoriaSlug: 'rehabilitacion-fachadas',
    categoriaNombre: 'rehabilitación de fachadas',
    oficioNombre: 'profesional de fachadas',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 6,
    preguntas: [
      {
        pregunta: '¿Cuál es la mejor época para pintar una fachada en Cantabria?',
        respuesta:
          'Cuando haya varios días secos seguidos y sin heladas, algo que suele concentrarse entre finales de primavera y principios de otoño.',
      },
      {
        pregunta: '¿Qué pintura aguanta mejor junto al mar?',
        respuesta:
          'Una pintura de exterior de calidad, transpirable y resistente a la intemperie. En zonas muy expuestas suelen funcionar mejor los revestimientos elásticos o de siloxano.',
      },
      {
        pregunta: '¿Necesito permiso para pintar la fachada?',
        respuesta:
          'La fachada de un edificio la decide la comunidad de propietarios, y muchos ayuntamientos piden permiso, sobre todo si hay andamio en la vía pública. Consúltalo en el tuyo.',
      },
    ],
    relacionados: ['humedades-en-casa-cantabria', 'cuanto-cuesta-pintar-un-piso', 'como-comparar-presupuestos-de-reforma'],
    temas: ['fachadas', 'pintura', 'humedades'],
  },
  {
    slug: 'cuanto-cuesta-reformar-una-cocina',
    imagen: '/fotos/blog/cuanto-cuesta-reformar-una-cocina.webp',
    imagenAlt: 'Plano de una cocina en L con muestras de madera de roble y de encimera de piedra sobre la encimera',
    titulo: 'Cuánto cuesta reformar una cocina: partidas, rangos y orden de los trabajos',
    metaDescripcion:
      'Las partidas de una reforma de cocina (muebles, encimera, instalaciones, obra), rangos de precio orientativos y el orden en que se hacen los trabajos.',
    extracto:
      'En una cocina se juntan cinco oficios. Te explicamos qué estás pagando en cada uno y en qué orden se hace todo.',
    categoriaSlug: 'carpinteria-madera',
    categoriaNombre: 'carpintería y reformas',
    oficioNombre: 'profesional de cocinas',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 6,
    preguntas: [
      {
        pregunta: '¿Cuánto tarda una reforma de cocina?',
        respuesta:
          'Una reforma completa suele llevar entre dos y cuatro semanas. La encimera de piedra se mide con los muebles montados, así que puede añadir unos días.',
      },
      {
        pregunta: '¿Qué es lo que más encarece una cocina?',
        respuesta: 'Los muebles y la encimera, y mover el fregadero o la placa de sitio, porque obliga a cambiar las instalaciones.',
      },
      {
        pregunta: '¿Los electrodomésticos van incluidos en el presupuesto?',
        respuesta: 'Normalmente no: suelen comprarse aparte. Compruébalo y pide que el presupuesto lo diga claramente.',
      },
    ],
    relacionados: ['como-comparar-presupuestos-de-reforma', 'como-organizar-una-reforma-integral', 'cuanto-cuesta-reformar-un-bano'],
    temas: ['cocina', 'reformas', 'precios'],
  },
  {
    slug: 'cuanto-cuesta-cambiar-ventanas',
    imagen: '/fotos/blog/cuanto-cuesta-cambiar-ventanas.webp',
    imagenAlt: 'Hoja de medidas de una ventana dibujada a lápiz y una esquina de perfil de PVC con doble cristal sobre un tablero de obra',
    titulo: 'Cuánto cuesta cambiar las ventanas: aluminio o PVC, vidrio y precios',
    metaDescripcion:
      'Precios orientativos para cambiar las ventanas en Cantabria, diferencias entre aluminio con RPT y PVC, qué vidrio elegir y qué pedir en el presupuesto.',
    extracto:
      'Las ventanas viejas se notan en la factura y en la condensación. Qué material elegir, qué vidrio y cuánto cuesta cambiarlas de verdad.',
    categoriaSlug: 'carpinteria-aluminio-pvc',
    categoriaNombre: 'carpintería de aluminio y PVC',
    oficioNombre: 'carpintero de aluminio',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 6,
    preguntas: [
      {
        pregunta: '¿Qué aísla más, el aluminio o el PVC?',
        respuesta:
          'De serie, el PVC aísla algo más. Un aluminio con rotura de puente térmico de buena gama se queda muy cerca y permite perfiles más finos. Lo que más diferencia marca es el vidrio y la instalación.',
      },
      {
        pregunta: '¿Cuánto se tarda en cambiar las ventanas de un piso?',
        respuesta:
          'La fabricación lleva entre dos y seis semanas. La instalación de un piso completo suele hacerse en uno o dos días.',
      },
      {
        pregunta: '¿Necesito permiso de la comunidad para cambiar las ventanas?',
        respuesta:
          'Si no cambias el hueco, normalmente no, pero muchas comunidades exigen un color o modelo para mantener la fachada uniforme. Pregunta al administrador antes de encargarlas.',
      },
    ],
    relacionados: ['aislar-casa-del-frio', 'persianas-que-no-suben', 'cerrar-la-terraza'],
    temas: ['ventanas', 'aislamiento', 'precios'],
  },
  {
    slug: 'placas-solares-cantabria',
    imagen: '/fotos/blog/placas-solares-cantabria.webp',
    imagenAlt: 'Factura de la luz con el consumo por meses rodeado a boli y un pósit que pregunta si compensan las placas, sujetos con imanes en la nevera',
    titulo: '¿Compensan las placas solares en Cantabria? Producción, precio y trámites',
    metaDescripcion:
      'Cuánto produce una instalación solar en Cantabria, cuánto cuesta, cuándo compensa y qué trámites y ayudas hay. Con cifras orientativas para tu casa.',
    extracto:
      '«Aquí no hay sol» es lo que más se oye. Te contamos cuánto produce de verdad un panel en Cantabria y en qué casas sale a cuenta.',
    categoriaSlug: 'energia-solar',
    categoriaNombre: 'energía solar',
    oficioNombre: 'instalador de placas solares',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 7,
    preguntas: [
      {
        pregunta: '¿Merecen la pena las placas solares en el norte de España?',
        respuesta:
          'En muchas casas sí. En Cantabria cada kWp produce alrededor de 1.000 – 1.200 kWh al año con buena orientación. Compensa más cuanto más consumo tengas en las horas de sol.',
      },
      {
        pregunta: '¿Hace falta batería?',
        respuesta:
          'No es obligatoria y rara vez sale rentable por sí sola. Antes conviene mirar la compensación de excedentes de tu comercializadora y mover consumo a las horas de sol.',
      },
      {
        pregunta: '¿Puedo poner placas solares en un piso?',
        respuesta:
          'Sí, con autoconsumo compartido en el tejado del edificio, pero necesitas el acuerdo de la comunidad de propietarios.',
      },
    ],
    relacionados: ['aire-acondicionado-o-bomba-de-calor', 'aislar-casa-del-frio', 'boletin-electrico-cie'],
    temas: ['energía', 'precios', 'trámites'],
  },
  {
    slug: 'aislar-casa-del-frio',
    imagen: '/fotos/blog/aislar-casa-del-frio.webp',
    imagenAlt: 'Muestra de panel de lana de roca y un croquis de una pared con cámara de aire sobre el suelo de obra',
    titulo: 'Cómo aislar una casa del frío: cámara, trasdosado o SATE',
    metaDescripcion:
      'Por dónde se escapa el calor de tu casa y las tres formas de aislar las paredes (insuflado, trasdosado y SATE) con precios orientativos.',
    extracto:
      'Paredes frías, calefacción que no da abasto y condensación: así se aísla una casa antigua y por dónde empezar con poco presupuesto.',
    categoriaSlug: 'aislamiento',
    categoriaNombre: 'aislamiento',
    oficioNombre: 'profesional de aislamiento',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 6,
    preguntas: [
      {
        pregunta: '¿Qué es el insuflado en cámara?',
        respuesta:
          'Rellenar la cámara de aire de las paredes con lana mineral o celulosa a través de pequeños agujeros. Es rápido, no necesita obra y solo sirve si la pared tiene cámara.',
      },
      {
        pregunta: '¿Aislar la casa quita las humedades?',
        respuesta:
          'Ayuda mucho con las de condensación, porque la pared deja de estar fría. No arregla las filtraciones ni la capilaridad, que hay que cortar en su origen.',
      },
      {
        pregunta: '¿Necesito permiso para aislar la fachada por fuera?',
        respuesta:
          'Sí. El SATE cambia la fachada, así que necesita acuerdo de la comunidad y licencia del ayuntamiento.',
      },
    ],
    relacionados: ['humedades-en-casa-cantabria', 'cuanto-cuesta-cambiar-ventanas', 'pladur-en-casa'],
    temas: ['aislamiento', 'humedades', 'reformas'],
  },
  {
    slug: 'que-suelo-poner-en-casa',
    imagen: '/fotos/blog/que-suelo-poner-en-casa.webp',
    imagenAlt: 'Tres muestras de suelo, de tarima, laminado y vinílico, junto a un metro de cinta sobre el suelo de obra',
    titulo: 'Tarima, laminado o vinílico: qué suelo poner en casa',
    metaDescripcion:
      'Diferencias entre suelo laminado, vinílico y tarima de madera, qué poner en cada estancia, si se puede colocar encima del suelo viejo y cuánto cuesta.',
    extracto:
      'Se parecen en las fotos, pero no aguantan igual la humedad. Qué suelo poner en cada habitación y cuánto cuesta cada uno instalado.',
    categoriaSlug: 'suelos-tarimas',
    categoriaNombre: 'suelos y tarimas',
    oficioNombre: 'instalador de suelos',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 6,
    preguntas: [
      {
        pregunta: '¿Se puede poner suelo laminado encima de la baldosa?',
        respuesta:
          'Sí, si la baldosa está bien pegada y nivelada. Hay que vigilar la altura, porque puede que haya que recortar las puertas.',
      },
      {
        pregunta: '¿Qué suelo aguanta mejor la humedad?',
        respuesta:
          'El vinílico con núcleo rígido (SPC) resiste el agua. El laminado se hincha si se moja y la madera no se lleva bien con la humedad.',
      },
      {
        pregunta: '¿Cuánto material de más hay que comprar?',
        respuesta: 'Entre un 8 y un 10 % más de lo que mide la habitación, para cortes y para reposiciones futuras.',
      },
    ],
    relacionados: ['cambiar-puertas-de-interior', 'como-organizar-una-reforma-integral', 'como-comparar-presupuestos-de-reforma'],
    temas: ['suelos', 'reformas', 'precios'],
  },
  {
    slug: 'pladur-en-casa',
    imagen: '/fotos/blog/pladur-en-casa.webp',
    imagenAlt: 'Croquis a lápiz de un tabique de pladur con sus montantes y un trozo de perfil metálico sobre un tablero de contrachapado',
    titulo: 'Pladur en casa: tabiques, falsos techos y precios',
    metaDescripcion:
      'Para qué sirve el pladur en una vivienda, qué placa poner en cada sitio, qué no puede hacer y cuánto cuesta un tabique o un falso techo.',
    extracto:
      'Tabiques nuevos, techos bajados o paredes aisladas del vecino. Qué se puede hacer con pladur, qué placa elegir y cuánto cuesta.',
    categoriaSlug: 'pladur-falsos-techos',
    categoriaNombre: 'pladur y falsos techos',
    oficioNombre: 'instalador de pladur',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 5,
    preguntas: [
      {
        pregunta: '¿Se puede poner pladur en el baño?',
        respuesta: 'Sí, con placa hidrófuga (la de cara verde) y bien protegida en las zonas que se mojan.',
      },
      {
        pregunta: '¿El pladur aísla del ruido?',
        respuesta:
          'Solo si lleva lana mineral dentro y está bien sellado en los bordes. Una placa sola, sin aislante, apenas mejora el ruido.',
      },
      {
        pregunta: '¿Se puede colgar una televisión en una pared de pladur?',
        respuesta:
          'Sí, con tacos específicos para placa o, mejor, reforzando esa zona por dentro antes de cerrar la pared.',
      },
    ],
    relacionados: ['tirar-un-tabique', 'aislar-casa-del-frio', 'como-organizar-una-reforma-integral'],
    temas: ['pladur', 'reformas', 'precios'],
  },
  {
    slug: 'urgencias-en-casa',
    imagen: '/fotos/blog/urgencias-en-casa.webp',
    imagenAlt: 'Lista a mano de qué hacer en una urgencia en casa (fuga, apagón, olor a gas) sujeta con imanes en la puerta de la nevera',
    titulo: 'Urgencias en casa: qué hacer ante una fuga de agua, un apagón o un atasco',
    metaDescripcion:
      'Qué hacer en los primeros minutos si hay una fuga de agua, se va la luz, huele a gas o se atasca un desagüe, y cuánto cuesta un servicio de urgencias.',
    extracto:
      'Lo que hagas en los primeros minutos marca la diferencia entre un susto y una reparación cara. Una guía para tenerla a mano antes de necesitarla.',
    categoriaSlug: 'urgencias-24h',
    categoriaNombre: 'urgencias 24 h',
    oficioNombre: 'profesional de urgencias',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 5,
    preguntas: [
      {
        pregunta: '¿Dónde está la llave de paso del agua?',
        respuesta:
          'Suele estar en la cocina, en el baño, junto al contador o en el rellano. Búscala antes de necesitarla y comprueba que cierra.',
      },
      {
        pregunta: '¿Cuánto cuesta un fontanero o electricista de urgencias?',
        respuesta:
          'Como orientación, la salida cuesta entre 40 y 80 € en horario laboral y entre 80 y 150 € de noche o en festivo, más las horas de trabajo.',
      },
      {
        pregunta: '¿Qué hago si huele a gas?',
        respuesta:
          'Cierra la llave del gas, abre las ventanas, no toques luces ni aparatos, sal de casa y llama desde fuera al teléfono de urgencias de tu distribuidora o al 112.',
      },
    ],
    relacionados: ['cuando-llamar-a-un-electricista', 'cuanto-cuesta-un-fontanero', 'revision-caldera-de-gas'],
    temas: ['urgencias', 'fontanería', 'electricidad'],
  },
  {
    slug: 'persianas-que-no-suben',
    imagen: '/fotos/blog/persianas-que-no-suben.webp',
    imagenAlt: 'Rollo de cinta de persiana nueva y una lama rota pegados con cinta en una pared blanca junto a una nota',
    titulo: 'Persianas que no suben: averías, arreglo y cuánto cuesta motorizarlas',
    metaDescripcion:
      'Por qué no sube tu persiana, qué arreglo necesita y cuánto cuesta cambiar la cinta, el recogedor o motorizarla. Precios orientativos.',
    extracto:
      'Cinta rota, persiana que baja de golpe o que se atasca a medias: casi todo se arregla en una hora. Y motorizarla cuesta menos de lo que parece.',
    categoriaSlug: 'persianas-cerramientos',
    categoriaNombre: 'persianas y cerramientos',
    oficioNombre: 'persianista',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 4,
    preguntas: [
      {
        pregunta: '¿Cuánto cuesta cambiar la cinta de una persiana?',
        respuesta: 'Como orientación, entre 40 y 90 € con la mano de obra. Si también hay que cambiar el recogedor, entre 60 y 120 €.',
      },
      {
        pregunta: '¿Se puede motorizar cualquier persiana?',
        respuesta:
          'Casi todas, si están en buen estado. Hace falta un punto de luz cerca del cajón y un motor con fuerza suficiente para el peso de la persiana.',
      },
      {
        pregunta: '¿Por qué baja la persiana de golpe?',
        respuesta:
          'Normalmente porque se han soltado las lamas del eje o se ha roto la polea. Conviene no usarla hasta que la revisen, porque puede caer entera.',
      },
    ],
    relacionados: ['cuanto-cuesta-cambiar-ventanas', 'aislar-casa-del-frio', 'cerrar-la-terraza'],
    temas: ['ventanas', 'mantenimiento', 'precios'],
  },
  {
    slug: 'cerrar-la-terraza',
    imagen: '/fotos/blog/cerrar-la-terraza.webp',
    imagenAlt: 'Acta de la junta de propietarios con el punto del cierre de terrazas rodeado y un boceto del cerramiento sobre una mesa de madera',
    titulo: 'Cerrar la terraza: permisos, tipos de cerramiento y precios',
    metaDescripcion:
      'Qué permisos necesitas para cerrar la terraza (comunidad y ayuntamiento), diferencias entre cortina de cristal y aluminio, y precios orientativos.',
    extracto:
      'Con el viento y la lluvia, una terraza abierta se usa poco. Antes de cerrarla, esto es lo que necesitas saber sobre los permisos y los tipos de cierre.',
    categoriaSlug: 'persianas-cerramientos',
    categoriaNombre: 'persianas y cerramientos',
    oficioNombre: 'profesional de cerramientos',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 5,
    preguntas: [
      {
        pregunta: '¿Necesito permiso de la comunidad para cerrar la terraza?',
        respuesta:
          'Normalmente sí, porque cambia la fachada, que es un elemento común. Muchas comunidades aprueban un modelo único para todas las terrazas.',
      },
      {
        pregunta: '¿Qué es mejor, cortina de cristal o ventanas de aluminio?',
        respuesta:
          'La cortina de cristal es más diáfana y protege del viento y la lluvia, pero aísla poco. Si quieres usar la terraza en invierno, mejor perfil con rotura de puente térmico.',
      },
      {
        pregunta: '¿Se puede cerrar una terraza donde está la caldera?',
        respuesta:
          'Con mucho cuidado: la caldera necesita ventilación y salida de humos. Consúltalo con un instalador de gas antes de cerrarla.',
      },
    ],
    relacionados: ['cuanto-cuesta-cambiar-ventanas', 'persianas-que-no-suben', 'revision-caldera-de-gas'],
    temas: ['ventanas', 'trámites', 'reformas'],
  },
  {
    slug: 'tirar-un-tabique',
    imagen: '/fotos/blog/tirar-un-tabique.webp',
    imagenAlt: 'Plano de un piso a lápiz con una pared tachada en rojo y la pregunta de si es de carga, junto a un nivel de burbuja',
    titulo: 'Tirar un tabique: cómo saber si es de carga, permisos y precio',
    metaDescripcion:
      'Cómo distinguir un tabique de un muro de carga, qué permisos hacen falta para derribarlo, cuánto cuesta y qué hacer si la pared es estructural.',
    extracto:
      'Un tabique se tira en un día; un muro de carga sostiene el edificio. Pistas para distinguirlos, permisos y precios orientativos.',
    categoriaSlug: 'derribos-desescombros',
    categoriaNombre: 'derribos y desescombros',
    oficioNombre: 'profesional de reformas',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 5,
    preguntas: [
      {
        pregunta: '¿Cómo sé si una pared es de carga?',
        respuesta:
          'Hay pistas, como un grosor de 15 cm o más, un sonido macizo o que la pared se repita en todos los pisos. Pero solo un arquitecto o arquitecto técnico puede confirmarlo.',
      },
      {
        pregunta: '¿Necesito permiso para tirar un tabique?',
        respuesta:
          'Normalmente basta con una licencia de obra menor o una comunicación previa en el ayuntamiento. Si es un muro de carga, hace falta proyecto técnico y licencia de obra mayor.',
      },
      {
        pregunta: '¿Cuánto cuesta tirar un tabique?',
        respuesta:
          'Como orientación, el derribo y la retirada del escombro cuestan entre 25 y 45 € por m², a lo que hay que sumar los remates de suelo, techo y paredes.',
      },
    ],
    relacionados: ['pladur-en-casa', 'como-organizar-una-reforma-integral', 'cuanto-cuesta-reformar-una-cocina'],
    temas: ['reformas', 'trámites', 'precios'],
  },
  {
    slug: 'goteras-en-el-tejado',
    imagen: '/fotos/blog/goteras-en-el-tejado.webp',
    imagenAlt: 'Teja cerámica partida en dos y una nota que marca la fila del tejado donde entra el agua, sobre una mesa de madera',
    titulo: 'Goteras en el tejado: por dónde entra el agua y cuándo hay que rehacerlo',
    metaDescripcion:
      'Las causas más comunes de las goteras en Cantabria, cuándo basta una reparación y cuándo hay que retejar, quién paga en un edificio y precios orientativos.',
    extracto:
      'Una gotera rara vez sale debajo de donde entra el agua. Por dónde suele filtrarse, cuándo basta un arreglo y cuánto cuesta rehacer el tejado.',
    categoriaSlug: 'impermeabilizaciones',
    categoriaNombre: 'impermeabilizaciones',
    oficioNombre: 'especialista en cubiertas',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 5,
    preguntas: [
      {
        pregunta: '¿Quién paga una gotera del tejado en un piso?',
        respuesta:
          'El tejado es un elemento común, así que la reparación la paga normalmente la comunidad. Los daños en tu vivienda suele cubrirlos el seguro de la comunidad.',
      },
      {
        pregunta: '¿Cada cuánto hay que revisar el tejado?',
        respuesta:
          'Conviene revisarlo y limpiar los canalones cada uno o dos años, y siempre después de un temporal fuerte.',
      },
      {
        pregunta: '¿Cuánto cuesta arreglar una gotera?',
        respuesta:
          'Una reparación puntual suele costar entre 250 y 900 €. Si hay que retejar con lámina nueva, el precio orientativo es de 60 a 110 € por m².',
      },
    ],
    relacionados: ['humedades-en-casa-cantabria', 'pintar-fachada-zona-costera-cantabria', 'aislar-casa-del-frio'],
    temas: ['humedades', 'mantenimiento', 'precios'],
  },
  {
    slug: 'cuanto-cuesta-un-electricista',
    imagen: '/fotos/blog/cuanto-cuesta-un-electricista.webp',
    imagenAlt: 'Parte de trabajo de un electricista en una tablilla con pinza, con desplazamiento, horas y material, sobre un tablero de madera',
    titulo: 'Cuánto cuesta un electricista: precios orientativos por trabajo',
    metaDescripcion:
      'Cuánto cobra un electricista en Cantabria por desplazamiento, por hora y por los trabajos más habituales: enchufes, lámparas, cuadro, boletín y renovación.',
    extracto:
      'Desplazamiento, horas y material: así se calcula lo que cobra un electricista, con precios orientativos de los trabajos más habituales.',
    categoriaSlug: 'electricidad',
    categoriaNombre: 'electricidad',
    oficioNombre: 'electricista',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 5,
    preguntas: [
      {
        pregunta: '¿Cuánto cobra un electricista por hora?',
        respuesta:
          'Como orientación, entre 30 y 50 € la hora, más el desplazamiento (20 – 45 €). Las urgencias de noche o en festivo tienen recargo.',
      },
      {
        pregunta: '¿Cuánto cuesta cambiar el cuadro eléctrico?',
        respuesta: 'En una vivienda normal, entre 400 y 900 € según las protecciones que lleve y si hay que adaptar la instalación.',
      },
      {
        pregunta: '¿Cuándo hay que renovar toda la instalación eléctrica?',
        respuesta:
          'Si la casa tiene más de 30 o 40 años, enchufes sin toma de tierra, cables de tela o fusibles de porcelana, conviene renovarla.',
      },
    ],
    relacionados: ['cuando-llamar-a-un-electricista', 'boletin-electrico-cie', 'urgencias-en-casa'],
    temas: ['electricidad', 'precios'],
  },
  {
    slug: 'cambiar-puertas-de-interior',
    imagen: '/fotos/blog/cambiar-puertas-de-interior.webp',
    imagenAlt: 'Ficha de catálogo con tres modelos de puerta lacada dibujados y una manilla de acero sobre una mesa de madera',
    titulo: 'Cambiar las puertas de interior: lacar, cambiar la hoja o la puerta entera',
    metaDescripcion:
      'Las opciones para renovar las puertas de casa (lacarlas, cambiar solo la hoja o el block completo), precios orientativos y qué pedir en el presupuesto.',
    extracto:
      'Cambiar las puertas oscuras por lacadas en blanco transforma la casa en uno o dos días. Qué opción elegir y cuánto cuesta cada una.',
    categoriaSlug: 'puertas-ventanas',
    categoriaNombre: 'puertas y ventanas',
    oficioNombre: 'carpintero',
    fechaPublicacion: '2026-10-25',
    tiempoLecturaMin: 4,
    preguntas: [
      {
        pregunta: '¿Se pueden cambiar las puertas sin cambiar el marco?',
        respuesta: 'Sí, si los marcos están bien y las medidas son estándar. Es la opción más barata.',
      },
      {
        pregunta: '¿Es mejor lacar las puertas o cambiarlas?',
        respuesta:
          'Si son de madera maciza de buena calidad, lacarlas conserva una puerta mejor que muchas nuevas. Si son de chapa barata o están dañadas, compensa cambiarlas.',
      },
      {
        pregunta: '¿Cuánto cuesta una puerta corredera empotrada?',
        respuesta:
          'Como orientación, entre 600 y 1.200 € con la obra de abrir la pared, el armazón y la puerta.',
      },
    ],
    relacionados: ['que-suelo-poner-en-casa', 'cuanto-cuesta-pintar-un-piso', 'como-comparar-presupuestos-de-reforma'],
    temas: ['carpintería', 'reformas', 'precios'],
  },
  {
    slug: 'cuanto-cuesta-un-fontanero',
    imagen: '/fotos/blog/cuanto-cuesta-un-fontanero.webp',
    imagenAlt: 'Lista de averías de fontanería escrita a mano en una hoja de libreta, junto a una llave inglesa colgada en el tablero del taller',
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
    preguntas: [
      {
        pregunta: '¿Cuánto cobra un fontanero por la visita?',
        respuesta: 'Suele estar entre 30 y 60 €, y muchos la descuentan si después haces la reparación con ellos. Pregúntalo antes de que vengan.',
      },
      {
        pregunta: '¿Es más caro un fontanero de urgencia?',
        respuesta: 'Sí: los avisos nocturnos, en fin de semana o festivos llevan recargo, que puede llegar a duplicar el precio de la visita.',
      },
    ],
    relacionados: ['cambiar-banera-por-plato-de-ducha', 'cuanto-cuesta-reformar-un-bano', 'como-comparar-presupuestos-de-reforma'],
    temas: ['fontanería', 'precios'],
  },
  {
    slug: 'cuando-llamar-a-un-electricista',
    imagen: '/fotos/blog/cuando-llamar-a-un-electricista.webp',
    imagenAlt: 'Dibujo del cuadro eléctrico de casa con el diferencial bajado y una cinta de rotuladora que dice «salta el diferencial»',
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
    preguntas: [
      {
        pregunta: '¿Por qué salta el diferencial?',
        respuesta:
          'Suele ser una derivación: un aparato o un cable con un defecto que deja escapar corriente. Si salta a menudo, desenchufa aparatos para localizarlo y llama a un electricista.',
      },
      {
        pregunta: '¿Es peligroso un enchufe que se calienta?',
        respuesta: 'Sí. Puede indicar una mala conexión o una sobrecarga y es riesgo de incendio. Deja de usarlo y pide que lo revisen.',
      },
    ],
    relacionados: ['boletin-electrico-cie', 'como-organizar-una-reforma-integral', 'como-comparar-presupuestos-de-reforma'],
    temas: ['electricidad', 'mantenimiento'],
  },
  {
    slug: 'aire-acondicionado-o-bomba-de-calor',
    imagen: '/fotos/blog/aire-acondicionado-o-bomba-de-calor.webp',
    imagenAlt: 'Etiqueta energética de un aparato de clase A+++ junto a una nota sobre frío, calor y agua caliente',
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
    preguntas: [
      {
        pregunta: '¿Una bomba de calor sirve para calentar en invierno?',
        respuesta: 'Sí: una bomba de calor da frío y calor. En un clima templado como el de la costa cantábrica funciona bien también en invierno.',
      },
    ],
    relacionados: ['revision-caldera-de-gas', 'humedades-en-casa-cantabria', 'como-comparar-presupuestos-de-reforma'],
    temas: ['climatización', 'calefacción'],
  },
  {
    slug: 'cuanto-cuesta-pintar-un-piso',
    imagen: '/fotos/blog/cuanto-cuesta-pintar-un-piso.webp',
    imagenAlt: 'Carta de colores verdes para interior con un tono rodeado y un removedor de pintura recién mojado, sobre la lona del pintor',
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
    preguntas: [
      {
        pregunta: '¿Los metros de pintura son los del suelo o los de las paredes?',
        respuesta:
          'Los pintores suelen calcular sobre la superficie de paredes y techos, no sobre los metros del piso. Pregunta cómo lo mide cada uno para comparar bien.',
      },
    ],
    relacionados: ['pintar-fachada-zona-costera-cantabria', 'humedades-en-casa-cantabria', 'como-comparar-presupuestos-de-reforma'],
    temas: ['pintura', 'precios'],
  },
  {
    slug: 'como-organizar-una-reforma-integral',
    imagen: '/fotos/blog/como-organizar-una-reforma-integral.webp',
    imagenAlt: 'Calendario de obra de siete semanas con los oficios marcados con fluorescente y un llavero con las llaves de la obra',
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
    preguntas: [
      {
        pregunta: '¿En qué orden se hace una reforma integral?',
        respuesta:
          'Primero demolición, después instalaciones (fontanería y electricidad), luego albañilería y revestimientos, carpintería, y por último pintura y remates.',
      },
    ],
    relacionados: ['como-comparar-presupuestos-de-reforma', 'cuanto-cuesta-reformar-un-bano', 'cuanto-cuesta-reformar-una-cocina'],
    temas: ['reformas', 'presupuestos'],
  },
]

export function obtenerPost(slug: string | undefined): PostBlog | undefined {
  return POSTS.find((post) => post.slug === slug)
}
