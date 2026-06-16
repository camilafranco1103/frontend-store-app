import api from '../../../lib/axios'

export interface PedidoItem {
  id: number
  pedido_id: number
  producto_id: number
  cantidad: number
  nombre_snapshot: string
  precio_snapshot: number
  subtotal_snapshot: number
  personalizacion: number
}

export interface PedidoItemCreate {
  producto_id: number
  cantidad: number
  nombre_snapshot: string
  precio_snapshot: number
  subtotal_snapshot: number
}

export interface PedidoCreatePayload {
  direccion_entrega_id: number
  forma_pago_codigo: string
  notas?: string
  items: PedidoItemCreate[]
}

export interface PedidoResponse {
  id: number
  usuario_id: number
  direccion_entrega_id: number
  estado_codigo: string
  forma_pago_codigo: string
  subtotal: number
  descuento: number
  costo_envio: number
  total: number
  notas: string | null
  created_at: string
  updated_at: string
  detalles_pedido?: PedidoItem[]
}

export async function createOrder(payload: PedidoCreatePayload): Promise<PedidoResponse> {
  const { data } = await api.post<PedidoResponse>('/pedidos/', payload)
  return data
}

export interface PaginatedPedidosRead {
  items: PedidoResponse[]
  total: number
  page: number
  size: number
  total_pages: number
}

export async function getMyOrders(page: number = 1, size: number = 10, estado?: string, search?: string): Promise<PaginatedPedidosRead> {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  params.append('size', size.toString())
  if (estado) {
    params.append('estado', estado)
  }
  if (search) {
    params.append('search', search)
  }
  
  const { data } = await api.get<PaginatedPedidosRead>(`/pedidos/mis-pedidos?${params.toString()}`)
  return data
}

export async function getOrderById(id: number | string): Promise<PedidoResponse> {
  const { data } = await api.get<PedidoResponse>(`/pedidos/${id}`)
  return data
}

export async function createPaymentPreference(pedidoId: number): Promise<{ checkout_url: string }> {
  const { data } = await api.post<{ checkout_url: string }>(`/pagos/preferencia/${pedidoId}`)
  return data
}
