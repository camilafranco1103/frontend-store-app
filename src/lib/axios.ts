import axios, { AxiosError } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
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
  (error: AxiosError) => {
    const status = error.response?.status ?? 'sin respuesta'
    const url = error.config?.url ?? '?'
    const data = error.response?.data

    if (!error.response) {
      console.error(`[API ✗] Sin conexión — ${url}: ${error.message}`)
    } else {
      console.error(`[API ✗] ${status} ${url}`, data)
    }

    return Promise.reject(error)
  },
)

export default api
