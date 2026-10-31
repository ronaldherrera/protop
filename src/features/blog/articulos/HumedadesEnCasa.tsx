import { Link } from 'react-router-dom'
import { Consejo, H2, H3, LI, Nota, P, Paso, Pasos, Tabla, UL } from '../ArticuloUI'

export function HumedadesEnCasa() {
  return (
    <>
      <P>
        En Cantabria la humedad es casi un vecino más: inviernos templados pero lluviosos, muchos días de niebla y
        nordeste, y una parte importante de las viviendas construidas antes de que existieran las exigencias actuales de
        aislamiento. Por eso es tan habitual ver manchas negras en una esquina, pintura que se abomba o ese olor a
        cerrado que no se va. Antes de llamar a nadie, lo más útil es saber <strong>qué tipo de humedad tienes</strong>,
        porque cada una se arregla de una forma distinta y pagar el tratamiento equivocado es tirar el dinero.
      </P>

      <H2>Los tres tipos de humedad, y cómo distinguirlos</H2>
      <Tabla
        filas={[
          ['Tipo', 'Dónde aparece', 'Señales típicas'],
          [
            'Condensación',
            'Esquinas de techos, detrás de armarios, alrededor de ventanas, baños y dormitorios',
            'Puntos negros de moho, cristales empañados por la mañana, empeora en invierno y con la casa cerrada',
          ],
          [
            'Capilaridad',
            'Parte baja de las paredes, sobre todo en bajos y plantas a ras de suelo',
            'Franja de humedad hasta 1 metro de altura, salitre blanco, rodapiés que se despegan',
          ],
          [
            'Filtración',
            'Cualquier altura: bajo terrazas, junto a bajantes, en fachadas expuestas a la lluvia',
            'Mancha que crece después de llover, cerco de bordes marcados, goteo en casos graves',
          ],
        ]}
        nota="Pueden darse dos a la vez. Si dudas, un profesional puede medirla con un higrómetro o una cámara térmica."
      />

      <H3>Condensación: la más habitual en pisos de Santander</H3>
      <P>
        Aparece cuando el vapor de agua del aire (duchas, cocina, respiración, ropa tendida dentro) choca con una
        superficie fría y se convierte en agua. Las paredes que dan al exterior, los puentes térmicos junto a pilares y
        las ventanas antiguas de aluminio sin rotura de puente térmico son los puntos más fríos de la casa.
      </P>
      <P>
        La buena noticia es que muchas veces se corrige con hábitos y pequeños arreglos: ventilar 10 minutos al día
        incluso en invierno, no tender dentro sin ventilar, usar la campana y el extractor del baño, y separar un poco
        los muebles de las paredes frías. Si persiste, las soluciones de fondo pasan por mejorar el aislamiento o las
        ventanas, o por instalar ventilación mecánica.
      </P>

      <H3>Capilaridad: el agua que sube del terreno</H3>
      <P>
        Es típica de bajos, casas de pueblo y edificios antiguos sin una barrera contra la humedad del suelo. El agua
        sube por los poros del muro y, al evaporarse, deja sales que destrozan la pintura y el yeso. Pintar encima con
        pintura «antihumedad» solo la esconde unos meses: hay que cortar el paso del agua, normalmente con barreras
        químicas inyectadas en la base del muro, y después sanear y revocar con morteros transpirables.
      </P>

      <H3>Filtración: el agua que entra desde fuera</H3>
      <P>
        Llega por una fachada con grietas, una terraza mal impermeabilizada, un canalón que desborda o una junta de
        ventana deteriorada. En Cantabria, con lluvia frecuente y viento, las fachadas orientadas al norte y al
        noroeste sufren más. Aquí lo primero es encontrar por dónde entra el agua; tratar solo la mancha interior no
        sirve de nada.
      </P>

      <H2>Qué puedes hacer tú antes de llamar a nadie</H2>
      <Pasos>
        <Paso titulo="Observa cuándo empeora">
          Si va a peor después de llover, apunta a filtración. Si es peor en invierno, por la mañana y con las ventanas
          cerradas, a condensación. Si siempre está en la parte baja del muro, a capilaridad.
        </Paso>
        <Paso titulo="Haz la prueba del papel de aluminio">
          Pega con cinta un cuadrado de papel de aluminio sobre la mancha y espera 48 horas. Si aparece humedad por la
          cara de fuera, es condensación del ambiente; si aparece por la cara pegada a la pared, el agua viene del muro.
        </Paso>
        <Paso titulo="Haz fotos con fecha">
          Te servirán para enseñarle al profesional cómo evoluciona y, si el origen está en una zona común, para
          comunicarlo a la comunidad de vecinos.
        </Paso>
        <Paso titulo="Limpia el moho con seguridad">
          Con guantes y ventilando, una mezcla de agua con un poco de lejía elimina el moho superficial. No lo rasques en
          seco: las esporas se dispersan.
        </Paso>
      </Pasos>

      <Consejo>
        Si la humedad viene de la fachada, el tejado, una bajante o la terraza de un vecino, normalmente es un elemento
        común: avisa al presidente o al administrador de la comunidad por escrito antes de pagar una reparación por tu
        cuenta.
      </Consejo>

      <H2>A quién llamar según el tipo de humedad</H2>
      <UL>
        <LI>
          <strong>Condensación:</strong> si no basta con ventilar, un profesional de{' '}
          <Link to="/aislamiento-termico" className="font-semibold text-brand-700 underline">
            aislamiento
          </Link>{' '}
          o de{' '}
          <Link to="/carpinteria-de-aluminio" className="font-semibold text-brand-700 underline">
            carpintería de aluminio y PVC
          </Link>{' '}
          para cambiar ventanas.
        </LI>
        <LI>
          <strong>Capilaridad:</strong> una empresa especializada en humedades e{' '}
          <Link to="/impermeabilizaciones" className="font-semibold text-brand-700 underline">
            impermeabilizaciones
          </Link>
          .
        </LI>
        <LI>
          <strong>Filtración:</strong> según el origen, un profesional de{' '}
          <Link to="/rehabilitacion-de-fachadas" className="font-semibold text-brand-700 underline">
            rehabilitación de fachadas
          </Link>
          , impermeabilizaciones o{' '}
          <Link to="/fontaneros" className="font-semibold text-brand-700 underline">
            fontanería
          </Link>{' '}
          si sospechas de una tubería.
        </LI>
      </UL>

      <H2>Cómo pedir el presupuesto para no pagar de más</H2>
      <P>
        Pide siempre que el profesional te diga por escrito <strong>qué tipo de humedad ha diagnosticado y por qué</strong>,
        qué va a hacer para cortar la causa (no solo para tapar la mancha) y qué garantía da. Desconfía de quien ofrece un
        tratamiento «milagro» sin haber visto la vivienda o de quien solo propone pintar.
      </P>
      <Nota>
        Esta guía es orientativa. Cada vivienda es distinta y una humedad persistente puede esconder un problema
        estructural o una fuga: si la mancha crece rápido, huele a moho intenso o hay goteo, pide que la revise un
        profesional cuanto antes.
      </Nota>
    </>
  )
}
