import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Tabla, UL } from '../ArticuloUI'

export function QueSueloPoner() {
  return (
    <>
      <P>
        Cambiar el suelo transforma una casa casi tanto como pintarla, y hoy hay opciones para cada presupuesto. La
        duda casi siempre está entre tres: <strong>tarima de madera</strong>, <strong>suelo laminado</strong> y{' '}
        <strong>suelo vinílico</strong>. Se parecen en las fotos, pero no se comportan igual, sobre todo con la
        humedad, algo que en Cantabria conviene tener muy presente.
      </P>

      <H2>Las tres opciones, comparadas</H2>
      <Tabla
        filas={[
          ['', 'Laminado', 'Vinílico (SPC/LVT)', 'Tarima de madera'],
          ['Qué es', 'Tablero con una foto de madera y capa protectora', 'Lámina o tabla de PVC con núcleo rígido', 'Madera natural, maciza o multicapa'],
          ['Agua', 'Mal: se hincha si se moja', 'Muy bien: resiste el agua', 'Regular: no le gusta la humedad'],
          ['Tacto y ruido', 'Más frío y sonoro', 'Cálido y silencioso', 'El más agradable'],
          ['Se puede lijar', 'No', 'No', 'Sí (la maciza, varias veces)'],
          ['Precio instalado', '20 – 40 € / m²', '25 – 55 € / m²', '50 – 120 € / m²'],
        ]}
        nota="Precios orientativos con IVA, con el rodapié e instalación sobre el suelo existente nivelado."
      />

      <H2>Qué poner en cada estancia</H2>
      <UL>
        <LI>
          <strong>Baño y cocina</strong>: vinílico o cerámica. El laminado acaba sufriendo con las salpicaduras.
        </LI>
        <LI>
          <strong>Salón y dormitorios</strong>: cualquiera de los tres. La tarima, si buscas calidez y durabilidad.
        </LI>
        <LI>
          <strong>Bajos y casas con humedad del terreno</strong>: vinílico, y antes una lámina antihumedad.
        </LI>
        <LI>
          <strong>Con suelo radiante</strong>: vinílico o tarima multicapa compatibles; pregunta por la resistencia
          térmica.
        </LI>
      </UL>

      <H2>¿Encima del suelo viejo o levantándolo?</H2>
      <P>
        Laminado y vinílico se pueden colocar sobre la baldosa existente si está bien pegada y nivelada: ahorra
        escombro y días de obra. Lo que hay que vigilar es la altura, porque puede que haya que recortar las puertas.
        Si el suelo viejo está hueco, roto o muy desnivelado, conviene levantarlo o pasar una capa de autonivelante.
      </P>

      <Consejo>
        Compra un 8 – 10 % más de material del que mide la habitación para cortes y reposiciones futuras. Dentro de unos
        años será difícil encontrar el mismo modelo.
      </Consejo>

      <H2>Qué pedir en el presupuesto</H2>
      <UL>
        <LI>Marca, modelo, grosor y clase de uso (AC4 o superior en laminado para una vivienda).</LI>
        <LI>Si incluye la retirada del suelo viejo, el autonivelante, la base aislante y el rodapié.</LI>
        <LI>Si incluye recortar puertas y poner perfiles de transición entre estancias.</LI>
      </UL>
      <P>
        Puedes buscar{' '}
        <Link to="/instaladores-de-suelos" className="font-semibold text-brand-700 underline">
          profesionales de suelos y tarimas
        </Link>{' '}
        en tu zona. Si vas a cambiar también las puertas, lee{' '}
        <Link to="/blog/cambiar-puertas-de-interior" className="font-semibold text-brand-700 underline">
          cómo cambiar las puertas de interior
        </Link>
        .
      </P>
      <Nota>Precios orientativos. Pide siempre presupuesto con visita a la vivienda.</Nota>
    </>
  )
}
