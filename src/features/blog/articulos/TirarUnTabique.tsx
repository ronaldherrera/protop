import { Link } from 'react-router-dom'
import { Consejo, H2, LI, Nota, P, Paso, Pasos, Tabla, UL } from '../ArticuloUI'

export function TirarUnTabique() {
  return (
    <>
      <P>
        Unir la cocina con el salón o hacer un dormitorio más grande es de las reformas más pedidas. La pregunta que lo
        decide todo es una: <strong>¿esa pared es un tabique o es un muro de carga?</strong> Un tabique se tira en un
        día. Un muro de carga sostiene el edificio y no se toca sin un técnico.
      </P>

      <H2>Pistas para saber si es de carga</H2>
      <UL>
        <LI>
          <strong>El grosor</strong>: un tabique suele tener unos 7 – 10 cm con el yeso; un muro de carga, 15 cm o más.
        </LI>
        <LI>
          <strong>El sonido</strong>: un tabique suena hueco al golpearlo; un muro, macizo.
        </LI>
        <LI>
          <strong>La posición</strong>: los muros de fachada, los que separan con el vecino y los del centro de la
          vivienda en edificios antiguos suelen ser de carga.
        </LI>
        <LI>
          <strong>Los pisos de arriba</strong>: si en todas las plantas hay una pared justo en el mismo sitio, es mala
          señal.
        </LI>
        <LI>
          <strong>Los planos</strong>: el ayuntamiento o el administrador pueden tener los planos del edificio.
        </LI>
      </UL>

      <Consejo>
        Estas pistas sirven para orientarte, no para decidir. Ante cualquier duda, que un arquitecto o arquitecto
        técnico lo vea en persona. La visita cuesta mucho menos que un problema de estructura.
      </Consejo>

      <H2>Si es un tabique</H2>
      <Pasos>
        <Paso titulo="Comprueba qué va dentro">
          Enchufes, interruptores y radiadores indican cables o tuberías que habrá que desviar.
        </Paso>
        <Paso titulo="Pide el permiso de obra">
          Tirar un tabique suele ser obra menor o comunicación previa en el ayuntamiento.
        </Paso>
        <Paso titulo="Derribo, retirada y remates">
          Lo que más trabajo da no es tirar la pared, sino rematar el suelo, el techo y las paredes donde estaba.
        </Paso>
      </Pasos>
      <Tabla
        filas={[
          ['Trabajo', 'Precio orientativo'],
          ['Derribar un tabique y retirar el escombro', '25 – 45 € / m²'],
          ['Remates de suelo, techo y paredes', '300 – 1.200 €'],
          ['Desviar un punto de luz o un enchufe', '40 – 90 € por punto'],
        ]}
        nota="Rangos orientativos con IVA. El escombro suele necesitar un contenedor o sacas homologadas."
      />

      <H2>Si es de carga</H2>
      <P>
        Se puede abrir, pero solo con un proyecto firmado por un técnico, que calcula la viga que sustituirá al muro
        y cómo apuntalar mientras se hace. Necesita licencia de obra mayor en la mayoría de municipios y, en un
        edificio, el permiso de la comunidad. El precio sube mucho: cuenta con varios miles de euros entre el
        proyecto, la viga, el apuntalamiento y los remates.
      </P>

      <H2>Alternativas si no se puede</H2>
      <UL>
        <LI>Abrir un hueco más pequeño, como una puerta ancha o una ventana interior, también con cálculo.</LI>
        <LI>
          Un tabique de vidrio o una puerta corredera: une espacios sin derribar. Para nuevos tabiques, lee{' '}
          <Link to="/blog/pladur-en-casa" className="font-semibold text-brand-700 underline">
            pladur en casa
          </Link>
          .
        </LI>
      </UL>
      <P>
        Busca{' '}
        <Link to="/derribos-y-desescombros" className="font-semibold text-brand-700 underline">
          profesionales de derribos
        </Link>{' '}
        o de{' '}
        <Link to="/albaniles" className="font-semibold text-brand-700 underline">
          albañilería
        </Link>{' '}
        en tu zona, y lee{' '}
        <Link to="/blog/como-organizar-una-reforma-integral" className="font-semibold text-brand-700 underline">
          cómo organizar una reforma integral
        </Link>{' '}
        si el cambio es grande.
      </P>
      <Nota>
        Guía informativa. Ninguna pared se derriba sin estar seguro de que no es estructural: confírmalo con un
        técnico.
      </Nota>
    </>
  )
}
