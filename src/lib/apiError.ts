import { AxiosError } from 'axios'

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return 'Sin conexión con el servidor. Verificá que el backend esté corriendo en ' +
        (import.meta.env.VITE_API_URL ?? 'http://localhost:8000') + '.'
    }

    switch (error.response.status) {
      case 400: return 'La solicitud tiene datos incorrectos.'
      case 404: return 'El recurso no fue encontrado.'
      case 422: return 'Los datos enviados son inválidos.'
      case 500: return 'Error interno del servidor. Intentá más tarde.'
      case 503: return 'El servidor no está disponible. Intentá más tarde.'
      default:  return `Error ${error.response.status}: ${error.message}`
    }
  }

  if (error instanceof Error) return error.message
  return 'Ocurrió un error inesperado.'
}

export function is404(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 404
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof AxiosError && !error.response
}
