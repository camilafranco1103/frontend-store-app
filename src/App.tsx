import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useCartStore } from './store/useCartStore'

function Navbar() {
  const items = useCartStore((s) => s.items)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const navigate = useNavigate()

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🛍️</span>
          <span className="text-xl font-bold text-emerald-600">StoreApp</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
          >
            Productos
          </Link>
          <button
            onClick={() => navigate('/carrito')}
            className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <span>🛒</span>
            <span>Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
