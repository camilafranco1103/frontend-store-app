import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'
import { AlertTriangle, MapPinOff } from 'lucide-react'

export default function RouteError() {
  const error = useRouteError()

  let title = 'Algo salió mal'
  let description = 'Ocurrió un error inesperado.'
  let is404 = false

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      is404 = true
      title = 'Página no encontrada'
      description = 'La ruta que buscás no existe.'
    } else {
      title = `Error ${error.status}`
      description = error.statusText
    }
  } else if (error instanceof Error) {
    description = error.message
    console.error('[RouteError]', error)
  }

  const Icon = is404 ? MapPinOff : AlertTriangle

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5 text-center max-w-md">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-stone-100 dark:bg-stone-800">
          <Icon size={36} className="text-stone-400 dark:text-stone-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{title}</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">{description}</p>
        </div>
        <Link
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
