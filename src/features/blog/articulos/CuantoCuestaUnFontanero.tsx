import { Link } from 'react-router-dom'
import { H2, LI, Nota, P, UL } from '../ArticuloUI'

export function CuantoCuestaUnFontanero() {
  return (
    <>
      <P>
        Una fuga que no para, un grifo que gotea desde hace semanas o una reforma de baño que por fin te decides a
        hacer: casi siempre que se busca "cuánto cuesta un fontanero" es porque hay algo urgente de por medio, y eso
        es justo lo que dispara los precios si no se compara antes de contratar. No hay una tarifa única —depende del
        tipo de avería, de la vivienda y de la zona— pero sí hay rangos orientativos y señales claras de cuándo un
        presupuesto se ha ido de madre.
      </P>

      <H2>Qué factores cambian el precio de un fontanero</H2>
      <P>Antes de mirar cifras, conviene entender qué es lo que realmente mueve el precio final:</P>
      <UL>
        <LI>
          <strong>Urgencia y horario.</strong> Una intervención en horario normal no cuesta lo mismo que un aviso
          nocturno, en fin de semana o festivo: el recargo por urgencia puede duplicar la visita.
        </LI>
        <LI>
          <strong>Diagnóstico vs. reparación.</strong> Algunos profesionales cobran la visita aparte y la descuentan
          si finalmente haces el trabajo con ellos; otros la incluyen siempre. Conviene preguntarlo antes de que
          lleguen.
        </LI>
        <LI>
          <strong>Materiales.</strong> Una grifería, un termo o una cisterna pueden variar mucho de precio según la
          gama. Un presupuesto serio desglosa mano de obra y materiales por separado.
        </LI>
        <LI>
          <strong>Accesibilidad y antigüedad de la instalación.</strong> Tuberías antiguas, empotradas o de difícil
          acceso alargan el tiempo de trabajo y, con él, el coste.
        </LI>
      </UL>

      <H2>Precios orientativos por tipo de trabajo</H2>
      <P>
        Estos rangos son orientativos —varían según la zona y la dificultad real del trabajo— pero sirven para
        hacerte una idea antes de pedir presupuesto:
      </P>
      <UL>
        <LI>
          <strong>Visita y diagnóstico:</strong> entre 30 € y 60 €, a menudo descontable si se hace la reparación.
        </LI>
        <LI>
          <strong>Reparación de una fuga puntual:</strong> entre 60 € y 150 €, según la ubicación y el acceso.
        </LI>
        <LI>
          <strong>Cambio de grifería:</strong> entre 40 € y 90 € de mano de obra, más el precio del grifo elegido.
        </LI>
        <LI>
          <strong>Desatasco de tubería:</strong> entre 60 € y 180 €, más si hace falta maquinaria especial.
        </LI>
        <LI>
          <strong>Cambio de termo eléctrico:</strong> entre 100 € y 200 € de instalación, aparte del termo.
        </LI>
        <LI>
          <strong>Instalación completa de un baño:</strong> desde 800 € hasta varios miles, según metros y calidades.
        </LI>
      </UL>

      <Nota>
        Estos números son una referencia general, no una tarifa cerrada. La forma más fiable de saber lo que te va a
        costar tu caso concreto sigue siendo pedir presupuesto a varios profesionales que hayan visto el problema.
      </Nota>

      <H2>Señales de que te están cobrando de más</H2>
      <UL>
        <LI>Un presupuesto verbal, sin desglose de mano de obra y materiales, y sin nada por escrito.</LI>
        <LI>
          Precios muy por debajo de los demás sin explicación: a veces significa materiales de baja calidad o
          trabajo sin garantía.
        </LI>
        <LI>Insistencia en cobrar en efectivo y sin factura, lo que además te deja sin ninguna reclamación posible.</LI>
        <LI>Presión para decidir en el momento, sin darte tiempo a comparar con otro profesional.</LI>
      </UL>

      <H2>Cómo pedir presupuesto sin sustos</H2>
      <P>
        La forma más sencilla de no pagar de más es no depender de un único presupuesto. En Protop describes el
        trabajo una vez —con fotos si hace falta— y varios{' '}
        <Link to="/profesionales?categoria=fontaneria" className="font-medium text-brand-700 hover:underline">
          fontaneros de tu zona
        </Link>{' '}
        te envían su propuesta, para que puedas comparar precio, plazo y alcance antes de decidir. Y como las
        valoraciones de cada profesional están respaldadas por factura real, sabes si su reputación viene de trabajos
        de verdad o de estrellas compradas.
      </P>
    </>
  )
}
