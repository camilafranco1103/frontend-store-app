import { useQuery } from '@tanstack/react-query'
import { getCategorias } from '../services/products.service'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategorias,
    staleTime: 1000 * 60 * 15,
  })
}
