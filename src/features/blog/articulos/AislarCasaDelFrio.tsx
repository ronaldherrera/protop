import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Tabla, UL } from '../ArticuloUI'

export function AislarCasaDelFrio() {
  return (
    <>
      <P>
        Muchas casas de Cantabria se construyeron cuando apenas se exigía aislamiento. El resultado lo conoces: paredes
        frías al tacto, calefacción que no da abasto y condensación en las esquinas. Aislar bien no solo ahorra en la
        factura; también acaba con buena parte de las humedades por condensación.
      </P>

      <H2>Por dónde se escapa el calor</H2>
      <UL>
        <LI>
          <strong>Ventanas y cajones de persiana</strong>: suelen ser lo primero y lo más barato de mejorar.
        </LI>
        <LI>
          <strong>Fachada</strong>: la mayor superficie de la casa.
        </LI>
        <LI>
          <strong>Tejado o último forjado</strong>: crítico en casas unifamiliares y en áticos.
        </LI>
        <LI>
          <strong>Suelo sobre garaje o local</strong>: el gran olvidado en los primeros pisos.
        </LI>
      </UL>

      <H2>Las tres formas de aislar las paredes</H2>
      <Tabla
        filas={[
          ['Sistema', 'Cómo se hace', 'Precio orientativo', 'Lo bueno / lo malo'],
          ['Insuflado en cámara', 'Se rellena la cámara de aire con lana o celulosa por pequeños agujeros', '20 – 40 € / m²', 'Rápido y sin obra; solo si la pared tiene cámara'],
          ['Trasdosado interior', 'Se añade por dentro un panel aislante con placa de yeso', '35 – 60 € / m²', 'Se hace por pisos; resta unos centímetros a cada habitación'],
          ['SATE (por fuera)', 'Se pega aislante a la fachada y se reviste', '70 – 130 € / m²', 'El más eficaz; necesita acuerdo de la comunidad'],
        ]}
        nota="Rangos orientativos con IVA. El SATE suele hacerse en toda la fachada del edificio y puede tener ayudas a la rehabilitación."
      />

      <H2>Cómo saber si tu pared tiene cámara</H2>
      <P>
        En edificios de los años 60 a 90 es habitual una pared de ladrillo doble con una cámara de aire de 3 a 10 cm.
        Un profesional lo comprueba con un pequeño taladro o con una cámara endoscópica antes de presupuestar el
        insuflado. Si la cámara tiene restos de obra o está interrumpida, el resultado no será uniforme.
      </P>

      <Consejo>
        Una cámara termográfica en un día frío muestra exactamente por dónde se escapa el calor. Muchos profesionales
        hacen esa revisión antes de presupuestar, y es la mejor forma de no gastar en la zona equivocada.
      </Consejo>

      <H2>Ojo con la ventilación</H2>
      <P>
        Una casa mejor aislada y con ventanas nuevas deja entrar menos aire. Si no se ventila, la humedad que generamos
        al cocinar, ducharnos o tender se queda dentro. Ventila diez minutos al día, usa la extracción del baño y la
        cocina y, en reformas grandes, pregunta por la ventilación mecánica. Lo explicamos en{' '}
        <Link to="/blog/humedades-en-casa-cantabria" className="font-semibold text-brand-700 underline">
          humedades en casa en Cantabria
        </Link>
        .
      </P>

      <H2>Por dónde empezar con poco presupuesto</H2>
      <UL>
        <LI>Aislar los cajones de persiana y sellar las juntas de las ventanas: poco dinero y mucho efecto.</LI>
        <LI>
          Cambiar las ventanas más viejas (lee{' '}
          <Link to="/blog/cuanto-cuesta-cambiar-ventanas" className="font-semibold text-brand-700 underline">
            cuánto cuesta cambiar las ventanas
          </Link>
          ).
        </LI>
        <LI>Insuflar la cámara si la hay: suele recuperarse antes que otras mejoras.</LI>
      </UL>

      <P>
        Busca{' '}
        <Link to="/aislamiento-termico" className="font-semibold text-brand-700 underline">
          profesionales de aislamiento
        </Link>{' '}
        de tu zona en Protop y pide que te expliquen qué sistema encaja con tu casa.
      </P>
      <Nota>Guía informativa con precios orientativos. Cada vivienda necesita una valoración en persona.</Nota>
    </>
  )
}
