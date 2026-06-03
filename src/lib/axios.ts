import axios, { AxiosError } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const params = config.params ? JSON.stringify(config.params) : ''
    console.log(`[API →] ${config.method?.toUpperCase()} ${config.url} ${params}`.trimEnd())
    return config
  },
  (error: AxiosError) => {
    console.error('[API →] Error al preparar request:', error.message)
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    console.log(`[API ✓] ${response.status} ${response.config.url}`)
    return response
  },
  async (error: AxiosError) => {
    const status = error.response?.status ?? 'sin respuesta'
    const url = error.config?.url ?? '?'
    const data = error.response?.data
    const originalRequest = error.config as any

    if (status === 401 && originalRequest && !originalRequest._retry && url !== '/auth/refresh' && url !== '/auth/login') {
      originalRequest._retry = true
      try {
        // Usamos axios en crudo para evitar loop de interceptores
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true })
        // Si tiene éxito, reintentar la solicitud original
        return api(originalRequest)
      } catch (refreshError) {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    if (!error.response) {
      console.error(`[API ✗] Sin conexión — ${url}: ${error.message}`)
    } else {
      console.error(`[API ✗] ${status} ${url}`, data)
    }

    return Promise.reject(error)
  },
)

export default api
