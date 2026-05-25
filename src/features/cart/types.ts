export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export interface OrderPayload {
  usuario_id: number
  subtotal: number
  costo_envio: number
  total: number
  notas?: string
  estado_codigo?: string
  forma_pago_codigo?: string
}

export interface OrderDetailPayload {
  pedido_id: number
  producto_id: number
  cantidad: number
  nombre_snapshot: string
  precio_snapshot: number
  subtotal_snapshot: number
}
