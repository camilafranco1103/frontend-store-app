/**
 * paths.ts
 *
 * ROUTES — Fuente única de verdad para todos los paths de la app.
 */

export const ROUTES = {
  HOME:            '/',
  PRODUCT_DETAIL:  (id: number | string) => `/productos/${id}`,
  CART:            '/carrito',
  CHECKOUT:        '/checkout',
  ORDER_CONFIRMED: '/pedido-confirmado',
  ORDERS:          '/mis-pedidos',
  LOGIN:           '/login',
  REGISTER:        '/registro',
} as const

export type StaticRoute = Exclude<(typeof ROUTES)[keyof typeof ROUTES], Function>
