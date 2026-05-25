import api from '../../../lib/axios'
import type { OrderDetailPayload, OrderPayload } from '../types'

export async function createOrder(payload: OrderPayload) {
  const { data } = await api.post('/pedidos/', payload)
  return data
}

export async function createOrderDetail(payload: OrderDetailPayload) {
  const { data } = await api.post('/detalles/', payload)
  return data
}
