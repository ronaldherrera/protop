import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Tabla, UL } from '../ArticuloUI'

export function CambiarPuertasDeInterior() {
  return (
    <>
      <P>
        Las puertas de sapelli o de pino barnizado oscurecen cualquier pasillo. Cambiarlas por puertas lacadas en
        blanco es de las reformas con más efecto por euro gastado, y se puede hacer en uno o dos días sin obra. Lo que
        hay que decidir es si se cambia solo la hoja o la puerta entera con el marco.
      </P>

      <H2>Las tres maneras de renovarlas</H2>
      <Tabla
        filas={[
          ['Opción', 'Qué se hace', 'Precio orientativo por puerta'],
          ['Lacar las existentes', 'Se lijan y lacan en taller o en casa', '120 – 250 €'],
          ['Cambiar solo la hoja', 'Se aprovecha el marco y se cambia la puerta', '150 – 300 €'],
          ['Puerta completa (block)', 'Se quita el marco y se pone puerta, marco y tapajuntas nuevos', '200 – 450 €'],
          ['Corredera empotrada (casoneto)', 'La puerta se esconde dentro de la pared', '600 – 1.200 €'],
        ]}
        nota="Precios orientativos con IVA e instalación, para puertas lacadas en blanco de gama media."
      />

      <H2>Cómo elegir</H2>
      <UL>
        <LI>
          <strong>Si los marcos están bien y las medidas son estándar</strong>, cambiar solo la hoja es lo más barato.
        </LI>
        <LI>
          <strong>Si vas a cambiar el suelo</strong>, mejor puerta completa: el marco nuevo se ajusta a la altura del
          suelo nuevo. Lee{' '}
          <Link to="/blog/que-suelo-poner-en-casa" className="font-semibold text-brand-700 underline">
            qué suelo poner en casa
          </Link>
          .
        </LI>
        <LI>
          <strong>Si las puertas son de madera maciza buena</strong>, lacarlas conserva una puerta mejor que muchas
          nuevas.
        </LI>
        <LI>
          <strong>En pasillos estrechos o baños pequeños</strong>, una corredera gana mucho espacio, pero necesita
          abrir la pared.
        </LI>
      </UL>

      <Consejo>
        Fíjate en el canto y en el tapajuntas. Las puertas baratas suelen tener el canto de cartón o de aglomerado
        ligero y se golpean enseguida. Pide que te enseñen un corte de la puerta o una muestra.
      </Consejo>

      <H2>Lo que debe incluir el presupuesto</H2>
      <UL>
        <LI>Modelo, acabado y si la hoja es maciza o alveolar (hueca por dentro).</LI>
        <LI>Manillas, bisagras y condena del baño: a veces van aparte.</LI>
        <LI>Retirada de las puertas viejas y de los marcos.</LI>
        <LI>Plazo de entrega: las medidas especiales tardan varias semanas.</LI>
      </UL>
      <P>
        Busca{' '}
        <Link to="/puertas-y-ventanas" className="font-semibold text-brand-700 underline">
          profesionales de puertas
        </Link>{' '}
        o de{' '}
        <Link to="/carpinteros" className="font-semibold text-brand-700 underline">
          carpintería de madera
        </Link>{' '}
        en tu zona, y lee{' '}
        <Link to="/blog/como-comparar-presupuestos-de-reforma" className="font-semibold text-brand-700 underline">
          cómo comparar presupuestos de reforma
        </Link>{' '}
        antes de elegir.
      </P>
      <Nota>Precios orientativos para ayudarte a comparar presupuestos.</Nota>
    </>
  )
}
