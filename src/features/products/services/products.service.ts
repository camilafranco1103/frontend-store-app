import api from '../../../lib/axios'
import type { Categoria, Ingrediente, PaginatedResponse, Producto } from '../types'

export interface GetProductsParams {
  page?: number
  pageSize?: number
  search?: string
  categoriaId?: number
}

export async function getProducts({
  page = 1,
  pageSize = 12,
  search,
  categoriaId,
}: GetProductsParams = {}): Promise<PaginatedResponse<Producto>> {
  const params: Record<string, unknown> = { page, page_size: pageSize }
  if (search) params.search = search
  if (categoriaId != null) params.categoria_id = categoriaId

  const { data } = await api.get<PaginatedResponse<Producto>>('/productos/', { params })
  return data
}

export async function getProductById(id: number): Promise<Producto> {
  const { data } = await api.get<Producto>(`/productos/${id}`)
  return data
}

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>('/categorias/')

  if (!Array.isArray(data)) {
    console.error('[products.service] Respuesta inesperada de /categorias/:', data)
    return []
  }

  console.log(`[products.service] ${data.length} categorías cargadas`)
  return data
}

export async function getIngredientes(): Promise<Ingrediente[]> {
  const { data } = await api.get<Ingrediente[]>('/Ingredientes/')

  if (!Array.isArray(data)) {
    console.error('[products.service] Respuesta inesperada de /Ingredientes/:', data)
    return []
  }

  return data
}
