import { WifiOff, AlertTriangle, RefreshCw } from 'lucide-react'
import { getErrorMessage, isNetworkError } from '../../lib/apiError'

interface ErrorMessageProps {
  error: unknown
  onRetry?: () => void
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const message = getErrorMessage(error)
  const isNetwork = isNetworkError(error)
  const Icon = isNetwork ? WifiOff : AlertTriangle

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/30">
        <Icon size={24} className="text-red-500 dark:text-red-400" />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-stone-700 dark:text-stone-200">
          {isNetwork ? 'Sin conexión con el servidor' : 'Algo salió mal'}
        </p>
        <p className="text-stone-500 dark:text-stone-400 text-sm max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl font-medium transition-colors"
        >
          <RefreshCw size={15} />
          Reintentar
        </button>
      )}
    </div>
  )
}
