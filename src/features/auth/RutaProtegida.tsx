import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { LoadingState } from '../../components/estado/LoadingState'
import { useAuth } from './useAuth'

export function RutaProtegida({ children }: { children: ReactNode }) {
  const { user, cargando } = useAuth()
  const ubicacion = useLocation()

  if (cargando) {
    return <LoadingState etiqueta="Comprobando sesión…" />
  }

  if (!user) {
    return <Navigate to="/acceso" state={{ desde: ubicacion.pathname }} replace />
  }

  return <>{children}</>
}
