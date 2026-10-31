import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Paso, Pasos, Tabla, UL } from '../ArticuloUI'

export function CerrarLaTerraza() {
  return (
    <>
      <P>
        Con el viento y la lluvia de Cantabria, una terraza abierta se usa pocos meses al año. Cerrarla la convierte en
        una habitación más, pero antes de encargarla hay que tener claro el tema de los permisos: es la causa de casi
        todos los problemas con la comunidad y el ayuntamiento.
      </P>

      <H2>Los permisos, lo primero</H2>
      <P>
        Cerrar una terraza cambia la fachada del edificio, que es un elemento común. Por eso necesitas normalmente dos
        cosas:
      </P>
      <Pasos>
        <Paso titulo="El acuerdo de la comunidad">
          Pide que se trate en la junta de propietarios. Muchas comunidades aprueban un modelo único (color, perfil y
          tipo de cierre) para que todas las terrazas queden iguales.
        </Paso>
        <Paso titulo="La licencia del ayuntamiento">
          Según el municipio, será una licencia de obra menor o una comunicación previa. Algunos ayuntamientos limitan
          los cerramientos o exigen el proyecto de toda la fachada.
        </Paso>
        <Paso titulo="La superficie de la vivienda">
          Un cerramiento puede contar como superficie construida. Pregunta en el ayuntamiento si afecta a la
          edificabilidad o al catastro.
        </Paso>
      </Pasos>

      <Consejo>
        Si en tu edificio ya hay terrazas cerradas, pregunta al administrador si hubo un acuerdo y qué modelo se
        aprobó. Seguir ese modelo facilita mucho el permiso.
      </Consejo>

      <H2>Tipos de cerramiento</H2>
      <Tabla
        filas={[
          ['Tipo', 'Cómo es', 'Precio orientativo'],
          ['Cortina de cristal', 'Paneles de vidrio sin marco que se pliegan a un lado', '250 – 450 € / m²'],
          ['Correderas de aluminio', 'Ventanas correderas con perfil, como las de casa', '200 – 400 € / m²'],
          ['Aluminio con RPT o PVC aislante', 'La terraza pasa a ser parte de la vivienda', '300 – 550 € / m²'],
        ]}
        nota="Rangos orientativos con IVA e instalación. Cambian con el vidrio, el color y la altura."
      />

      <H2>Qué tener en cuenta antes de elegir</H2>
      <UL>
        <LI>
          <strong>Aislamiento</strong>: la cortina de cristal protege del viento y la lluvia, pero no aísla como una
          ventana. Si quieres usarla en invierno, mejor perfil con rotura de puente térmico.
        </LI>
        <LI>
          <strong>Viento</strong>: en zonas expuestas de la costa, pide vidrio templado o laminado y perfiles
          pensados para esa carga.
        </LI>
        <LI>
          <strong>Ventilación</strong>: si la caldera o la salida de humos dan a la terraza, cerrarla puede ser
          peligroso. Consúltalo con el instalador de gas antes.
        </LI>
        <LI>
          <strong>Desagüe</strong>: la terraza debe seguir desaguando bien aunque esté cerrada.
        </LI>
      </UL>

      <P>
        Para el cerramiento, busca{' '}
        <Link to="/persianas-y-toldos" className="font-semibold text-brand-700 underline">
          profesionales de cerramientos
        </Link>{' '}
        o de{' '}
        <Link to="/carpinteria-de-aluminio" className="font-semibold text-brand-700 underline">
          carpintería de aluminio y PVC
        </Link>
        . Te puede interesar también{' '}
        <Link to="/blog/cuanto-cuesta-cambiar-ventanas" className="font-semibold text-brand-700 underline">
          cuánto cuesta cambiar las ventanas
        </Link>
        .
      </P>
      <Nota>
        Guía informativa, no asesoramiento legal. Los permisos dependen de tu comunidad y de tu ayuntamiento:
        confírmalos antes de encargar el trabajo.
      </Nota>
    </>
  )
}
