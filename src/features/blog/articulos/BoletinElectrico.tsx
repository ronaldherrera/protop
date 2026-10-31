import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Paso, Pasos, UL } from '../ArticuloUI'

export function BoletinElectrico() {
  return (
    <>
      <P>
        Si vas a dar de alta la luz en un piso, cambiar de titular, subir la potencia o has hecho una reforma, es muy
        probable que alguien te pida «el boletín». Es un documento sencillo, pero cuando no lo tienes puede frenar una
        mudanza o una venta durante días. Te explicamos qué es, cuándo lo necesitas de verdad y cómo conseguirlo.
      </P>

      <H2>Qué es el boletín eléctrico</H2>
      <P>
        Su nombre oficial es <strong>Certificado de Instalación Eléctrica (CIE)</strong>. Lo emite un instalador
        electricista autorizado después de revisar la instalación de una vivienda o un local, y certifica que cumple el
        Reglamento Electrotécnico para Baja Tensión. Indica, entre otras cosas, la potencia máxima que admite la
        instalación. Después se registra ante el organismo de industria de la comunidad autónoma.
      </P>

      <H2>Cuándo te lo van a pedir</H2>
      <UL>
        <LI>
          <strong>Al dar de alta la luz por primera vez</strong> o en una vivienda que lleva tiempo sin suministro.
        </LI>
        <LI>
          <strong>Al subir la potencia contratada</strong> por encima de la que figura en tu boletín: el boletín marca el
          límite.
        </LI>
        <LI>
          <strong>Después de una reforma de la instalación</strong> (cuadro nuevo, circuitos nuevos, cambio de
          monofásica a trifásica…).
        </LI>
        <LI>
          <strong>Con una instalación antigua y un cambio de contrato.</strong> El boletín no caduca, pero si tiene más
          de 20 años la distribuidora puede pedir que se revise cuando cambias el titular u otra condición del contrato.
          La práctica varía entre distribuidoras, así que conviene preguntarlo.
        </LI>
      </UL>

      <Consejo>
        Si vas a comprar o alquilar una vivienda, pide una copia del boletín antes de firmar. Si no existe o es muy
        antiguo, puedes negociar quién paga la revisión.
      </Consejo>

      <H2>Cómo conseguirlo, paso a paso</H2>
      <Pasos>
        <Paso titulo="Busca si ya existe">
          Pregunta al propietario anterior o a la distribuidora: a veces el boletín está registrado y solo hace falta una
          copia.
        </Paso>
        <Paso titulo="Llama a un electricista autorizado">
          Solo un instalador habilitado puede emitirlo. Revisará el cuadro, las protecciones, la toma de tierra y el
          estado general.
        </Paso>
        <Paso titulo="Corrige lo que no cumpla">
          En instalaciones antiguas es habitual tener que cambiar el cuadro, añadir un diferencial o mejorar la toma de
          tierra antes de poder certificar.
        </Paso>
        <Paso titulo="Registro y entrega">
          El instalador registra el certificado y te entrega tu copia para la comercializadora o la distribuidora.
        </Paso>
      </Pasos>

      <H2>Cuánto cuesta</H2>
      <P>
        La revisión y emisión del boletín de una vivienda que ya cumple suele moverse entre <strong>70 y 300 €</strong>{' '}
        según la empresa, el tamaño de la vivienda y si incluye las tasas de registro. Si hay que adecuar la instalación
        (cuadro nuevo, cableado…), ese trabajo va aparte y puede ser lo que más pese en el presupuesto.
      </P>

      <H2>Señales de que tu instalación necesita una revisión</H2>
      <UL>
        <LI>Los plomos o el diferencial saltan con frecuencia.</LI>
        <LI>Enchufes o interruptores que se calientan, chispean o huelen a quemado.</LI>
        <LI>Cuadro con fusibles de porcelana o sin interruptor diferencial.</LI>
        <LI>Enchufes sin toma de tierra (los de dos agujeros sin las patillas laterales).</LI>
      </UL>
      <P>
        Si te suena alguna, échale un vistazo a{' '}
        <Link to="/blog/cuando-llamar-a-un-electricista" className="font-semibold text-brand-700 underline">
          las señales de que necesitas un electricista ya
        </Link>{' '}
        o{' '}
        <Link to="/electricistas" className="font-semibold text-brand-700 underline">
          busca electricistas de tu zona
        </Link>
        .
      </P>
      <Nota>
        Esta guía resume la práctica habitual. Los requisitos exactos los fija la normativa vigente y tu distribuidora:
        ante la duda, consúltalo con un instalador autorizado.
      </Nota>
    </>
  )
}
