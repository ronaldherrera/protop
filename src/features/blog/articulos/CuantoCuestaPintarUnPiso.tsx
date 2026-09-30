import { Link } from 'react-router-dom'
import { H2, LI, Nota, P, UL } from '../ArticuloUI'

export function CuantoCuestaPintarUnPiso() {
  return (
    <>
      <P>
        "¿A cuánto el metro?" es la pregunta más habitual cuando se pide presupuesto de pintura, pero un profesional
        serio rara vez da un precio por metro sin más: el estado de la pared, el número de manos necesarias y los
        acabados elegidos cambian tanto el resultado que dos pisos del mismo tamaño pueden salir muy distintos de
        precio.
      </P>

      <H2>Cómo se calcula realmente el presupuesto</H2>
      <P>
        La mayoría de pintores calculan primero los metros cuadrados de superficie a pintar (no solo la superficie
        útil de la vivienda, sino paredes y techos), y sobre eso aplican un precio que depende de:
      </P>
      <UL>
        <LI>
          <strong>El estado de la pared.</strong> Una pared lisa y en buen estado necesita menos preparación que una
          con grietas, humedades o gotelé que hay que alisar antes de pintar.
        </LI>
        <LI>
          <strong>El número de manos.</strong> Un cambio de color oscuro a claro, o pintar sobre una superficie muy
          porosa, suele necesitar una mano más de lo habitual.
        </LI>
        <LI>
          <strong>Los acabados y detalles.</strong> Marcos, puertas, radiadores o molduras se cobran aparte del
          "liso" de pared y techo porque llevan más tiempo de trabajo manual.
        </LI>
        <LI>
          <strong>La pintura elegida.</strong> No es lo mismo una pintura plástica estándar que una lavable, técnica
          o con acabados especiales: el material puede suponer una parte importante del presupuesto.
        </LI>
      </UL>

      <H2>¿Cuántos m² pinta un profesional al día?</H2>
      <P>
        Como referencia orientativa, un pintor experimentado puede pintar entre 40 y 80 m² de pared lisa al día con
        rodillo, dependiendo de la preparación previa que necesite la superficie y del número de manos. Este dato es
        útil para hacerte una idea de los días de trabajo que implica tu vivienda, más que para calcular el precio
        tú mismo.
      </P>

      <H2>Precios orientativos para un piso completo</H2>
      <UL>
        <LI>
          <strong>Pintura lisa de pared y techo, en buen estado:</strong> entre 6 € y 10 € por m² de superficie.
        </LI>
        <LI>
          <strong>Con preparación previa</strong> (grietas, gotelé, humedades a tratar): entre 10 € y 16 € por m².
        </LI>
        <LI>
          <strong>Piso completo de 80-90 m² útiles,</strong> pintura estándar y buen estado de partida: entre 1.200 €
          y 2.200 € orientativos.
        </LI>
      </UL>

      <Nota>
        Estos rangos son orientativos y varían según la zona, la altura de techos y el acceso a la vivienda. Pide
        siempre que el presupuesto especifique m² incluidos, número de manos y qué queda fuera (marcos, persianas,
        radiadores…).
      </Nota>

      <H2>Cómo comparar presupuestos de pintura sin liarte</H2>
      <P>
        La forma más fiable de comparar dos presupuestos de pintura no es mirar solo el total, sino comprobar que
        ambos incluyen lo mismo: misma superficie, mismo número de manos y los mismos detalles (marcos, puertas,
        radiadores). En Protop puedes describir tu vivienda una vez y pedir presupuesto a varios{' '}
        <Link to="/profesionales?categoria=pintura-decoracion" className="font-medium text-brand-700 hover:underline">
          pintores de tu zona
        </Link>{' '}
        para comparar propuestas reales, alcance a alcance, antes de decidir.
      </P>
    </>
  )
}
