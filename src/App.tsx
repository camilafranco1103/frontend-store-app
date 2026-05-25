import { useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { ShoppingBag, ShoppingCart } from 'lucide-react'
import ErrorBoundary from './shared/components/ErrorBoundary'
import ThemeToggle from './shared/components/ThemeToggle'
import { useThemeStore } from './shared/store/themeStore'
import { useCartStore, cartTotalItems } from './shared/store/cartStore'

export default function App() {
  const isDark = useThemeStore((s) => s.isDark)
  const cartItems = useCartStore((s) => s.items)
  const totalItems = cartTotalItems(cartItems)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ShoppingBag size={22} className="text-orange-500" />
            <span className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Store<span className="text-orange-500">App</span>
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="text-stone-600 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors text-sm"
            >
              Productos
            </Link>
            <Link
              to="/carrito"
              className="relative flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-medium transition-colors text-sm"
            >
              <ShoppingCart size={16} />
              Carrito
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 bg-white dark:bg-stone-900 text-orange-500 text-xs font-bold rounded-full border border-orange-500">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  )
}
