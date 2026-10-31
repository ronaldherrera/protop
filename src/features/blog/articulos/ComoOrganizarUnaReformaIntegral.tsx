import { Link } from 'react-router-dom'
import { H2, LI, Nota, P, UL } from '../ArticuloUI'

export function ComoOrganizarUnaReformaIntegral() {
  return (
    <>
      <P>
        Una reforma integral no es "muchos trabajos sueltos a la vez": es una secuencia con un orden concreto, y
        saltárselo es una de las causas más habituales de sobrecostes y retrasos. Antes de pedir presupuestos,
        conviene tener claro qué fase va antes que cuál y cuánto suele durar cada una.
      </P>

      <H2>Las fases de una reforma integral, en orden</H2>
      <UL>
        <LI>
          <strong>1. Demolición y desescombro.</strong> Se retiran tabiques, alicatados, suelos y sanitarios que no
          se van a conservar. Suele durar de 2 a 5 días según los metros.
        </LI>
        <LI>
          <strong>2. Albañilería y nueva distribución.</strong> Levantamiento de tabiques nuevos, rozas para las
          instalaciones y preparación de paramentos. Entre 1 y 3 semanas.
        </LI>
        <LI>
          <strong>3. Instalaciones (electricidad, fontanería, climatización).</strong> Se tiende todo el cableado y
          tubería nuevos antes de cerrar paredes y suelos. Entre 1 y 2 semanas, y conviene que coincidan los tres
          oficios para no repetir rozas.
        </LI>
        <LI>
          <strong>4. Alicatados, solados y falsos techos.</strong> Se cierran los paramentos ya con las
          instalaciones dentro. Entre 1 y 3 semanas según superficie.
        </LI>
        <LI>
          <strong>5. Carpintería (puertas, ventanas, armarios).</strong> Se coloca una vez hechos los suelos, para
          ajustar bien las medidas. Entre 3 días y 1 semana de colocación.
        </LI>
        <LI>
          <strong>6. Pintura y acabados finales.</strong> Es de las últimas fases porque cualquier trabajo posterior
          mancharía o dañaría la pintura recién hecha. Entre 3 días y 1 semana.
        </LI>
        <LI>
          <strong>7. Remates y limpieza final.</strong> Sellados, ajustes de puertas, revisión de instalaciones y
          limpieza de obra antes de entregar la vivienda.
        </LI>
      </UL>

      <Nota>
        Como referencia muy orientativa, una reforma integral de un piso de 80-90 m² suele moverse entre 6 y 12
        semanas de obra, sin contar imprevistos. Una vivienda con instalaciones muy antiguas o cambios estructurales
        puede alargarse bastante más.
      </Nota>

      <H2>Por qué es tan difícil comparar presupuestos de reforma</H2>
      <P>
        Dos presupuestos de "reforma integral" pueden no incluir lo mismo: uno puede llevar la grifería y el otro
        no, uno puede incluir pintura y el otro dejarla fuera. Antes de comparar precios, asegúrate de que ambos
        presupuestos reflejan exactamente el mismo alcance: las mismas calidades de material, las mismas partidas
        incluidas y el mismo estado de partida de la vivienda.
      </P>

      <H2>Cómo pedir presupuestos que sí se puedan comparar</H2>
      <UL>
        <LI>Describe el estado actual de la vivienda y lo que quieres conseguir, con fotos si es posible.</LI>
        <LI>Pide que cada presupuesto desglose partidas por fase, no solo un total cerrado.</LI>
        <LI>Pregunta explícitamente qué calidades de material están incluidas en cada partida.</LI>
        <LI>Confirma el plazo estimado y qué pasa si se produce un imprevisto durante la obra.</LI>
      </UL>

      <H2>Un solo profesional o varios oficios por separado</H2>
      <P>
        Para una reforma integral grande, muchas personas prefieren un único profesional o empresa que coordine
        todos los oficios; para reformas más acotadas, a veces compensa contratar cada oficio por separado. En
        Protop puedes{' '}
        <Link to="/solicitar-presupuesto" className="font-medium text-brand-700 hover:underline">
          describir tu reforma una vez
        </Link>{' '}
        y recibir propuestas de varios profesionales, o consultar directamente el directorio de{' '}
        <Link to="/albaniles" className="font-medium text-brand-700 hover:underline">
          albañiles y reformas integrales de tu zona
        </Link>{' '}
        si ya sabes con quién quieres empezar a hablar.
      </P>
    </>
  )
}
