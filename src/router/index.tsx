import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import ProductsPage from '../features/products/pages/ProductsPage'
import ProductDetailPage from '../features/products/pages/ProductDetailPage'
import CartPage from '../features/cart/pages/CartPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ProductsPage /> },
      { path: 'productos/:id', element: <ProductDetailPage /> },
      { path: 'carrito', element: <CartPage /> },
    ],
  },
])

export default router
