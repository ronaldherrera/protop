import { Link } from 'react-router-dom'
import { PaginaLegal } from '../components/legal/PaginaLegal'
import { identidadTitular, SITIO, TITULAR } from '../features/legal/titular'
import { ADSENSE_ACTIVO } from '../lib/monetizacion'

// Textos legales redactados a partir de lo que la aplicación hace de verdad con los datos.
// No sustituyen a un asesoramiento legal: conviene que los revise un profesional antes de crecer.

export function AvisoLegal() {
  return (
    <PaginaLegal titulo="Aviso legal" descripcion="Datos del titular de Protop y condiciones de uso del sitio.">
      <h2>Titular del sitio</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio
        electrónico (LSSI), el titular de {SITIO} es:
      </p>
      <ul>
        <li>Titular: {TITULAR.nombre}</li>
        {TITULAR.nif && <li>NIF: {TITULAR.nif}</li>}
        {TITULAR.domicilio && <li>Domicilio: {TITULAR.domicilio}</li>}
        <li>
          Email: <a href={`mailto:${TITULAR.email}`}>{TITULAR.email}</a>
        </li>
        {TITULAR.registroMercantil && <li>Datos registrales: {TITULAR.registroMercantil}</li>}
      </ul>

      <h2>Qué es Protop</h2>
      <p>
        Protop es un directorio de profesionales de reformas y reparaciones de toda España. Permite buscar
        profesionales, contactar con ellos, pedirles presupuestos y valorar trabajos acreditados con factura. Protop no
        presta los servicios de reforma: el contrato de cada trabajo es entre el particular y el profesional.
      </p>
      <p>Protop no está vinculado a ningún comercio, almacén de materiales ni fabricante.</p>

      <h2>Valoraciones y reputación</h2>
      <p>
        Las valoraciones solo se publican cuando el cliente aporta la factura del trabajo y supera una revisión. La
        puntuación refleja experiencias de clientes con documentación revisada; no es una garantía del resultado de
        futuros trabajos. Los anuncios y el Plan Destacado nunca modifican la puntuación de nadie.
      </p>

      <h2>Contenidos de los usuarios</h2>
      <p>
        Cada profesional es responsable de la información de su ficha y de sus presupuestos, y cada particular de la
        información de sus solicitudes. Protop puede retirar contenidos falsos, ilícitos o que vulneren derechos de
        terceros.
      </p>

      <h2>Fichas creadas por Protop</h2>
      <p>
        Algunas fichas se crean con los datos que el propio negocio publica (su web, su ficha en mapas…) y se marcan
        como «creadas por Protop». El negocio puede reclamarla gratis o pedir que se borre desde la propia ficha. Más
        detalles en la <Link to="/legal/privacidad">política de privacidad</Link>.
      </p>

      <h2>Propiedad intelectual</h2>
      <p>
        El diseño, el logotipo y los textos propios de Protop pertenecen a su titular. Las fotos y textos de cada ficha
        pertenecen a quien los publica.
      </p>

      <h2>Legislación aplicable</h2>
      <p>Este sitio se rige por la legislación española.</p>
    </PaginaLegal>
  )
}

export function Privacidad() {
  return (
    <PaginaLegal
      titulo="Política de privacidad"
      descripcion="Qué datos trata Protop, para qué, durante cuánto tiempo y cómo ejercer tus derechos."
    >
      <h2>Responsable del tratamiento</h2>
      <p>
        {identidadTitular()}. Para cualquier cuestión sobre tus datos:{' '}
        <a href={`mailto:${TITULAR.email}`}>{TITULAR.email}</a>.
      </p>

      <h2>Qué datos tratamos y para qué</h2>
      <table>
        <thead>
          <tr>
            <th>Datos</th>
            <th>Para qué</th>
            <th>Base legal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cuenta: nombre, email y contraseña (cifrada)</td>
            <td>Darte acceso y prestarte el servicio</td>
            <td>Ejecución del contrato</td>
          </tr>
          <tr>
            <td>Ficha profesional: nombre comercial, oficios, zonas, descripción, fotos y medios de contacto</td>
            <td>Publicarla en el directorio para que te encuentren</td>
            <td>Ejecución del contrato</td>
          </tr>
          <tr>
            <td>Solicitudes de presupuesto: descripción, localidad, fotos, medidas y fechas</td>
            <td>Hacerlas llegar a profesionales del oficio y la zona</td>
            <td>Ejecución del contrato</td>
          </tr>
          <tr>
            <td>Propuestas y aclaraciones entre particular y profesional</td>
            <td>Que podáis comparar y resolver dudas sobre el trabajo</td>
            <td>Ejecución del contrato</td>
          </tr>
          <tr>
            <td>Valoraciones y la factura que las acredita</td>
            <td>Comprobar que el trabajo existió y publicar la valoración</td>
            <td>Interés legítimo en evitar valoraciones falsas</td>
          </tr>
          <tr>
            <td>Fichas creadas por Protop: datos que el negocio publica (nombre, oficio, zona, teléfono, email, web)</td>
            <td>Que los vecinos encuentren a los profesionales de su zona</td>
            <td>Interés legítimo (ver más abajo)</td>
          </tr>
          <tr>
            <td>Lista del Plan Destacado: email, nombre del negocio, oficio y zona</td>
            <td>Avisarte cuando se pueda contratar</td>
            <td>Tu consentimiento, al apuntarte</td>
          </tr>
          <tr>
            <td>Peticiones de baja o de reclamación de una ficha</td>
            <td>Atenderlas y poder demostrar que se atendieron</td>
            <td>Obligación legal e interés legítimo</td>
          </tr>
          <tr>
            <td>Cookies de publicidad de Google</td>
            <td>Mostrar anuncios que ayudan a mantener Protop gratis</td>
            <td>Tu consentimiento, que puedes retirar</td>
          </tr>
        </tbody>
      </table>

      <h2>Qué se ve en público y qué no</h2>
      <ul>
        <li>Es público: la ficha profesional, sus valoraciones (puntuaciones, sin comentarios) y los trabajos que el profesional publique.</li>
        <li>
          No es público: tu email, las facturas, la dirección exacta de una solicitud ni tus datos de contacto como
          particular. Las solicitudes solo las ven los profesionales registrados.
        </li>
        <li>Las facturas se guardan en un almacenamiento privado y solo puede verlas administración para revisarlas.</li>
        <li>
          Cuántas visitas y clics para contactar ha tenido cada ficha en los últimos 30 días. Son solo cifras por día:
          no guardamos quién visita una ficha.
        </li>
      </ul>

      <h2>Fichas creadas con datos públicos</h2>
      <p>
        Cuando un negocio todavía no está en Protop, podemos crear su ficha con los datos que él mismo publica en su web o
        en su ficha de mapas, o con los que figuran en OpenStreetMap, una base de datos abierta (licencia ODbL, ©
        colaboradores de OpenStreetMap). Lo hacemos por interés legítimo: ayudar a los vecinos a encontrar profesionales de su zona
        con información que el negocio ya ha hecho pública para darse a conocer. Guardamos de dónde sacamos cada dato e
        informamos al negocio en el plazo máximo de un mes. El negocio puede{' '}
        <strong>reclamar su ficha gratis</strong> o <strong>pedir que la borremos</strong> desde la propia ficha, sin
        necesidad de cuenta.
      </p>

      <h2>A quién llegan los datos</h2>
      <ul>
        <li>Supabase: base de datos, almacenamiento de archivos y cuentas. Los datos se alojan en la Unión Europea.</li>
        <li>Hostinger: alojamiento de la web.</li>
        <li>
          OpenStreetMap (Nominatim), solo si pulsas «Usar mi ubicación» al elegir localidad: recibe tu posición
          aproximada (redondeada a unos 100 metros) para decirnos en qué municipio estás. Protop no guarda tu ubicación.
        </li>
        <li>
          Google (AdSense), solo si aceptas sus cookies{ADSENSE_ACTIVO ? '' : ' (todavía no está activado)'}. Google puede
          tratar datos fuera de la UE con las garantías del Marco de Privacidad de Datos UE-EE. UU.
        </li>
        <li>
          Stripe, cuando se active el Plan Destacado: gestiona los pagos de los profesionales. Protop no guarda datos de
          tarjetas.
        </li>
      </ul>
      <p>No vendemos datos a nadie. Los profesionales solo ven de una solicitud lo necesario para presupuestarla.</p>

      <h2>Cuánto tiempo los guardamos</h2>
      <ul>
        <li>Los datos de tu cuenta, mientras la tengas abierta.</li>
        <li>Las facturas, mientras su valoración siga publicada, para poder resolver reclamaciones.</li>
        <li>Las peticiones de baja atendidas, el tiempo necesario para acreditar que se atendieron.</li>
        <li>Lo que la ley obligue a conservar, durante el plazo que marque.</li>
      </ul>

      <h2>Tus derechos</h2>
      <p>
        Puedes pedir acceso a tus datos, corregirlos, borrarlos, oponerte a su uso, limitarlo o recibirlos en un formato
        reutilizable escribiendo a <a href={`mailto:${TITULAR.email}`}>{TITULAR.email}</a>. Respondemos en un mes como máximo. Si no quedas
        satisfecho, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).
      </p>
    </PaginaLegal>
  )
}

export function Cookies() {
  return (
    <PaginaLegal titulo="Cookies" descripcion="Qué guarda Protop en tu navegador y para qué.">
      <p>
        Protop guarda en tu navegador solo lo necesario para funcionar. Las cookies de publicidad de Google se usan
        únicamente si las aceptas.
      </p>

      <h2>Necesarias (no requieren consentimiento)</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Para qué</th>
            <th>Duración</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>sb-…-auth-token</td>
            <td>Mantener tu sesión iniciada (Supabase)</td>
            <td>Hasta que cierres sesión</td>
          </tr>
          <tr>
            <td>protop-consentimiento-cookies</td>
            <td>Recordar lo que elegiste en el aviso de cookies</td>
            <td>Hasta que la borres</td>
          </tr>
          <tr>
            <td>protop_modo</td>
            <td>Recordar si usas Protop como particular o como profesional</td>
            <td>Hasta que la borres</td>
          </tr>
          <tr>
            <td>protop-ficha-borrador-…</td>
            <td>No perder lo que llevas escrito al crear tu ficha profesional</td>
            <td>Hasta que la publiques</td>
          </tr>
          <tr>
            <td>protop-volver-tras-confirmar</td>
            <td>Volver a lo que estabas haciendo después de confirmar tu cuenta desde el correo</td>
            <td>Hasta que confirmes la cuenta</td>
          </tr>
          <tr>
            <td>protop-rotacion</td>
            <td>Mantener el orden de los resultados patrocinados durante tu visita</td>
            <td>Hasta cerrar la pestaña</td>
          </tr>
        </tbody>
      </table>

      <h2>De publicidad (solo con tu consentimiento)</h2>
      <p>
        Google AdSense usa cookies para mostrar y medir anuncios. Solo se cargan si eliges «Aceptar todas» en el aviso
        de cookies{ADSENSE_ACTIVO ? '' : '; ahora mismo la publicidad no está activada'}. Más información en la política de
        Google: policies.google.com/technologies/ads.
      </p>

      <h2>Cómo cambiar de opinión</h2>
      <p>
        Puedes borrar los datos de este sitio desde la configuración de tu navegador; la próxima vez que entres, el aviso
        de cookies te volverá a preguntar.
      </p>
    </PaginaLegal>
  )
}
