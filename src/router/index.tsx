import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import ProductsPage from '../features/products/pages/ProductsPage'
import ProductDetailPage from '../features/products/pages/ProductDetailPage'
import CartPage from '../features/cart/pages/CartPage'
import RouteError from '../shared/components/RouteError'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <ProductsPage /> },
      { path: 'productos/:id', element: <ProductDetailPage /> },
      { path: 'carrito', element: <CartPage /> },
    ],
  },
])

export default router
