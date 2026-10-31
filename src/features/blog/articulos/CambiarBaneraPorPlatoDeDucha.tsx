import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Paso, Pasos, Tabla, UL } from '../ArticuloUI'

export function CambiarBaneraPorPlatoDeDucha() {
  return (
    <>
      <P>
        Cambiar la bañera por un plato de ducha es de las reformas que más se agradecen: el baño gana espacio, es más
        seguro para personas mayores y se limpia mejor. Además, si el resto del baño está en buen estado, se puede hacer
        sin una reforma completa y en muy pocos días. Te contamos cómo se hace, cuánto suele durar y qué tienes que
        decidir antes de pedir presupuesto.
      </P>

      <H2>Cómo se hace, paso a paso</H2>
      <Pasos>
        <Paso titulo="Retirar la bañera">
          Se desmonta la bañera y se pica el frontal de obra y los azulejos que la rodean, normalmente hasta unos 20 o 30
          centímetros por encima del borde.
        </Paso>
        <Paso titulo="Adaptar el desagüe">
          El desagüe de una ducha necesita la pendiente adecuada. Si el bajante está lejos o muy alto, puede hacer falta
          elevar un poco el plato o modificar la tubería.
        </Paso>
        <Paso titulo="Impermeabilizar y colocar el plato">
          Se impermeabiliza la zona, se nivela la base y se coloca el plato, sellando bien las juntas con la pared.
        </Paso>
        <Paso titulo="Rematar la pared">
          Se repone el alicatado que se ha quitado. Si no encuentras el mismo azulejo, una alternativa limpia es un
          panel o un revestimiento que cubra toda la zona de ducha.
        </Paso>
        <Paso titulo="Instalar la mampara y la grifería">
          Por último, la mampara, la columna o el grifo termostático y los accesorios.
        </Paso>
      </Pasos>
      <P>
        Si no hay sorpresas con el desagüe, el trabajo suele llevar entre <strong>1 y 3 días</strong>, más el tiempo de
        secado de las siliconas antes de usar la ducha.
      </P>

      <H2>Decisiones que cambian el precio</H2>
      <Tabla
        filas={[
          ['Decisión', 'Opción económica', 'Opción de más gama'],
          ['Plato', 'Acrílico o de resina estándar', 'Resina extraplana a medida o plato de obra'],
          ['Pared', 'Reponer azulejo en la zona picada', 'Revestir toda la zona con panel o porcelánico nuevo'],
          ['Mampara', 'Frontal corredera estándar', 'Fija a medida, cristal templado sin perfiles'],
          ['Grifería', 'Monomando', 'Columna termostática'],
        ]}
      />
      <P>
        Como referencia, el cambio completo suele moverse <strong>entre 1.000 y 3.000 €</strong> según estas decisiones
        y el estado del desagüe. Si además quieres cambiar todo el alicatado o los sanitarios, ya es una reforma completa:
        mira{' '}
        <Link to="/blog/cuanto-cuesta-reformar-un-bano" className="font-semibold text-brand-700 underline">
          cuánto cuesta reformar un baño
        </Link>
        .
      </P>

      <Consejo>
        Mide antes el hueco de la bañera: los platos estándar más habituales son de 70, 80 y 90 cm de ancho y de 120 a
        180 cm de largo. Si el tuyo no coincide, un plato de resina cortado a medida evita rellenos y juntas raras.
      </Consejo>

      <H2>Accesibilidad: piensa también en el futuro</H2>
      <UL>
        <LI>Un plato extraplano o enrasado con el suelo evita el escalón.</LI>
        <LI>Antideslizante de clase alta en el plato, sobre todo si hay personas mayores en casa.</LI>
        <LI>Un asidero y un asiento abatible se instalan en minutos y se pueden prever desde el principio.</LI>
      </UL>

      <H2>Quién lo hace</H2>
      <P>
        Normalmente lo coordina un profesional de{' '}
        <Link to="/fontaneros" className="font-semibold text-brand-700 underline">
          fontanería
        </Link>{' '}
        o de{' '}
        <Link to="/albaniles" className="font-semibold text-brand-700 underline">
          albañilería
        </Link>{' '}
        que se encarga de todo. También puedes{' '}
        <Link to="/solicitar-presupuesto" className="font-semibold text-brand-700 underline">
          pedir presupuestos a varios a la vez
        </Link>{' '}
        describiendo el baño con un par de fotos.
      </P>
      <Nota>Los precios y plazos son orientativos: dependen del estado de tu instalación y de los materiales que elijas.</Nota>
    </>
  )
}
