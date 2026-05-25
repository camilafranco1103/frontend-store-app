import { Link } from 'react-router-dom'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  actionTo?: string
  onAction?: () => void
}

export default function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <span className="text-6xl select-none">{icon}</span>
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-slate-700">{title}</h3>
        {description && (
          <p className="text-slate-500 max-w-sm text-sm leading-relaxed">{description}</p>
        )}
      </div>

      {actionLabel && (actionTo || onAction) && (
        onAction ? (
          <button
            onClick={onAction}
            className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {actionLabel}
          </button>
        ) : (
          <Link
            to={actionTo!}
            className="mt-2 inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {actionLabel}
          </Link>
        )
      )}
    </div>
  )
}
