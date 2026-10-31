import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Tabla, UL } from '../ArticuloUI'

export function PladurEnCasa() {
  return (
    <>
      <P>
        La placa de yeso laminado, que casi todo el mundo llama pladur por la marca más conocida, se usa ya en casi
        cualquier reforma. Sirve para levantar tabiques, bajar techos, esconder instalaciones o aislar una pared
        medianera. Es rápida y limpia, pero no vale para todo.
      </P>

      <H2>Para qué se usa en una vivienda</H2>
      <UL>
        <LI>
          <strong>Tabiques nuevos</strong>: dividir una habitación o hacer un vestidor.
        </LI>
        <LI>
          <strong>Falsos techos</strong>: esconder tuberías o cables, poner focos empotrados o la máquina del aire
          acondicionado.
        </LI>
        <LI>
          <strong>Trasdosados</strong>: forrar una pared para aislarla del frío o del ruido del vecino.
        </LI>
        <LI>
          <strong>Muebles de obra</strong>: hornacinas, cabeceros, frentes de televisión.
        </LI>
      </UL>

      <H2>Precios orientativos</H2>
      <Tabla
        filas={[
          ['Trabajo', 'Precio orientativo'],
          ['Tabique sencillo con aislamiento, terminado para pintar', '35 – 55 € / m²'],
          ['Falso techo continuo', '25 – 45 € / m²'],
          ['Trasdosado con aislante térmico o acústico', '30 – 55 € / m²'],
          ['Foseado para iluminación indirecta', '25 – 45 € / metro lineal'],
        ]}
        nota="Rangos con IVA para trabajos de tamaño normal; las superficies pequeñas suelen tener un mínimo."
      />

      <H2>Qué placa poner en cada sitio</H2>
      <Tabla
        filas={[
          ['Placa', 'Se reconoce por', 'Dónde'],
          ['Estándar', 'Cara blanca o crema', 'Salón, dormitorios, pasillos'],
          ['Hidrófuga', 'Cara verde', 'Baños, cocinas y techos de zonas húmedas'],
          ['Resistente al fuego', 'Cara rosa o roja', 'Cuartos de calderas, separación con garajes'],
          ['Acústica', 'Placa más densa o perforada', 'Paredes con el vecino, techos de salones'],
        ]}
      />

      <Consejo>
        Si vas a colgar muebles altos, la televisión o un radiador, díselo antes al instalador: puede reforzar esa
        zona con un tablero o un montante extra. Después de cerrar la pared es mucho más difícil.
      </Consejo>

      <H2>Lo que el pladur no hace</H2>
      <UL>
        <LI>No sustituye un muro de carga. Si quieres quitar una pared, lee primero cómo saber si es de carga.</LI>
        <LI>Aísla del ruido solo si lleva lana mineral dentro y está bien sellado en los bordes.</LI>
        <LI>En zonas con humedad, solo la placa hidrófuga y bien protegida.</LI>
      </UL>
      <P>
        Si estás pensando en abrir espacios, empieza por{' '}
        <Link to="/blog/tirar-un-tabique" className="font-semibold text-brand-700 underline">
          tirar un tabique: cómo saber si es de carga
        </Link>
        . Y para el trabajo, busca{' '}
        <Link to="/instaladores-de-pladur" className="font-semibold text-brand-700 underline">
          profesionales de pladur y falsos techos
        </Link>{' '}
        en tu zona.
      </P>
      <Nota>Precios orientativos para ayudarte a comparar presupuestos.</Nota>
    </>
  )
}
