import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Paso, Pasos, Tabla, UL } from '../ArticuloUI'

export function UrgenciasEnCasa() {
  return (
    <>
      <P>
        Una fuga a las once de la noche o un apagón un domingo ponen nervioso a cualquiera. Lo que hagas en los
        primeros minutos marca la diferencia entre un susto y una reparación cara, o un problema con el vecino de
        abajo. Esto es lo que conviene saber antes de que pase.
      </P>

      <H2>Antes de nada: localiza estas tres cosas</H2>
      <UL>
        <LI>
          <strong>La llave de paso general del agua</strong>: suele estar en la cocina, en el baño o junto al contador.
        </LI>
        <LI>
          <strong>El cuadro eléctrico</strong> y cuál es el interruptor diferencial (el que tiene un botón de prueba).
        </LI>
        <LI>
          <strong>La llave del gas</strong>, si tienes, y el teléfono de urgencias de tu distribuidora.
        </LI>
      </UL>

      <H2>Si hay una fuga de agua</H2>
      <Pasos>
        <Paso titulo="Cierra la llave de paso">
          Primero la del aparato (lavabo, cisterna, lavadora) y, si no sabes de dónde sale, la general.
        </Paso>
        <Paso titulo="Corta la luz si el agua llega a enchufes o aparatos">
          Baja el interruptor general sin pisar agua.
        </Paso>
        <Paso titulo="Avisa al vecino de abajo">Si el agua puede haber pasado, cuanto antes lo sepa, mejor.</Paso>
        <Paso titulo="Haz fotos y llama al seguro">
          Muchos seguros de hogar tienen servicio de urgencias y cubren la localización de la fuga.
        </Paso>
      </Pasos>

      <H2>Si se va la luz</H2>
      <UL>
        <LI>
          Mira si es solo tu casa o todo el edificio o la calle. Si es general, es cosa de la distribuidora.
        </LI>
        <LI>
          Si ha saltado el diferencial, desenchufa todo, súbelo y ve enchufando aparato por aparato: el que lo hace
          saltar es el culpable.
        </LI>
        <LI>
          Si salta solo, sin nada enchufado, o huele a quemado, no insistas y llama a un electricista. Lo contamos en{' '}
          <Link to="/blog/cuando-llamar-a-un-electricista" className="font-semibold text-brand-700 underline">
            señales de que necesitas un electricista
          </Link>
          .
        </LI>
      </UL>

      <H2>Si huele a gas</H2>
      <P>
        Cierra la llave del gas, abre ventanas, no enciendas ni apagues luces ni aparatos, no uses el ascensor y sal de
        casa. Llama desde fuera al teléfono de urgencias de tu distribuidora o al 112.
      </P>

      <H2>Si se atasca un desagüe</H2>
      <UL>
        <LI>Prueba primero con un desatascador de ventosa y agua caliente, nunca hirviendo en tuberías de PVC.</LI>
        <LI>Evita los productos muy agresivos: pueden dañar las tuberías viejas y no sirven si el atasco está lejos.</LI>
        <LI>Si se atascan varios desagües a la vez, el problema está en la bajante o en la red: llama a un profesional.</LI>
      </UL>

      <H2>Cuánto cuesta una urgencia</H2>
      <Tabla
        filas={[
          ['Servicio', 'Precio orientativo'],
          ['Salida de urgencia en horario laboral', '40 – 80 €'],
          ['Salida nocturna, fin de semana o festivo', '80 – 150 €'],
          ['Hora de trabajo adicional', '35 – 60 €'],
        ]}
        nota="Rangos orientativos. Pregunta siempre por teléfono cuánto cuesta la salida antes de que vengan."
      />

      <Consejo>
        Desconfía de los anuncios de urgencias sin nombre de empresa ni dirección, y de quien no quiere decirte el
        precio por teléfono. Pide factura con el desglose: la necesitarás para el seguro.
      </Consejo>

      <P>
        En Protop puedes ver{' '}
        <Link to="/urgencias-24-horas" className="font-semibold text-brand-700 underline">
          profesionales de urgencias 24 h
        </Link>{' '}
        de tu zona, con valoraciones de clientes que han enseñado su factura. Guárdate uno antes de necesitarlo.
      </P>
      <Nota>
        Guía informativa. Ante cualquier riesgo para las personas, llama al 112.
      </Nota>
    </>
  )
}
