/**
 * App.tsx
 *
 * Componente raíz de la aplicación.
 * Responsabilidades:
 *   1. Verificar la sesión al cargar (checkAuth)
 *   2. Sincronizar el tema oscuro/claro con el DOM
 *   3. Delegar el enrutamiento a <AppRouter />
 */
import { useEffect } from 'react'
import AppRouter from './router/AppRouter'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth)
  const isDark = useThemeStore((s) => s.isDark)

  useEffect(() => {
    void checkAuth()
  }, [checkAuth])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return <AppRouter />
}
