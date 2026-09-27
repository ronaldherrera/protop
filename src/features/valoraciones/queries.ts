import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/useAuth'
import type { DesgloseValoracion } from '../../types/profesional'
import {
  enviarValoracion,
  obtenerMisValoraciones,
  obtenerValoracionesParaRevision,
  revisarValoracion,
} from './api'

export function useMisValoraciones() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['mis-valoraciones', user?.id],
    queryFn: () => obtenerMisValoraciones(user!.id),
    enabled: Boolean(user),
  })
}

export function useEnviarValoracion() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: {
      profesionalId: string
      conceptos: DesgloseValoracion
      descripcionTrabajo: string
      factura: File
    }) =>
      enviarValoracion(
        user!.id,
        variables.profesionalId,
        variables.conceptos,
        variables.descripcionTrabajo,
        variables.factura,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mis-valoraciones', user?.id] })
    },
  })
}

export function useValoracionesParaRevision() {
  return useQuery({ queryKey: ['valoraciones-revision'], queryFn: obtenerValoracionesParaRevision })
}

export function useRevisarValoracion() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { id: string; estado: 'aprobada' | 'rechazada'; motivo: string | null }) =>
      revisarValoracion(variables.id, user!.id, variables.estado, variables.motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['valoraciones-revision'] })
      queryClient.invalidateQueries({ queryKey: ['profesionales'] })
      queryClient.invalidateQueries({ queryKey: ['profesional'] })
    },
  })
}
