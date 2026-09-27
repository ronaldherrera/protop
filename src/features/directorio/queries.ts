import { useQuery } from '@tanstack/react-query'
import { obtenerCategorias, obtenerProfesionalPorSlug, obtenerProfesionales, obtenerZonas } from './api'

export function useCategorias() {
  return useQuery({ queryKey: ['categorias'], queryFn: obtenerCategorias, staleTime: 5 * 60 * 1000 })
}

export function useZonas() {
  return useQuery({ queryKey: ['zonas'], queryFn: obtenerZonas, staleTime: 5 * 60 * 1000 })
}

export function useProfesionales() {
  return useQuery({ queryKey: ['profesionales'], queryFn: obtenerProfesionales, staleTime: 60 * 1000 })
}

export function useProfesional(slug: string | undefined) {
  return useQuery({
    queryKey: ['profesional', slug],
    queryFn: () => obtenerProfesionalPorSlug(slug as string),
    enabled: Boolean(slug),
  })
}
