import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { LoadingState } from '../../components/estado/LoadingState'
import { usePerfil } from './queries'
import { useAuth } from './useAuth'

export function RutaAdmin({ children }: { children: ReactNode }) {
  const { user, cargando } = useAuth()
  const perfil = usePerfil()

  if (cargando || (user && perfil.isLoading)) {
    return <LoadingState etiqueta="Comprobando permisos…" />
  }

  if (!user || !perfil.data?.esAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
