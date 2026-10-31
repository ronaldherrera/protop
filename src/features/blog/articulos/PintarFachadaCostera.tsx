import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Paso, Pasos, UL } from '../ArticuloUI'

export function PintarFachadaCostera() {
  return (
    <>
      <P>
        En la costa cantábrica las fachadas sufren más que en el interior: lluvia frecuente, viento, salitre y humedad
        casi todo el año. Por eso en Santander, Laredo, Castro-Urdiales o Suances es habitual ver pintura desconchada,
        manchas verdes de musgo o fisuras al poco tiempo de pintar. La diferencia entre una fachada que dura diez años y
        una que hay que repintar a los tres casi nunca está en la pintura: está en la{' '}
        <strong>preparación y en elegir el sistema adecuado</strong>.
      </P>

      <H2>Por qué se estropean antes las fachadas junto al mar</H2>
      <UL>
        <LI>
          <strong>El salitre</strong> se deposita en la superficie, atrae humedad y degrada pinturas y morteros.
        </LI>
        <LI>
          <strong>La lluvia con viento</strong> moja más las caras norte y noroeste, que además secan peor.
        </LI>
        <LI>
          <strong>Musgos y verdín</strong> crecen donde no da el sol y mantienen la pared húmeda.
        </LI>
        <LI>
          <strong>Fisuras pequeñas</strong> dejan entrar agua, que al secarse empuja la pintura desde dentro.
        </LI>
      </UL>

      <H2>Cómo se pinta bien una fachada, paso a paso</H2>
      <Pasos>
        <Paso titulo="Diagnóstico">
          Revisar fisuras, zonas huecas del revoco, humedades y el estado de cornisas y aleros. Si hay grietas que se
          mueven, primero hay que saber por qué.
        </Paso>
        <Paso titulo="Limpieza">
          Lavado a presión controlada y tratamiento antimusgo y fungicida. Pintar sobre suciedad o verdín es la forma más
          rápida de que se levante.
        </Paso>
        <Paso titulo="Reparación">
          Sanear las zonas sueltas, sellar fisuras con productos elásticos y reponer el mortero donde haga falta.
        </Paso>
        <Paso titulo="Imprimación">
          Una imprimación adecuada al soporte ayuda a que la pintura agarre y regula la absorción.
        </Paso>
        <Paso titulo="Pintura de exterior">
          Dos manos de una pintura de exterior de calidad, transpirable y resistente a la intemperie. En zonas muy
          expuestas, los revestimientos elásticos o de siloxano suelen comportarse mejor.
        </Paso>
      </Pasos>

      <Consejo>
        Elige bien la época: lo ideal es pintar con varios días secos seguidos y sin heladas, algo que en Cantabria suele
        concentrarse entre finales de primavera y principios de otoño. Pregunta al pintor qué hará si llueve a mitad de
        trabajo.
      </Consejo>

      <H2>Si vives en un edificio: la comunidad decide</H2>
      <P>
        La fachada es un elemento común. Pintarla, cambiar el color o reparar el revoco se aprueba en la junta de la
        comunidad de propietarios, y en muchos municipios necesita además permiso del ayuntamiento, sobre todo si hay que
        poner andamio en la vía pública o el edificio está protegido. Infórmate en tu ayuntamiento antes de contratar.
      </P>

      <H2>A quién llamar</H2>
      <P>
        Para una fachada conviene un profesional de{' '}
        <Link to="/rehabilitacion-de-fachadas" className="font-semibold text-brand-700 underline">
          rehabilitación de fachadas
        </Link>{' '}
        o de{' '}
        <Link to="/pintores" className="font-semibold text-brand-700 underline">
          pintura
        </Link>{' '}
        con experiencia en exteriores. Si dentro de casa tienes manchas en las paredes que dan a la fachada, quizá te
        interese también{' '}
        <Link to="/blog/humedades-en-casa-cantabria" className="font-semibold text-brand-700 underline">
          la guía de humedades en casa
        </Link>
        .
      </P>
      <Nota>
        Esta guía es orientativa. Una fachada con grietas importantes o desprendimientos puede ser un riesgo: si ves
        trozos sueltos, avisa a la comunidad y pide una revisión técnica cuanto antes.
      </Nota>
    </>
  )
}
