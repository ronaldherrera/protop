import { Children, type ComponentType, isValidElement, type ReactElement, type ReactNode } from 'react'

/** Texto plano de un nodo (para generar el ancla de un título). */
export function textoDe(nodo: ReactNode): string {
  return Children.toArray(nodo)
    .map((hijo) => {
      if (typeof hijo === 'string' || typeof hijo === 'number') return String(hijo)
      if (isValidElement<{ children?: ReactNode }>(hijo)) return textoDe(hijo.props.children)
      return ''
    })
    .join('')
}

export function anclaDe(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Secciones (H2) de una guía, para su índice. Las guías son componentes sin estado ni hooks, así que se pueden
 * evaluar como funciones y recorrer el árbol que devuelven; funciona igual al generar el HTML estático.
 */
export function seccionesDe(Articulo: ComponentType, H2: ComponentType<{ children: ReactNode }>): { id: string; texto: string }[] {
  const secciones: { id: string; texto: string }[] = []
  const recorrer = (nodo: ReactNode) => {
    Children.forEach(nodo, (hijo) => {
      if (!isValidElement<{ children?: ReactNode }>(hijo)) return
      if (hijo.type === H2) {
        const texto = textoDe(hijo.props.children)
        secciones.push({ id: anclaDe(texto), texto })
      } else {
        recorrer(hijo.props.children)
      }
    })
  }
  recorrer((Articulo as (props: object) => ReactElement)({}))
  return secciones
}

export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}
