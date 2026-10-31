import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Paso, Pasos, Tabla, UL } from '../ArticuloUI'

export function CuantoCuestaCambiarVentanas() {
  return (
    <>
      <P>
        En Cantabria las ventanas viejas se notan dos veces: en la factura de la calefacción y en la condensación de
        las mañanas de invierno. Cambiarlas es de las mejoras que más se agradecen, pero el precio varía mucho según
        el material, el vidrio y, sobre todo, cómo se instalan. Esto es lo que conviene saber antes de pedir
        presupuesto.
      </P>

      <H2>Aluminio o PVC: lo que de verdad cambia</H2>
      <P>
        Los dos materiales aíslan bien si se elige la gama adecuada. Lo importante es que el aluminio lleve{' '}
        <strong>rotura de puente térmico (RPT)</strong>: sin ella, el marco transmite el frío y aparece condensación
        en el propio perfil.
      </P>
      <Tabla
        filas={[
          ['', 'PVC', 'Aluminio con RPT'],
          ['Aislamiento', 'Muy bueno de serie', 'Bueno; depende de la gama'],
          ['Perfil', 'Algo más grueso', 'Más fino, más superficie de cristal'],
          ['Mantenimiento', 'Mínimo; no se oxida con el salitre', 'Mínimo; mejor con lacado de calidad cerca del mar'],
          ['Colores', 'Blanco y foliados imitación madera', 'Casi cualquier color lacado'],
        ]}
      />

      <H2>Precios orientativos</H2>
      <Tabla
        filas={[
          ['Trabajo', 'Precio orientativo'],
          ['Ventana practicable de 120 × 120 cm, PVC, instalada', '350 – 700 €'],
          ['La misma en aluminio con RPT, instalada', '350 – 750 €'],
          ['Balconera de dos hojas', '700 – 1.400 €'],
          ['Piso completo (6 – 8 ventanas)', '3.000 – 7.500 €'],
          ['Cambiar solo el vidrio a doble acristalamiento', '60 – 150 € por m²'],
        ]}
        nota="Rangos orientativos con IVA para viviendas en Cantabria. Cambian con la marca, el vidrio, las persianas y si hay que hacer obra en el hueco."
      />

      <H2>El vidrio importa tanto como el marco</H2>
      <UL>
        <LI>
          <strong>Doble acristalamiento con cámara</strong> (por ejemplo, 4/16/4) es lo mínimo hoy.
        </LI>
        <LI>
          Un <strong>vidrio bajo emisivo</strong> mejora mucho el aislamiento por poco dinero más.
        </LI>
        <LI>
          Si vives en una calle con tráfico, pregunta por un <strong>vidrio acústico</strong> (laminado).
        </LI>
        <LI>En orientaciones al sur, un vidrio con control solar evita que la casa se recaliente en verano.</LI>
      </UL>

      <H2>Cómo es el cambio, paso a paso</H2>
      <Pasos>
        <Paso titulo="Medición en casa">
          El instalador mide cada hueco. Desconfía de presupuestos cerrados hechos solo con medidas que das tú.
        </Paso>
        <Paso titulo="Fabricación">Entre dos y seis semanas, según el fabricante y la época del año.</Paso>
        <Paso titulo="Instalación">
          Una ventana se cambia en unas horas. Pregunta si se quita el marco viejo o se monta encima: quitarlo deja un
          remate mejor y no resta luz.
        </Paso>
        <Paso titulo="Sellado y remates">
          Un buen sellado con espuma y cinta impermeable evita las filtraciones. Es la parte que más se nota cuando
          falla.
        </Paso>
      </Pasos>

      <Consejo>
        Pide que el presupuesto indique la marca y serie del perfil, la composición exacta del vidrio, si incluye la
        persiana y el cajón, y la retirada de las ventanas viejas. Así podrás{' '}
        <Link to="/blog/como-comparar-presupuestos-de-reforma" className="font-semibold text-brand-700 underline">
          comparar presupuestos de verdad
        </Link>
        .
      </Consejo>

      <H2>¿Hace falta permiso?</H2>
      <P>
        Cambiar ventanas sin modificar el hueco suele ser obra menor, pero si vives en un edificio, la comunidad puede
        exigir un color o un modelo para mantener la fachada uniforme. Pregunta al administrador antes de encargarlas.
        También conviene mirar si hay ayudas a la rehabilitación energética abiertas en ese momento.
      </P>

      <H2>Encuentra quién te las cambie</H2>
      <P>
        En Protop puedes ver{' '}
        <Link to="/carpinteria-de-aluminio" className="font-semibold text-brand-700 underline">
          carpinteros de aluminio y PVC
        </Link>{' '}
        de tu zona, o{' '}
        <Link to="/solicitar-presupuesto" className="font-semibold text-brand-700 underline">
          pedir presupuestos
        </Link>{' '}
        contando cuántas ventanas son y sus medidas aproximadas.
      </P>
      <Nota>
        Precios orientativos para ayudarte a comparar. El precio final depende de cada vivienda y de cada
        profesional.
      </Nota>
    </>
  )
}
