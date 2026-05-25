import { useQuery } from '@tanstack/react-query'
import { getIngredientes } from '../services/products.service'

export function useIngredientes() {
  return useQuery({
    queryKey: ['ingredientes'],
    queryFn: getIngredientes,
  })
}
