import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Tabla, UL } from '../ArticuloUI'

export function ComoCompararPresupuestos() {
  return (
    <>
      <P>
        Pides tres presupuestos para la misma obra y te llegan uno de 2.800 €, otro de 4.100 € y otro de 6.000 €. Lo
        normal no es que dos de los profesionales te quieran engañar: lo normal es que{' '}
        <strong>no estén presupuestando lo mismo</strong>. Comparar bien no consiste en quedarse con el más barato, sino en
        poner los presupuestos en igualdad de condiciones. Esta es la lista que usamos en Protop para que las propuestas se
        puedan comparar de verdad.
      </P>

      <H2>Los 8 puntos que tiene que tener un buen presupuesto</H2>
      <Tabla
        filas={[
          ['Punto', 'Qué mirar'],
          ['Alcance', 'Qué se va a hacer exactamente, partida por partida. «Reforma de baño» no es suficiente.'],
          ['Materiales', 'Qué materiales están incluidos, con marca o gama, y cuáles pones tú.'],
          ['Mano de obra', 'Si está separada de los materiales o va todo junto.'],
          ['IVA', 'Si el importe lleva IVA incluido o no, y qué tipo se aplica.'],
          ['Exclusiones', 'Lo que no incluye: retirada de escombros, licencias, pintura, remates…'],
          ['Plazo', 'Cuándo empieza, cuánto dura y qué pasa si se retrasa.'],
          ['Pagos', 'Cuánto se paga al principio, durante y al final. Mejor ligado al avance de la obra.'],
          ['Validez', 'Hasta qué fecha se mantiene el precio.'],
        ]}
      />

      <H2>Cómo ponerlos en igualdad de condiciones</H2>
      <UL>
        <LI>
          <strong>Haz una tabla con los tres.</strong> Una fila por partida y una columna por profesional. Los huecos te
          dirán qué no incluye cada uno.
        </LI>
        <LI>
          <strong>Iguala el IVA.</strong> Un presupuesto «sin IVA» frente a otro «con IVA» puede parecer un 21 % más
          barato sin serlo. En algunas reformas de vivienda se aplica un IVA reducido: pregúntalo.
        </LI>
        <LI>
          <strong>Pregunta por las exclusiones.</strong> El más barato a menudo deja fuera algo que acabarás pagando como
          «extra».
        </LI>
        <LI>
          <strong>Compara calidades, no solo precios.</strong> Pide marca o referencia de los materiales principales.
        </LI>
      </UL>

      <Consejo>
        Distingue entre una <strong>estimación orientativa</strong> (hecha sin ver la obra o con poca información) y un{' '}
        <strong>presupuesto confirmado</strong> tras una visita. Elegir una estimación no es firmar un contrato: antes de
        empezar, pide el presupuesto definitivo por escrito.
      </Consejo>

      <H2>Señales de alarma</H2>
      <UL>
        <LI>Presupuesto solo verbal o en un papel sin datos del profesional.</LI>
        <LI>Un precio muy por debajo del resto sin explicación.</LI>
        <LI>Pago de la mayor parte por adelantado.</LI>
        <LI>Prisa para que firmes «porque mañana sube el material».</LI>
        <LI>Rechazo a hacer factura.</LI>
      </UL>

      <H2>Cómo lo hace Protop</H2>
      <P>
        Cuando{' '}
        <Link to="/solicitar-presupuesto" className="font-semibold text-brand-700 underline">
          pides presupuestos en Protop
        </Link>
        , todos los profesionales responden con la misma estructura: alcance, importe orientativo, materiales, mano de
        obra, IVA, exclusiones, plazo, si necesitan visita y validez. Así los ves uno al lado del otro sin tener que montar
        tú la tabla. Además, puedes ver la reputación de cada uno, que solo se basa en trabajos valorados con factura.
      </P>
      <P>
        Si tu obra es grande, también te puede servir{' '}
        <Link to="/blog/como-organizar-una-reforma-integral" className="font-semibold text-brand-700 underline">
          la guía de la reforma integral paso a paso
        </Link>
        .
      </P>
      <Nota>Esta guía es orientativa y no sustituye al asesoramiento de un profesional para tu caso concreto.</Nota>
    </>
  )
}
