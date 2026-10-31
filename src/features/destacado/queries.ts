import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { guardarPrecioDestacado, obtenerPreciosDestacado } from './api'

export function usePreciosDestacado() {
  return useQuery({ queryKey: ['precios-destacado'], queryFn: obtenerPreciosDestacado })
}

export function useGuardarPrecioDestacado() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: guardarPrecioDestacado,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['precios-destacado'] }),
  })
}
