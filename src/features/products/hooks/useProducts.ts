import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../services/products.service'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(1, 100),
    select: (data) => data.items,
  })
}
