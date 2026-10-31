import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/useAuth'
import {
  type BusquedaDirectorio,
  buscarProfesionales,
  type DatosFormularioProfesional,
  guardarMiProfesional,
  obtenerCategorias,
  obtenerFamilias,
  obtenerMiProfesional,
  obtenerProfesionalPorSlug,
  obtenerZonas,
} from './api'

export function useFamilias() {
  return useQuery({ queryKey: ['familias'], queryFn: obtenerFamilias, staleTime: 5 * 60 * 1000 })
}

export function useCategorias() {
  return useQuery({ queryKey: ['categorias'], queryFn: obtenerCategorias, staleTime: 5 * 60 * 1000 })
}

export function useZonas() {
  return useQuery({ queryKey: ['zonas'], queryFn: obtenerZonas, staleTime: 5 * 60 * 1000 })
}

/** Páginas del directorio para una búsqueda; `fetchNextPage` trae las siguientes. */
export function useBusquedaProfesionales(busqueda: BusquedaDirectorio, { activa = true }: { activa?: boolean } = {}) {
  return useInfiniteQuery({
    queryKey: ['profesionales', busqueda],
    queryFn: ({ pageParam }) => buscarProfesionales(busqueda, pageParam),
    initialPageParam: 0,
    getNextPageParam: (pagina) => pagina.siguiente,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
    enabled: activa,
  })
}

export function useProfesional(slug: string | undefined) {
  return useQuery({
    queryKey: ['profesional', slug],
    queryFn: () => obtenerProfesionalPorSlug(slug as string),
    enabled: Boolean(slug),
  })
}

export function useMiProfesional() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['mi-profesional', user?.id],
    queryFn: () => obtenerMiProfesional(user!.id),
    enabled: Boolean(user),
  })
}

export function useGuardarMiProfesional() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { idExistente: string | null; datos: DatosFormularioProfesional }) =>
      guardarMiProfesional(user!.id, variables.idExistente, variables.datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mi-profesional', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['profesionales'] })
    },
  })
}
