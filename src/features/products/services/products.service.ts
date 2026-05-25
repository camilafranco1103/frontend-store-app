import api from '../../../lib/axios'
import type { Categoria, Ingrediente, PaginatedResponse, Producto } from '../types'

export async function getProducts(page = 1, pageSize = 100): Promise<PaginatedResponse<Producto>> {
  const { data } = await api.get<PaginatedResponse<Producto>>('/productos/', {
    params: { page, page_size: pageSize },
  })
  return data
}

export async function getProductById(id: number): Promise<Producto> {
  const { data } = await api.get<Producto>(`/productos/${id}`)
  return data
}

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>('/categorias/')
  return data
}

export async function getIngredientes(): Promise<Ingrediente[]> {
  const { data } = await api.get<Ingrediente[]>('/Ingredientes/')
  return data
}
