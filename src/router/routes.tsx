/**
 * routes.tsx
 *
 * Configuración declarativa de todas las rutas de la aplicación.
 * Cada objeto describe UNA ruta con sus propiedades:
 *   - path        : URL de la ruta
 *   - element     : componente a renderizar (lazy para code splitting)
 *   - requiresAuth: si true → redirige a /login si no hay sesión
 *   - guestOnly   : si true → redirige al home si ya hay sesión (login/registro)
 *
 * Para agregar una nueva ruta: añadí un objeto acá.
 * El router en index.tsx aplica los guards automáticamente.
 */
import { lazy } from 'react'

// ── Lazy imports (cada página se carga solo cuando se navega a ella) ──────────
const ProductsPage      = lazy(() => import('../features/products/pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('../features/products/pages/ProductDetailPage'))
const CartPage          = lazy(() => import('../features/cart/pages/CartPage'))
const CheckoutPage      = lazy(() => import('../features/cart/pages/CheckoutPage'))
const OrderConfirmedPage= lazy(() => import('../features/cart/pages/OrderConfirmedPage'))
const MisPedidosPage    = lazy(() => import('../features/cart/pages/MisPedidosPage'))
const LoginPage         = lazy(() => import('../features/auth/pages/LoginPage'))
const RegisterPage      = lazy(() => import('../features/auth/pages/RegisterPage'))
const NotFoundPage      = lazy(() => import('../shared/pages/NotFoundPage'))

// ── Tipo de configuración de ruta ─────────────────────────────────────────────
export interface AppRoute {
  path: string
  element: React.ReactNode
  /** Si true → el usuario debe estar autenticado. Redirige a /login si no. */
  requiresAuth?: boolean
  /** Si true → solo accesible si NO hay sesión. Redirige al home si ya logueó. */
  guestOnly?: boolean
}

// ── Rutas de la app ───────────────────────────────────────────────────────────

/**
 * Rutas públicas: cualquier usuario puede acceder, autenticado o no.
 */
export const publicRoutes: AppRoute[] = [
  { path: '/',             element: <ProductsPage /> },
  { path: 'productos/:id', element: <ProductDetailPage /> },
  { path: 'carrito',       element: <CartPage /> },
]

/**
 * Rutas de invitado: solo accesibles si NO hay sesión activa.
 * Si el usuario ya está logueado, se redirige al home.
 */
export const guestRoutes: AppRoute[] = [
  { path: 'login',    element: <LoginPage />,    guestOnly: true },
  { path: 'registro', element: <RegisterPage />, guestOnly: true },
]

/**
 * Rutas protegidas: requieren sesión activa con rol CLIENT.
 * Si no hay sesión, redirigen a /login recordando la URL de origen.
 */
export const privateRoutes: AppRoute[] = [
  { path: 'checkout',          element: <CheckoutPage />,      requiresAuth: true },
  { path: 'pedido-confirmado', element: <OrderConfirmedPage />, requiresAuth: true },
  { path: 'mis-pedidos',       element: <MisPedidosPage />,    requiresAuth: true },
]

/**
 * Ruta fallback 404.
 */
export const notFoundRoute: AppRoute = {
  path: '*',
  element: <NotFoundPage />,
}

