import { useQuery, useQueryClient } from '@tanstack/react-query'
import { obtenerPerfil } from './api'
import { useAuth } from './useAuth'

export function usePerfil() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['perfil', user?.id],
    queryFn: () => obtenerPerfil(user!.id),
    enabled: Boolean(user),
  })
}

export function useInvalidarPerfil() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return () => queryClient.invalidateQueries({ queryKey: ['perfil', user?.id] })
}
