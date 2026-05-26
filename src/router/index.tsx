import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import ProductsPage from '../features/products/pages/ProductsPage'
import ProductDetailPage from '../features/products/pages/ProductDetailPage'
import CartPage from '../features/cart/pages/CartPage'
import CheckoutPage from '../features/cart/pages/CheckoutPage'
import OrderConfirmedPage from '../features/cart/pages/OrderConfirmedPage'
import RouteError from '../shared/components/RouteError'
import NotFoundPage from '../shared/pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <ProductsPage /> },
      { path: 'productos/:id', element: <ProductDetailPage /> },
      { path: 'carrito', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'pedido-confirmado', element: <OrderConfirmedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default router
