export interface Categoria {
  id: number
  nombre: string
  descripcion: string
  imagen_url: string | null
  parent_id: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ProductoCategoria {
  categoria_id: number
  es_principal: boolean
  delete_at: string | null
}

export interface ProductoIngrediente {
  ingrediente_id: number
}

export interface Producto {
  id: number
  name: string
  price: number
  stock_cantidad: number
  disponible: boolean
  categorias: ProductoCategoria[] | null
  ingredientes: ProductoIngrediente[] | null
}

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  page_size: number
  total_pages: number
}

export type CategoriaMap = Map<number, Categoria>
