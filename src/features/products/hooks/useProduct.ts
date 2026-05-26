import { useQuery } from '@tanstack/react-query'
import { getProductById } from '../services/products.service'

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !isNaN(id) && id > 0,
  })
}
