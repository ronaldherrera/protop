import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Tabla, UL } from '../ArticuloUI'

export function PlacasSolaresCantabria() {
  return (
    <>
      <P>
        «En Cantabria no hay sol suficiente» es probablemente lo que más se oye cuando alguien pregunta por placas
        solares. Es verdad que aquí hay menos horas de sol que en el sur, pero la cuenta se hace con lo que produce un
        panel a lo largo del año, y aquí producen lo bastante para que en muchas casas compense. Depende de tu tejado,
        de tu consumo y de a qué horas gastas la luz.
      </P>

      <H2>Cuánto produce una instalación aquí</H2>
      <P>
        Como referencia, en la costa de Cantabria cada kilovatio pico (kWp) instalado produce alrededor de{' '}
        <strong>1.000 – 1.200 kWh al año</strong> con buena orientación, frente a unos 1.500 – 1.700 en Andalucía. Una
        vivienda típica, con 3 – 4 kWp, puede generar entre 3.000 y 4.500 kWh al año: lo que consume una casa media.
      </P>
      <Tabla
        filas={[
          ['Factor', 'Lo ideal', 'Qué pasa si no'],
          ['Orientación', 'Sur, sureste o suroeste', 'Este u oeste producen un 15 – 20 % menos'],
          ['Inclinación', '30 – 35°', 'Con menos inclinación, menos producción en invierno'],
          ['Sombras', 'Ninguna entre las 10 y las 16 h', 'Una sombra parcial puede tirar un tramo entero'],
          ['Consumo de día', 'Alto (teletrabajo, aerotermia, lavadora)', 'Más excedentes, que se pagan baratos'],
        ]}
        nota="Cifras orientativas. Un instalador debe calcular la producción de tu tejado concreto."
      />

      <H2>Cuánto cuesta</H2>
      <Tabla
        filas={[
          ['Instalación', 'Precio orientativo'],
          ['Vivienda, 3 kWp, sin batería', '4.000 – 6.000 €'],
          ['Vivienda, 4 – 5 kWp, sin batería', '5.500 – 8.000 €'],
          ['Añadir batería de unos 5 kWh', '3.000 – 5.000 € más'],
        ]}
        nota="Precios orientativos con IVA e instalación, sin descontar ayudas ni bonificaciones."
      />

      <H2>Cuándo compensa y cuándo no</H2>
      <UL>
        <LI>
          <strong>Compensa</strong> si tienes tejado propio sin sombras, consumes bastante de día o vas a instalar
          aerotermia o un coche eléctrico.
        </LI>
        <LI>
          <strong>Compensa menos</strong> si apenas estás en casa de día y tu consumo es bajo: casi todo irá a
          excedentes.
        </LI>
        <LI>
          <strong>En un piso</strong> es posible en el tejado comunitario (autoconsumo compartido), pero necesita
          acuerdo de la comunidad.
        </LI>
      </UL>

      <Consejo>
        La batería rara vez sale rentable por sí sola. Antes de pagarla, mira si tu comercializadora ofrece
        compensación de excedentes o una «batería virtual», y piensa en mover consumo a las horas de sol: lavadora,
        lavavajillas y termo.
      </Consejo>

      <H2>Trámites y ayudas</H2>
      <P>
        Las instalaciones de autoconsumo pequeñas se legalizan con un trámite sencillo que normalmente gestiona el
        instalador: el boletín eléctrico, la comunicación a la distribuidora y el alta de la compensación de
        excedentes. Algunos ayuntamientos bonifican el IBI o el impuesto de obras (ICIO) durante unos años, y de vez en
        cuando hay ayudas públicas o deducciones fiscales. Cambian a menudo, así que pregunta en tu ayuntamiento y al
        instalador qué está vigente.
      </P>

      <H2>Cómo elegir instalador</H2>
      <UL>
        <LI>Que haga un estudio con la producción estimada de tu tejado y tu consumo real (pídele tus facturas).</LI>
        <LI>Que indique la marca de paneles e inversor, y la garantía de cada cosa por separado.</LI>
        <LI>Que se encargue de la legalización y te entregue el certificado de la instalación.</LI>
      </UL>
      <P>
        Puedes buscar{' '}
        <Link to="/placas-solares" className="font-semibold text-brand-700 underline">
          instaladores de energía solar
        </Link>{' '}
        de tu zona en Protop. Si además estás pensando en la calefacción, lee{' '}
        <Link to="/blog/aire-acondicionado-o-bomba-de-calor" className="font-semibold text-brand-700 underline">
          aire acondicionado o bomba de calor
        </Link>
        .
      </P>
      <Nota>Guía informativa. Producción, precios y ayudas son orientativos y cambian con el tiempo.</Nota>
    </>
  )
}
