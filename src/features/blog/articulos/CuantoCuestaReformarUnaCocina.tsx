import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Paso, Pasos, Tabla, UL } from '../ArticuloUI'

export function CuantoCuestaReformarUnaCocina() {
  return (
    <>
      <P>
        La cocina es la estancia en la que más oficios se juntan: albañil, fontanero, electricista, carpintero o
        montador de muebles y, a veces, pintor. Por eso su precio varía tanto y por eso conviene entender bien qué estás
        pagando. Te explicamos de qué partidas se compone una reforma de cocina, qué rangos se suelen ver y en qué orden
        se hace para no perder tiempo ni dinero.
      </P>

      <H2>Las partidas de una reforma de cocina</H2>
      <UL>
        <LI>
          <strong>Muebles y encimera:</strong> suelen ser la partida más grande. El precio cambia mucho entre muebles
          estándar y a medida, y entre encimeras laminadas, de cuarzo o de porcelánico.
        </LI>
        <LI>
          <strong>Electrodomésticos:</strong> a menudo se compran aparte. Si son integrables, los muebles se adaptan a
          sus medidas.
        </LI>
        <LI>
          <strong>Instalaciones:</strong> tomas de agua y desagüe, circuitos eléctricos para horno y placa, enchufes
          sobre la encimera y la salida de humos de la campana.
        </LI>
        <LI>
          <strong>Albañilería:</strong> demolición, suelo, frontal entre muebles y, si se mueve algún tabique, su
          reconstrucción.
        </LI>
        <LI>
          <strong>Remates:</strong> iluminación, pintura y montaje final.
        </LI>
      </UL>

      <H2>Rangos orientativos</H2>
      <Tabla
        filas={[
          ['Tipo de reforma', 'Qué suele incluir', 'Rango orientativo'],
          ['Renovación parcial', 'Cambio de frentes, encimera y grifería, sin tocar instalaciones', 'Desde unos 2.500 €'],
          ['Reforma completa de gama media', 'Demolición, instalaciones nuevas, muebles estándar y encimera', 'Entre 7.000 y 15.000 €'],
          ['Reforma completa de gama alta', 'Muebles a medida, encimera de piedra o porcelánico, isla', 'A partir de 15.000 €'],
        ]}
        nota="Rangos habituales en España para cocinas de 8 a 12 m², sin electrodomésticos y con IVA aparte. Pueden cambiar mucho según la vivienda."
      />

      <H2>El orden de los trabajos</H2>
      <Pasos>
        <Paso titulo="Diseño y medición">
          Primero se decide la distribución y se mide todo. Cambiar la posición del fregadero o de la placa obliga a
          mover instalaciones, y eso hay que saberlo antes.
        </Paso>
        <Paso titulo="Demolición">Se retiran muebles, alicatados y, si hace falta, el suelo.</Paso>
        <Paso titulo="Instalaciones">Fontanería, electricidad y salida de humos, antes de cerrar paredes.</Paso>
        <Paso titulo="Albañilería y suelo">Revestimientos, suelo y, si se hace, el frontal.</Paso>
        <Paso titulo="Muebles, encimera y electrodomésticos">
          La encimera de piedra se mide sobre los muebles ya montados, así que puede tardar unos días más.
        </Paso>
        <Paso titulo="Remates">Iluminación, pintura y limpieza final.</Paso>
      </Pasos>

      <Consejo>
        Pon enchufes de sobra sobre la encimera y prevé un circuito independiente para el horno y otro para la placa.
        Es barato hacerlo en obra y muy molesto echarlo de menos después.
      </Consejo>

      <H2>Cómo comparar presupuestos de cocina</H2>
      <P>
        Pide que cada presupuesto separe muebles, encimera, instalaciones y obra. Comprueba si incluye el montaje y la
        retirada de la cocina vieja, y qué marca y modelo de herrajes y bisagras usan: es donde más se nota la calidad con
        los años. Te ayudará{' '}
        <Link to="/blog/como-comparar-presupuestos-de-reforma" className="font-semibold text-brand-700 underline">
          la lista para comparar presupuestos de reforma
        </Link>
        .
      </P>
      <P>
        En Protop puedes buscar profesionales de{' '}
        <Link to="/carpinteros" className="font-semibold text-brand-700 underline">
          carpintería de madera
        </Link>{' '}
        y de{' '}
        <Link to="/albaniles" className="font-semibold text-brand-700 underline">
          albañilería
        </Link>
        , o{' '}
        <Link to="/solicitar-presupuesto" className="font-semibold text-brand-700 underline">
          pedir presupuestos a varios a la vez
        </Link>
        .
      </P>
      <Nota>Las cifras son orientativas y no son una tarifa: el precio real depende de tu cocina y de lo que elijas.</Nota>
    </>
  )
}
