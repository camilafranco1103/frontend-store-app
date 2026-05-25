import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getProducts } from '../services/products.service'

export interface UseProductsParams {
  page: number
  pageSize: number
  search: string
  categoriaId?: number
}

export function useProducts({ page, pageSize, search, categoriaId }: UseProductsParams) {
  return useQuery({
    queryKey: ['products', page, pageSize, search, categoriaId ?? null],
    queryFn: () => getProducts({ page, pageSize, search, categoriaId }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  })
}
