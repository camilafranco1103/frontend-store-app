import api from '../../../lib/axios'

export interface GuestOrderItem {
  producto_id: number
  cantidad: number
  nombre_snapshot: string
  precio_snapshot: number
  subtotal_snapshot: number
}

export interface GuestOrderPayload {
  nombre_cliente: string
  telefono: string
  notas?: string
  items: GuestOrderItem[]
}

export interface GuestOrderResponse {
  id: number
  nombre_cliente: string | null
  telefono: string | null
  total: number
  subtotal: number
  created_at: string
}

export async function createGuestOrder(payload: GuestOrderPayload): Promise<GuestOrderResponse> {
  const { data } = await api.post<GuestOrderResponse>('/pedidos/guest', payload)
  return data
}
