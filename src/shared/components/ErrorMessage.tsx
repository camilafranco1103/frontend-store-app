import { getErrorMessage, isNetworkError } from '../../lib/apiError'

interface ErrorMessageProps {
  error: unknown
  onRetry?: () => void
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const message = getErrorMessage(error)
  const isNetwork = isNetworkError(error)

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <span className="text-5xl select-none">{isNetwork ? '🔌' : '⚠️'}</span>
      <div className="space-y-1">
        <p className="font-semibold text-slate-700">
          {isNetwork ? 'Sin conexión con el servidor' : 'Algo salió mal'}
        </p>
        <p className="text-slate-500 text-sm max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
