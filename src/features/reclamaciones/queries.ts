import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  borrarFichaSinReclamar,
  crearFichaSinReclamar,
  descartarPeticionBaja,
  obtenerPeticionesBaja,
  obtenerReclamacionesPendientes,
  pedirBajaFicha,
  reclamarFicha,
  resolverReclamacion,
} from './api'

export function useCrearFichaSinReclamar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crearFichaSinReclamar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profesionales'] }),
  })
}

export function useReclamarFicha() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ profesionalId, mensaje }: { profesionalId: string; mensaje?: string }) =>
      reclamarFicha(profesionalId, mensaje),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mi-profesional'] })
      queryClient.invalidateQueries({ queryKey: ['profesionales'] })
      queryClient.invalidateQueries({ queryKey: ['profesional'] })
    },
  })
}

export function useReclamacionesPendientes() {
  return useQuery({ queryKey: ['reclamaciones-pendientes'], queryFn: obtenerReclamacionesPendientes })
}

export function useResolverReclamacion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, aprobar, motivo }: { id: string; aprobar: boolean; motivo?: string }) =>
      resolverReclamacion(id, aprobar, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reclamaciones-pendientes'] })
      queryClient.invalidateQueries({ queryKey: ['profesionales'] })
    },
  })
}

export function usePedirBajaFicha() {
  return useMutation({
    mutationFn: ({ profesionalId, contacto, motivo }: { profesionalId: string; contacto: string; motivo: string }) =>
      pedirBajaFicha(profesionalId, contacto, motivo),
  })
}

export function usePeticionesBaja() {
  return useQuery({ queryKey: ['peticiones-baja'], queryFn: obtenerPeticionesBaja })
}

export function useBorrarFichaSinReclamar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: borrarFichaSinReclamar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['peticiones-baja'] })
      queryClient.invalidateQueries({ queryKey: ['profesionales'] })
    },
  })
}

export function useDescartarPeticionBaja() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: descartarPeticionBaja,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['peticiones-baja'] }),
  })
}
