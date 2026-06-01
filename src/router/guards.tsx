/**
 * guards.tsx
 *
 * Guards de navegación de la aplicación.
 *
 * - PrivateRoute : requiere sesión activa. Si no → redirige a /login.
 * - GuestRoute   : solo para invitados. Si ya logueó → redirige al home.
 */
import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { ROUTES } from './routes'
import Spinner from '../shared/components/Spinner'

// ── Shared loader ─────────────────────────────────────────────────────────────
const LoadingScreen = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <Spinner size="lg" />
  </div>
)

// ── PrivateRoute ──────────────────────────────────────────────────────────────
interface PrivateRouteProps {
  children: ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const location = useLocation()

  if (isLoading) return <LoadingScreen />

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return <>{children}</>
}

// ── GuestRoute ────────────────────────────────────────────────────────────────
interface GuestRouteProps {
  children: ReactNode
}

export function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const location = useLocation()

  if (isLoading) return <LoadingScreen />

  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || ROUTES.HOME
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}
