import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'

export default function RouteError() {
  const error = useRouteError()

  let title = 'Algo salió mal'
  let description = 'Ocurrió un error inesperado.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <span className="text-6xl select-none">💥</span>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="text-slate-500 text-sm">{description}</p>
        <Link
          to="/"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
