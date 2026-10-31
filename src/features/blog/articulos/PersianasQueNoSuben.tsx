import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Tabla, UL } from '../ArticuloUI'

export function PersianasQueNoSuben() {
  return (
    <>
      <P>
        La persiana que se queda a medias, la cinta deshilachada o la que baja de golpe son de las averías más comunes
        en casa. La mayoría se arreglan en menos de una hora y sin cambiar la persiana entera. Y si estás harto de
        tirar de la cinta, motorizarla cuesta menos de lo que parece.
      </P>

      <H2>Qué le pasa a tu persiana</H2>
      <Tabla
        filas={[
          ['Síntoma', 'Causa probable', 'Arreglo'],
          ['La cinta está deshilachada o rota', 'Desgaste normal', 'Cambiar la cinta'],
          ['La cinta no recoge al soltarla', 'Muelle del recogedor roto', 'Cambiar el recogedor'],
          ['Baja de golpe o se descuelga', 'Lamas sueltas del eje o polea rota', 'Revisar el cajón y el eje'],
          ['Se atasca a mitad', 'Guías torcidas o lamas rotas', 'Enderezar guías o cambiar lamas'],
          ['Hace mucho ruido', 'Falta de limpieza o guías secas', 'Limpiar y lubricar con silicona'],
        ]}
      />

      <H2>Precios orientativos</H2>
      <Tabla
        filas={[
          ['Trabajo', 'Precio orientativo'],
          ['Cambiar la cinta', '40 – 90 €'],
          ['Cambiar el recogedor y la cinta', '60 – 120 €'],
          ['Cambiar varias lamas rotas', '50 – 150 €'],
          ['Motorizar una persiana (motor tubular e interruptor)', '150 – 350 €'],
          ['Persiana nueva de aluminio con aislante', '120 – 250 € / m²'],
        ]}
        nota="Rangos orientativos con IVA y mano de obra. Motorizar con mando o desde el móvil cuesta algo más."
      />

      <H2>Motorizar: lo que hay que saber</H2>
      <UL>
        <LI>Se cambia el eje del cajón por un motor tubular; la persiana es la misma si está en buen estado.</LI>
        <LI>Hace falta un punto de luz cerca del cajón. Si no lo hay, el electricista tiene que llevar el cable.</LI>
        <LI>Las persianas grandes y pesadas necesitan un motor de más par: díselo al instalador.</LI>
        <LI>Motorizar a la vez todas las de la casa abarata bastante cada unidad.</LI>
      </UL>

      <Consejo>
        Aprovecha que se abre el cajón para meterle aislante por dentro. El cajón de la persiana es uno de los puntos
        por donde más frío entra en casa, y aislarlo cuesta muy poco con el cajón abierto.
      </Consejo>

      <H2>¿Arreglar o cambiar?</H2>
      <P>
        Si las lamas son de PVC muy viejo, se rompen solas o la persiana ya no cierra bien, suele compensar cambiarla
        por una de aluminio con espuma aislante. Si vas a cambiar las ventanas, hazlo todo junto: lee{' '}
        <Link to="/blog/cuanto-cuesta-cambiar-ventanas" className="font-semibold text-brand-700 underline">
          cuánto cuesta cambiar las ventanas
        </Link>
        .
      </P>
      <P>
        Busca{' '}
        <Link to="/persianas-y-toldos" className="font-semibold text-brand-700 underline">
          profesionales de persianas y cerramientos
        </Link>{' '}
        de tu zona en Protop.
      </P>
      <Nota>Precios orientativos para ayudarte a valorar el presupuesto.</Nota>
    </>
  )
}
