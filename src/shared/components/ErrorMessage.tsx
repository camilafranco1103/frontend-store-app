interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorMessage({
  message = 'Ocurrió un error inesperado.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <span className="text-5xl">⚠️</span>
      <p className="text-slate-700 font-medium">{message}</p>
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
