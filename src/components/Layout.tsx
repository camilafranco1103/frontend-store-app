/**
 * Layout.tsx
 *
 * Layout principal de la store:
 *   - Header sticky con logo, navegación, carrito y auth
 *   - <Outlet /> para el contenido de cada página
 *   - Toaster global de notificaciones
 */
import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ShoppingCart, User, LogOut, ClipboardList, ChevronDown } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { useThemeStore } from '../store/useThemeStore'
import { useCartStore, cartTotalItems } from '../store/useCartStore'
import { useAuthStore } from '../store/useAuthStore'
import { ROUTES } from '../router/paths'
import ThemeToggle from '../shared/components/ThemeToggle'
import ErrorBoundary from '../shared/components/ErrorBoundary'

export default function Layout() {
  const isDark = useThemeStore((s) => s.isDark)
  const cartItems = useCartStore((s) => s.items)
  const totalItems = cartTotalItems(cartItems)

  const { user, isAuthenticated, logout } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      toast.info('Sesión cerrada')
      navigate(ROUTES.HOME)
    } catch {
      toast.error('Error al cerrar sesión')
    } finally {
      setDropdownOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300 flex flex-col">
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <ShoppingBag size={22} className="text-indigo-500" />
            <span className="text-xl font-bold text-stone-900 dark:text-stone-100">
              FoodStore<span className="text-indigo-500">App</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link
              to={ROUTES.HOME}
              className="text-stone-600 dark:text-stone-400 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium transition-colors text-sm"
            >
              Productos
            </Link>

            {/* Cart Link */}
            <Link
              to={ROUTES.CART}
              className="relative flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium transition-colors text-sm"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-5 bg-white dark:bg-stone-900 text-indigo-500 text-xs font-bold rounded-full border border-indigo-500 px-1">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Auth Section */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition text-sm font-medium focus:outline-none"
                >
                  <User size={15} />
                  <span className="max-w-[80px] sm:max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <>
                    {/* Overlay para cerrar al hacer click fuera */}
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />

                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl shadow-xl z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                        <p className="text-xs text-stone-400 dark:text-stone-500">Sesión iniciada como</p>
                        <p className="text-sm font-semibold text-stone-800 dark:text-stone-100 truncate">
                          {user.name} {user.lastname}
                        </p>
                      </div>

                      <Link
                        to={ROUTES.ORDERS}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-600 dark:text-stone-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
                      >
                        <ClipboardList size={15} />
                        Mis Pedidos
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition text-left"
                      >
                        <LogOut size={15} />
                        Cerrar Sesión
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition"
              >
                <User size={15} />
                <span>Ingresar</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      <Toaster
        position="bottom-right"
        theme={isDark ? 'dark' : 'light'}
        richColors
        closeButton
        toastOptions={{
          duration: 3500,
          style: { fontFamily: 'inherit' },
        }}
      />
    </div>
  )
}
