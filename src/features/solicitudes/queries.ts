import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/useAuth'
import {
  abrirSolicitudManualmente,
  cerrarSolicitud,
  crearBorradorSolicitud,
  enviarAclaracion,
  enviarAPago,
  enviarPropuesta,
  obtenerAclaraciones,
  obtenerMiPropuesta,
  obtenerMisPropuestas,
  obtenerMisSolicitudes,
  obtenerPropuestasDeSolicitud,
  obtenerSolicitud,
  obtenerSolicitudesDisponibles,
  obtenerSolicitudesPendientesPago,
} from './api'
import type { DatosPropuesta, DatosSolicitud } from './types'

export function useMisSolicitudes() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['mis-solicitudes', user?.id],
    queryFn: () => obtenerMisSolicitudes(user!.id),
    enabled: Boolean(user),
  })
}

export function useSolicitud(id: string | undefined) {
  return useQuery({
    queryKey: ['solicitud', id],
    queryFn: () => obtenerSolicitud(id as string),
    enabled: Boolean(id),
  })
}

export function useSolicitudesDisponibles() {
  return useQuery({ queryKey: ['solicitudes-disponibles'], queryFn: obtenerSolicitudesDisponibles })
}

export function useSolicitudesPendientesPago() {
  return useQuery({ queryKey: ['solicitudes-pendientes-pago'], queryFn: obtenerSolicitudesPendientesPago })
}

export function useCrearBorradorSolicitud() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (datos: DatosSolicitud) => crearBorradorSolicitud(user!.id, datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mis-solicitudes', user?.id] }),
  })
}

function useCambioEstadoSolicitud(mutationFn: (id: string) => Promise<void>) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['mis-solicitudes', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['solicitud', id] })
      queryClient.invalidateQueries({ queryKey: ['solicitudes-disponibles'] })
      queryClient.invalidateQueries({ queryKey: ['solicitudes-pendientes-pago'] })
    },
  })
}

export function useEnviarAPago() {
  return useCambioEstadoSolicitud(enviarAPago)
}

export function useCerrarSolicitud() {
  return useCambioEstadoSolicitud(cerrarSolicitud)
}

export function useAbrirSolicitudManualmente() {
  return useCambioEstadoSolicitud(abrirSolicitudManualmente)
}

export function usePropuestasDeSolicitud(solicitudId: string | undefined) {
  return useQuery({
    queryKey: ['propuestas', solicitudId],
    queryFn: () => obtenerPropuestasDeSolicitud(solicitudId as string),
    enabled: Boolean(solicitudId),
  })
}

export function useMisPropuestas(profesionalId: string | undefined) {
  return useQuery({
    queryKey: ['mis-propuestas', profesionalId],
    queryFn: () => obtenerMisPropuestas(profesionalId as string),
    enabled: Boolean(profesionalId),
  })
}

export function useMiPropuesta(solicitudId: string | undefined, profesionalId: string | undefined) {
  return useQuery({
    queryKey: ['mi-propuesta', solicitudId, profesionalId],
    queryFn: () => obtenerMiPropuesta(solicitudId as string, profesionalId as string),
    enabled: Boolean(solicitudId && profesionalId),
  })
}

export function useEnviarPropuesta() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables: { solicitudId: string; profesionalId: string; datos: DatosPropuesta }) =>
      enviarPropuesta(variables.solicitudId, variables.profesionalId, variables.datos),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['propuestas', variables.solicitudId] })
      queryClient.invalidateQueries({
        queryKey: ['mi-propuesta', variables.solicitudId, variables.profesionalId],
      })
      queryClient.invalidateQueries({ queryKey: ['mis-propuestas', variables.profesionalId] })
    },
  })
}

export function useAclaraciones(solicitudId: string | undefined) {
  return useQuery({
    queryKey: ['aclaraciones', solicitudId],
    queryFn: () => obtenerAclaraciones(solicitudId as string),
    enabled: Boolean(solicitudId),
  })
}

export function useEnviarAclaracion() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables: { solicitudId: string; mensaje: string }) =>
      enviarAclaracion(variables.solicitudId, user!.id, variables.mensaje),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['aclaraciones', variables.solicitudId] })
    },
  })
}
