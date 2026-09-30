import { Link } from 'react-router-dom'
import { H2, LI, Nota, P, UL } from '../ArticuloUI'

export function CuandoLlamarAUnElectricista() {
  return (
    <>
      <P>
        La electricidad avisa poco y mal: casi nunca da un síntoma claro hasta que ya hay un problema serio. Por eso
        muchas averías eléctricas se posponen semanas —"ya lo miro cuando pueda"— hasta que dejan de ser una molestia
        y pasan a ser un riesgo real. Estas son las señales que no conviene dejar pasar.
      </P>

      <H2>Señales que no deberías posponer</H2>
      <UL>
        <LI>
          <strong>Los plomos saltan a menudo,</strong> sobre todo si coincide siempre con el mismo electrodoméstico:
          suele indicar una sobrecarga o un cortocircuito puntual, no un fallo aleatorio.
        </LI>
        <LI>
          <strong>Un enchufe o interruptor está caliente al tacto,</strong> hace un chasquido o tiene marcas de
          quemado. Es una de las señales más claras de riesgo de incendio eléctrico.
        </LI>
        <LI>
          <strong>Olor a quemado o plástico sin origen visible,</strong> especialmente cerca del cuadro eléctrico.
        </LI>
        <LI>
          <strong>Las luces parpadean o bajan de intensidad</strong> al encender otro aparato: puede ser un problema
          de sección de cable o de una instalación que se ha quedado corta para el consumo actual.
        </LI>
        <LI>
          <strong>Pequeñas descargas al tocar un electrodoméstico</strong> o un interruptor: casi siempre apunta a un
          fallo de toma de tierra, algo que no se debe posponer.
        </LI>
      </UL>

      <Nota>
        Ante cualquiera de estas señales con olor a quemado o calor evidente, corta la luz de esa zona en el cuadro
        eléctrico y no la reactives hasta que un electricista lo revise.
      </Nota>

      <H2>Qué revisa un electricista en una inspección</H2>
      <P>
        Una revisión completa no se limita a mirar el cuadro. Un buen diagnóstico suele incluir el estado del
        diferencial y los magnetotérmicos, la toma de tierra, el estado del cableado visible, la carga total
        contratada frente al consumo real de la vivienda, y los puntos concretos que has reportado como
        problemáticos.
      </P>

      <H2>Cuándo hace falta boletín eléctrico</H2>
      <P>
        El boletín eléctrico (CIE) es obligatorio para dar de alta o modificar de forma sustancial una instalación:
        reformas que afectan al cuadro, ampliaciones de potencia, o instalaciones nuevas. Un electricista con
        instalador autorizado es quien puede emitirlo y tramitarlo ante la compañía; si te ofrecen un trabajo de este
        tipo "sin papeles" para ahorrar, ten en cuenta que puede dar problemas al vender o alquilar la vivienda más
        adelante.
      </P>

      <H2>Cómo elegir bien sin pagar de más</H2>
      <P>
        Para una avería puntual, lo razonable es pedir un diagnóstico y comparar cómo lo resuelve cada profesional,
        no solo el precio final. En Protop puedes describir el problema una vez y recibir propuestas de varios{' '}
        <Link to="/profesionales?categoria=electricidad" className="font-medium text-brand-700 hover:underline">
          electricistas de tu zona
        </Link>
        , con su reputación basada en trabajos reales valorados con factura, para elegir con algo más que una
        sensación.
      </P>
    </>
  )
}
