import { BadgeEuro, Inbox, ListChecks, type LucideIcon, MapPinned, ShieldCheck, Store, Trash2 } from 'lucide-react'

export type ClavePendiente = 'valoraciones' | 'reclamaciones' | 'bajas' | 'candidatos'

export type SeccionAdmin = {
  id: string
  etiqueta: string
  icono: LucideIcon
  /** Qué contador de pendientes se muestra junto a la sección en la burbuja. */
  pendiente?: ClavePendiente
}

// Secciones del panel de administración (/admin). Las usan el propio panel (cada sección lleva este id como
// ancla) y la burbuja flotante (components/admin/BurbujaAdmin.tsx): una sección nueva se añade aquí.
export const SECCIONES_ADMIN: SeccionAdmin[] = [
  { id: 'valoraciones', etiqueta: 'Revisar valoraciones', icono: ShieldCheck, pendiente: 'valoraciones' },
  { id: 'reclamaciones', etiqueta: 'Reclamaciones de fichas', icono: Inbox, pendiente: 'reclamaciones' },
  { id: 'bajas', etiqueta: 'Peticiones de baja', icono: Trash2, pendiente: 'bajas' },
  { id: 'negocios-por-revisar', etiqueta: 'Negocios por revisar', icono: MapPinned, pendiente: 'candidatos' },
  { id: 'alta-negocio', etiqueta: 'Dar de alta un negocio', icono: Store },
  { id: 'destacado', etiqueta: 'Precios del Plan Destacado', icono: BadgeEuro },
  { id: 'lista-destacado', etiqueta: 'Lista del Plan Destacado', icono: ListChecks },
]

export const seccionAdmin = (id: string) => SECCIONES_ADMIN.find((seccion) => seccion.id === id)!
