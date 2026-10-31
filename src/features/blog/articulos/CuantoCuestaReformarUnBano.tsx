import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Paso, Pasos, Tabla, UL } from '../ArticuloUI'

export function CuantoCuestaReformarUnBano() {
  return (
    <>
      <P>
        Reformar el baño es una de las obras más pedidas en cualquier casa, y también una de las que más varían de
        precio. Un baño de 4 m² en un piso de Santander puede costar el doble que otro aparentemente igual según se
        cambien o no las tuberías, el tipo de plato de ducha o si hay que demoler el suelo. Aquí te explicamos{' '}
        <strong>qué partidas componen el presupuesto</strong>, qué rangos se suelen ver y cómo comparar ofertas que
        realmente se puedan comparar.
      </P>

      <H2>Qué incluye una reforma de baño completa</H2>
      <UL>
        <LI>
          <strong>Demolición y retirada de escombros:</strong> quitar alicatado, solado, sanitarios y bañera, y llevarlo
          todo a un punto autorizado.
        </LI>
        <LI>
          <strong>Fontanería:</strong> cambiar las tuberías de agua y los desagües. En viviendas de más de 30 años es muy
          recomendable, porque después no se puede volver a picar sin romper el alicatado nuevo.
        </LI>
        <LI>
          <strong>Electricidad:</strong> puntos de luz, enchufes protegidos y, si hace falta, un circuito nuevo.
        </LI>
        <LI>
          <strong>Albañilería:</strong> recrecidos, nivelación, impermeabilización de la zona de ducha y alicatado de
          paredes y suelo.
        </LI>
        <LI>
          <strong>Sanitarios, grifería y mueble:</strong> a menudo los pone el cliente o se presupuestan aparte.
        </LI>
        <LI>
          <strong>Remates:</strong> mamparas, espejo, accesorios, falso techo y pintura.
        </LI>
      </UL>

      <H2>Rangos orientativos según el tipo de reforma</H2>
      <Tabla
        filas={[
          ['Tipo de reforma', 'Qué suele incluir', 'Rango orientativo'],
          ['Lavado de cara', 'Cambio de sanitarios, grifería y mueble, sin tocar alicatado', 'Desde unos 1.500 €'],
          ['Cambio de bañera por plato de ducha', 'Plato, mampara y rehacer la zona de la bañera', 'Entre 1.000 y 3.000 €'],
          ['Reforma completa de gama media', 'Demolición, fontanería, alicatado, sanitarios y mampara', 'Entre 5.000 y 10.000 €'],
          ['Reforma completa de gama alta', 'Materiales premium, plato de obra, suelo radiante, mobiliario a medida', 'A partir de 10.000 €'],
        ]}
        nota="Son rangos que se ven habitualmente en presupuestos en España para baños de 3 a 6 m², IVA aparte. En tu caso pueden cambiar mucho."
      />

      <H2>Lo que más mueve el precio</H2>
      <UL>
        <LI>
          <strong>Los metros cuadrados de alicatado</strong>, más que los del suelo: un baño alto o con muchas esquinas
          gasta más azulejo y más horas.
        </LI>
        <LI>
          <strong>El material elegido:</strong> la diferencia entre un azulejo básico y un porcelánico de gran formato
          se nota en el material y en la mano de obra, que es más lenta.
        </LI>
        <LI>
          <strong>Si se cambian las instalaciones</strong> o se aprovechan las existentes.
        </LI>
        <LI>
          <strong>El acceso:</strong> un cuarto piso sin ascensor en el centro de Santander encarece la retirada de
          escombros y la subida de material.
        </LI>
        <LI>
          <strong>Los plazos:</strong> una obra urgente o con un único oficial alarga los días o sube el precio.
        </LI>
      </UL>

      <H2>Cómo organizar la reforma paso a paso</H2>
      <Pasos>
        <Paso titulo="Decide qué quieres cambiar y qué no">
          ¿Mantienes la distribución? ¿Cambias la bañera por ducha? Cuanto más claro lo tengas, más parecidos serán los
          presupuestos que recibas.
        </Paso>
        <Paso titulo="Pide al menos tres presupuestos con el mismo alcance">
          Mismas partidas, mismas calidades y el mismo tratamiento del IVA. Si uno incluye las tuberías y otro no, no se
          pueden comparar.
        </Paso>
        <Paso titulo="Revisa plazos, pagos y garantías">
          Pide un calendario aproximado y que los pagos vayan ligados al avance de la obra, nunca todo por adelantado.
        </Paso>
        <Paso titulo="Consulta si necesitas permiso">
          Una reforma interior de baño suele tramitarse como obra menor o comunicación previa, pero cada ayuntamiento
          tiene sus reglas: pregúntalo en el tuyo antes de empezar y avisa a la comunidad si vas a usar zonas comunes.
        </Paso>
      </Pasos>

      <Consejo>
        Aprovecha la reforma para pedir que impermeabilicen bien la zona de ducha y que dejen una toma de registro para
        las tuberías. Son pocos euros más ahora y te pueden ahorrar una avería con el vecino de abajo dentro de unos años.
      </Consejo>

      <H2>Encuentra a quién hacerlo</H2>
      <P>
        En Protop puedes{' '}
        <Link to="/albaniles" className="font-semibold text-brand-700 underline">
          buscar profesionales de albañilería y reformas
        </Link>{' '}
        de tu zona y ver sus valoraciones con factura, o{' '}
        <Link to="/solicitar-presupuesto" className="font-semibold text-brand-700 underline">
          pedir presupuestos a varios a la vez
        </Link>
        : todos te llegan con la misma estructura (alcance, materiales, exclusiones, plazo e importe), así que compararlos
        es mucho más sencillo.
      </P>
      <Nota>
        Las cifras de esta guía son orientativas y no son una tarifa. El precio real de tu baño solo lo puede dar un
        profesional que lo haya visto.
      </Nota>
    </>
  )
}
