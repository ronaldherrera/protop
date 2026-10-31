import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Tabla, UL } from '../ArticuloUI'

export function CuantoCuestaUnElectricista() {
  return (
    <>
      <P>
        Cuando llamas a un electricista, el precio depende de tres cosas: la salida (o desplazamiento), las horas de
        trabajo y el material. Saber cuánto cuestan los trabajos más habituales te ayuda a pedir el presupuesto bien y
        a reconocer uno que se pasa.
      </P>

      <H2>Cómo se cobra</H2>
      <UL>
        <LI>
          <strong>Desplazamiento</strong>: muchos lo cobran aparte, y a veces incluye la primera media hora o la
          primera hora.
        </LI>
        <LI>
          <strong>Hora de trabajo</strong>: se suele cobrar por horas o fracciones de media hora.
        </LI>
        <LI>
          <strong>Material</strong>: mecanismos, cable y protecciones, a precio de tienda o con un pequeño margen.
        </LI>
        <LI>
          <strong>Urgencias</strong>: noches, fines de semana y festivos tienen recargo.
        </LI>
      </UL>

      <H2>Precios orientativos por trabajo</H2>
      <Tabla
        filas={[
          ['Trabajo', 'Precio orientativo'],
          ['Desplazamiento', '20 – 45 €'],
          ['Hora de trabajo', '30 – 50 €'],
          ['Cambiar un enchufe o interruptor', '25 – 60 €'],
          ['Instalar una lámpara de techo', '30 – 70 €'],
          ['Añadir un punto de luz o enchufe nuevo', '60 – 150 €'],
          ['Buscar y reparar una avería que hace saltar el diferencial', '60 – 200 €'],
          ['Cambiar el cuadro eléctrico de una vivienda', '400 – 900 €'],
          ['Boletín eléctrico (CIE) de una vivienda en regla', '100 – 250 €'],
          ['Renovar la instalación de un piso de 80 m²', '3.000 – 6.500 €'],
        ]}
        nota="Rangos orientativos con IVA para Cantabria. Las urgencias y los trabajos fuera de horario cuestan más."
      />

      <Consejo>
        Junta los trabajos pequeños. Si hay que cambiar un enchufe, aprovecha para que mire esa lámpara que parpadea:
        pagarás un solo desplazamiento.
      </Consejo>

      <H2>Cuándo hay que renovar toda la instalación</H2>
      <P>
        Si tu casa tiene más de 30 o 40 años, enchufes sin toma de tierra, cables de tela o un cuadro con fusibles de
        porcelana, conviene renovarla. No es solo una cuestión de seguridad: muchas compañías piden el boletín para
        subir la potencia o cambiar de titular. Lo explicamos en{' '}
        <Link to="/blog/boletin-electrico-cie" className="font-semibold text-brand-700 underline">
          boletín eléctrico (CIE): qué es y cómo conseguirlo
        </Link>
        .
      </P>

      <H2>Cómo pedir el presupuesto</H2>
      <UL>
        <LI>Describe el trabajo con detalle y, si puedes, manda fotos del cuadro y de la zona.</LI>
        <LI>Pregunta si el desplazamiento se descuenta si haces el trabajo con él.</LI>
        <LI>Pide que te diga si es instalador autorizado: lo necesitas para cualquier boletín.</LI>
        <LI>Pide factura con el desglose: hace falta para la garantía y para el seguro.</LI>
      </UL>
      <P>
        Busca{' '}
        <Link to="/electricistas" className="font-semibold text-brand-700 underline">
          electricistas
        </Link>{' '}
        de tu zona en Protop. Si no sabes si es urgente, lee{' '}
        <Link to="/blog/cuando-llamar-a-un-electricista" className="font-semibold text-brand-700 underline">
          señales de que necesitas un electricista ya
        </Link>
        .
      </P>
      <Nota>Precios orientativos para ayudarte a comparar. Cada trabajo necesita su presupuesto.</Nota>
    </>
  )
}
