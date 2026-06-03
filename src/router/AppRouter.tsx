/**
 * AppRouter.tsx
 *
 * Componente raíz del sistema de rutas.
 * Lee la configuración declarativa de routes.tsx y aplica los guards
 * automáticamente, igual que el frontend admin.
 *
 * Estructura:
 *   BrowserRouter
 *     └─ Suspense (lazy loading)
 *         └─ Routes
 *             ├─ Rutas públicas    → sin guards
 *             ├─ Rutas de invitado → envueltas en <GuestRoute>
 *             ├─ Layout (navbar + contenido)
 *             │   └─ Rutas privadas → envueltas en <PrivateRoute>
 *             └─ * → NotFoundPage
 */
import { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '../components/Layout'
import { PrivateRoute, GuestRoute } from './guards'
import { publicRoutes, guestRoutes, privateRoutes, notFoundRoute } from './routes'
import Spinner from '../shared/components/Spinner'

const PageSpinner = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <Spinner size="lg" />
  </div>
)

const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<PageSpinner />}>
      <Routes>

        {/* ── Rutas dentro del Layout (navbar + contenido) ─────────────── */}
        <Route path="/" element={<Layout />}>

          {/* Rutas de invitado (login, registro) */}
          {guestRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<GuestRoute>{route.element}</GuestRoute>}
            />
          ))}

          {/* Rutas públicas */}
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path === '/' ? undefined : route.path}
              index={route.path === '/'}
              element={route.element}
            />
          ))}

          {/* Rutas protegidas */}
          {privateRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<PrivateRoute>{route.element}</PrivateRoute>}
            />
          ))}

          {/* Fallback 404 dentro del Layout */}
          <Route path={notFoundRoute.path} element={notFoundRoute.element} />

        </Route>

      </Routes>
    </Suspense>
  </BrowserRouter>
)

export default AppRouter
