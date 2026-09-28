import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/useAuth'
import {
  actualizarTrabajo,
  borrarTrabajo,
  comentarTrabajo,
  crearTrabajo,
  obtenerTrabajosDeProfesional,
  obtenerTrabajosVinculados,
  vincularClientePorEmail,
} from './api'
import type { DatosTrabajo } from './types'

export function useTrabajosDeProfesional(profesionalId: string | undefined) {
  return useQuery({
    queryKey: ['trabajos-publicados', profesionalId],
    queryFn: () => obtenerTrabajosDeProfesional(profesionalId as string),
    enabled: Boolean(profesionalId),
  })
}

function useInvalidarTrabajos(profesionalId: string) {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['trabajos-publicados', profesionalId] })
}

export function useCrearTrabajo(profesionalId: string) {
  const invalidar = useInvalidarTrabajos(profesionalId)
  return useMutation({
    mutationFn: (datos: DatosTrabajo) => crearTrabajo(profesionalId, datos),
    onSuccess: invalidar,
  })
}

export function useActualizarTrabajo(profesionalId: string) {
  const invalidar = useInvalidarTrabajos(profesionalId)
  return useMutation({
    mutationFn: (variables: { id: string; datos: DatosTrabajo }) => actualizarTrabajo(variables.id, variables.datos),
    onSuccess: invalidar,
  })
}

export function useBorrarTrabajo(profesionalId: string) {
  const invalidar = useInvalidarTrabajos(profesionalId)
  return useMutation({
    mutationFn: (id: string) => borrarTrabajo(id),
    onSuccess: invalidar,
  })
}

export function useVincularCliente(profesionalId: string) {
  const invalidar = useInvalidarTrabajos(profesionalId)
  return useMutation({
    mutationFn: (variables: { trabajoId: string; email: string }) =>
      vincularClientePorEmail(variables.trabajoId, variables.email),
    onSuccess: invalidar,
  })
}

export function useTrabajosVinculados() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['trabajos-vinculados', user?.id],
    queryFn: () => obtenerTrabajosVinculados(user!.id),
    enabled: Boolean(user),
  })
}

export function useComentarTrabajo() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables: { trabajoId: string; comentario: string; profesionalId?: string }) =>
      comentarTrabajo(variables.trabajoId, user!.id, variables.comentario),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trabajos-vinculados', user?.id] })
      if (variables.profesionalId) {
        queryClient.invalidateQueries({ queryKey: ['trabajos-publicados', variables.profesionalId] })
      }
    },
  })
}
