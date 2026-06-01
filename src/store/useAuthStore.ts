import { create } from 'zustand'
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getMe,
  type User,
  type LoginParams,
  type RegisterParams,
} from '../features/auth/services/auth.service'

/** Roles que tienen acceso a esta app (store de clientes). */
const ALLOWED_ROLES = ['CLIENT'] as const

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  /** Devuelve true si el usuario tiene al menos uno de los roles dados. */
  hasRole: (...roles: string[]) => boolean
  login: (params: LoginParams) => Promise<void>
  register: (params: RegisterParams) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Empieza en true para que la app sepa que está verificando la sesión

  hasRole: (...roles) => {
    const user = get().user
    if (!user) return false
    return roles.some((r) => user.roles.includes(r))
  },

  login: async (params) => {
    try {
      const user = await apiLogin(params)

      // Validar que el usuario tenga un rol permitido en esta app.
      // Si no lo tiene, cerramos la sesión en el backend y rechazamos
      // el intento sin revelar el motivo real (seguridad).
      const isAllowed = ALLOWED_ROLES.some((r) => user.roles.includes(r))
      if (!isAllowed) {
        await apiLogout().catch(() => {}) // limpiar cookie en backend
        set({ user: null, isAuthenticated: false })
        throw new Error('Credenciales inválidas')
      }

      set({ user, isAuthenticated: true })
    } catch (error) {
      set({ user: null, isAuthenticated: false })
      throw error
    }
  },

  register: async (params) => {
    try {
      const user = await apiRegister(params)
      set({ user, isAuthenticated: true })
    } catch (error) {
      set({ user: null, isAuthenticated: false })
      throw error
    }
  },

  logout: async () => {
    try {
      await apiLogout()
    } catch (error) {
      console.error('Error al hacer logout en el backend, limpiando estado local:', error)
    } finally {
      set({ user: null, isAuthenticated: false })
    }
  },

  checkAuth: async () => {
    set({ isLoading: true })
    try {
      const user = await getMe()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
