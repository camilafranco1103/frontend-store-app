import api from '../../../lib/axios'
import type { Categoria, PaginatedResponse, Producto } from '../types'

export async function getProducts(page = 1, pageSize = 100): Promise<Producto[]> {
  const { data } = await api.get<PaginatedResponse<Producto>>('/productos/', {
    params: { page, page_size: pageSize },
  })

  if (!Array.isArray(data.items)) {
    console.error('[products.service] Respuesta inesperada de /productos/:', data)
    return []
  }

  console.log(`[products.service] ${data.items.length} productos cargados (página ${data.page}/${data.total_pages})`)
  return data.items
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
