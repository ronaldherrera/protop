import { Link } from 'react-router-dom'
import { H2, LI, Nota, P, UL } from '../ArticuloUI'

export function AireAcondicionadoOBombaDeCalor() {
  return (
    <>
      <P>
        Se suelen mencionar casi como sinónimos, pero un aire acondicionado y una bomba de calor no resuelven lo
        mismo ni cuestan lo mismo. La confusión es normal: por dentro comparten buena parte de la tecnología, así que
        la diferencia está en para qué se usa cada una y qué necesita tu vivienda.
      </P>

      <H2>La diferencia real entre los dos</H2>
      <P>
        Un aire acondicionado clásico enfría; algunos modelos también dan calor en invierno mediante la función
        "bomba de calor" integrada, pero pensados sobre todo para un uso puntual y por estancias. Una bomba de calor
        propiamente dicha —normalmente asociada a un sistema de calefacción por suelo radiante o radiadores, o a la
        producción de agua caliente— está diseñada para climatizar toda la vivienda de forma continua y eficiente,
        sustituyendo a una caldera de gas o gasóleo.
      </P>

      <H2>Cuándo compensa cada una</H2>
      <UL>
        <LI>
          <strong>Aire acondicionado (splits):</strong> si el problema es sobre todo el calor en verano, en una o
          varias estancias, y ya tienes calefacción resuelta de otra forma.
        </LI>
        <LI>
          <strong>Bomba de calor aerotérmica:</strong> si estás renovando la calefacción de toda la vivienda, sobre
          todo si vienes de una caldera de gasóleo o de una instalación eléctrica poco eficiente, y quieres cubrir
          calefacción, refrigeración y agua caliente con un único sistema.
        </LI>
        <LI>
          <strong>Combinación de ambas:</strong> en reformas de vivienda completa es habitual instalar una bomba de
          calor para climatización general y mantener algún split adicional en estancias que se usan de forma puntual.
        </LI>
      </UL>

      <H2>Precios orientativos de instalación</H2>
      <P>
        Los rangos dependen mucho de la potencia necesaria, la marca y si hay que adaptar instalación eléctrica o de
        fontanería, pero como referencia orientativa:
      </P>
      <UL>
        <LI>
          <strong>Split de una sola zona</strong> (habitación o salón pequeño): entre 700 € y 1.400 € instalado.
        </LI>
        <LI>
          <strong>Multisplit de 2-3 zonas:</strong> entre 1.800 € y 3.500 € instalado, según potencia y marca.
        </LI>
        <LI>
          <strong>Bomba de calor aerotérmica para vivienda completa:</strong> desde 6.000 € hasta más de 12.000 €,
          según si sustituye a suelo radiante existente o requiere obra adicional.
        </LI>
      </UL>

      <Nota>
        Estos precios son orientativos: la potencia real que necesita tu vivienda depende de su aislamiento, la
        orientación y los metros a climatizar. Un buen instalador calcula la carga térmica antes de proponer equipo,
        no después.
      </Nota>

      <H2>Qué preguntar antes de decidir</H2>
      <P>
        Además del precio, merece la pena preguntar por la eficiencia energética del equipo (el SEER y el SCOP dan
        una idea del consumo real, no solo la potencia nominal), el nivel de ruido de la unidad exterior si hay
        vecinos cerca, y si el precio incluye la puesta en marcha y el mantenimiento del primer año.
      </P>

      <H2>Cómo comparar presupuestos de climatización</H2>
      <P>
        Como es una decisión que dura muchos años, conviene no quedarse con la primera propuesta. Describe tu
        vivienda y lo que buscas una vez en Protop y recibe propuestas de varios{' '}
        <Link to="/aire-acondicionado" className="font-medium text-brand-700 hover:underline">
          técnicos de climatización de tu zona
        </Link>
        , para comparar equipo, precio y plazo antes de instalar nada.
      </P>
    </>
  )
}
