import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Tabla, UL } from '../ArticuloUI'

export function GoterasEnElTejado() {
  return (
    <>
      <P>
        En Cantabria el tejado trabaja de lo lindo: lluvia muchos días al año, viento del noroeste y, en la costa,
        salitre. Una gotera rara vez sale justo debajo de donde entra el agua, y cuanto más se espera, más se estropean
        las maderas, el aislamiento y los techos. Esto es lo que conviene saber.
      </P>

      <H2>Por dónde suele entrar el agua</H2>
      <UL>
        <LI>
          <strong>Tejas rotas o desplazadas</strong>, a menudo después de un temporal o de que alguien pisara el
          tejado.
        </LI>
        <LI>
          <strong>Encuentros</strong>: chimeneas, claraboyas, antenas y paredes. Es donde más falla el sellado.
        </LI>
        <LI>
          <strong>Canalones y bajantes atascados</strong> con hojas y musgo, que desbordan hacia dentro.
        </LI>
        <LI>
          <strong>Limahoyas</strong>: el canal donde se juntan dos aguas del tejado, que recoge mucha agua.
        </LI>
        <LI>
          <strong>Lámina impermeable vieja</strong> bajo las tejas, en tejados de más de 30 o 40 años.
        </LI>
      </UL>

      <H2>¿Reparar o rehacer el tejado?</H2>
      <Tabla
        filas={[
          ['Trabajo', 'Cuándo', 'Precio orientativo'],
          ['Reparación puntual (tejas, sellado de un encuentro)', 'Gotera localizada en un tejado sano', '250 – 900 €'],
          ['Limpieza y revisión de canalones', 'Cada uno o dos años', '150 – 400 €'],
          ['Retejado con lámina nueva', 'Goteras repetidas, tejas muy deterioradas', '60 – 110 € / m²'],
          ['Rehacer la cubierta con aislamiento', 'Estructura dañada o se quiere aislar', '120 – 220 € / m²'],
        ]}
        nota="Rangos orientativos con IVA. Los medios de seguridad y el andamio pueden suponer una parte importante del precio."
      />

      <Consejo>
        Cuando llueva, sube al desván o al bajo cubierta con una linterna y haz fotos de por dónde entra el agua. Al
        profesional le ahorra tiempo de búsqueda y a ti, horas de factura.
      </Consejo>

      <H2>Si vives en un piso</H2>
      <P>
        El tejado es un elemento común, así que la reparación la paga normalmente la comunidad. Avisa por escrito al
        administrador o al presidente, con fotos de los daños. Si el agua ha estropeado tu techo, los daños de tu
        vivienda suele cubrirlos el seguro de la comunidad: pregunta al administrador.
      </P>

      <H2>Mientras llega el profesional</H2>
      <UL>
        <LI>Pon un cubo y protege los muebles con plástico.</LI>
        <LI>Si el agua toca una lámpara o un enchufe, corta la luz de esa zona en el cuadro.</LI>
        <LI>No subas al tejado mojado: es muy resbaladizo y es la causa de muchos accidentes.</LI>
      </UL>

      <P>
        Busca{' '}
        <Link to="/impermeabilizaciones" className="font-semibold text-brand-700 underline">
          profesionales de impermeabilización y cubiertas
        </Link>{' '}
        de tu zona en Protop. Si la mancha está en la pared y no en el techo, quizá sea otra cosa: lee{' '}
        <Link to="/blog/humedades-en-casa-cantabria" className="font-semibold text-brand-700 underline">
          humedades en casa en Cantabria
        </Link>
        .
      </P>
      <Nota>Guía informativa con precios orientativos. El trabajo en tejados lo debe hacer personal con medios de seguridad.</Nota>
    </>
  )
}
