import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Tabla, UL } from '../ArticuloUI'

export function RevisionCalderaGas() {
  return (
    <>
      <P>
        Mucha gente confunde dos cosas distintas: la <strong>revisión de mantenimiento de la caldera</strong> y la{' '}
        <strong>inspección de la instalación de gas</strong>. Tienen plazos diferentes, las hace gente diferente y no
        sustituyen la una a la otra. Saber cuál toca te evita pagar dos veces o, peor, quedarte sin hacer la que sí es
        obligatoria.
      </P>

      <H2>Las dos revisiones, de un vistazo</H2>
      <Tabla
        filas={[
          ['', 'Mantenimiento de la caldera', 'Inspección de la instalación de gas'],
          ['Qué se revisa', 'La caldera: combustión, seguridad, limpieza', 'Toda la instalación: tuberías, llaves, ventilación y aparatos'],
          ['Cada cuánto', 'Cada 2 años en calderas domésticas de hasta 70 kW (RITE), o antes si lo pide el fabricante', 'Cada 5 años'],
          ['Quién la hace', 'Una empresa mantenedora habilitada que eliges tú', 'La distribuidora de gas, o una empresa autorizada en su nombre'],
          ['Aviso', 'Te toca acordarte o tenerlo en contrato', 'La distribuidora suele avisar de la fecha'],
        ]}
        nota="Plazos según el Reglamento de Instalaciones Térmicas en los Edificios (RITE) y la normativa de gas. Algunas comunidades autónomas tienen requisitos propios."
      />

      <H2>Qué incluye una revisión de mantenimiento</H2>
      <UL>
        <LI>Análisis de la combustión y de la salida de humos.</LI>
        <LI>Comprobación de los dispositivos de seguridad y de la presión del circuito.</LI>
        <LI>Limpieza de quemadores e intercambiador, y revisión del vaso de expansión.</LI>
        <LI>Un certificado o parte de la revisión firmado, que conviene guardar.</LI>
      </UL>

      <Consejo>
        Muchos fabricantes exigen revisiones anuales para mantener la garantía. Mira el manual o el contrato de
        garantía de tu caldera: si pide una revisión al año, es esa la que cuenta.
      </Consejo>

      <H2>Cuidado con las visitas que no has pedido</H2>
      <P>
        Es frecuente que alguien llame a la puerta diciendo que viene «a hacer la revisión obligatoria del gas». La
        inspección periódica la avisa la distribuidora con antelación y por escrito, y puedes comprobarlo llamando a su
        teléfono oficial. No firmes ni pagues nada a quien no puedas identificar, y nunca a quien solo acepta efectivo.
      </P>

      <H2>Señales de que tu caldera necesita una revisión ya</H2>
      <UL>
        <LI>Llama amarilla o anaranjada en lugar de azul.</LI>
        <LI>Hollín o manchas negras alrededor de la caldera.</LI>
        <LI>Pierde presión con frecuencia o hace ruidos nuevos.</LI>
        <LI>Olor a gas: en ese caso, cierra la llave, ventila, no enciendas luces y llama al teléfono de urgencias de tu distribuidora.</LI>
      </UL>

      <H2>A quién llamar</H2>
      <P>
        Para el mantenimiento o una avería, busca{' '}
        <Link to="/calefaccion-y-gas" className="font-semibold text-brand-700 underline">
          profesionales de gas y calefacción
        </Link>{' '}
        de tu zona. Si estás pensando en cambiar de sistema, quizá te interese leer{' '}
        <Link to="/blog/aire-acondicionado-o-bomba-de-calor" className="font-semibold text-brand-700 underline">
          aire acondicionado o bomba de calor: qué instalar
        </Link>
        .
      </P>
      <Nota>
        Esta guía es informativa. Los plazos exactos dependen de la potencia de tu equipo, del fabricante y de la
        normativa de tu comunidad: confírmalos con tu empresa mantenedora.
      </Nota>
    </>
  )
}
