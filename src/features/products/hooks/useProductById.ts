import { useQuery } from '@tanstack/react-query'
import { getProductById } from '../services/products.service'

export function useProductById(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  })
}
