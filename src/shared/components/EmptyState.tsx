import { Link } from 'react-router-dom'
import { PackageSearch, SearchX } from 'lucide-react'

interface EmptyStateProps {
  variant?: 'no-results' | 'empty'
  title: string
  description?: string
  actionLabel?: string
  actionTo?: string
  onAction?: () => void
}

export default function EmptyState({
  variant = 'empty',
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: EmptyStateProps) {
  const Icon = variant === 'no-results' ? SearchX : PackageSearch

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800">
        <Icon size={28} className="text-stone-400 dark:text-stone-500" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-stone-700 dark:text-stone-200">{title}</h3>
        {description && (
          <p className="text-stone-500 dark:text-stone-400 max-w-sm text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actionLabel && (actionTo || onAction) && (
        onAction ? (
          <button
            onClick={onAction}
            className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-medium transition-colors"
          >
            {actionLabel}
          </button>
        ) : (
          <Link
            to={actionTo!}
            className="mt-2 inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-medium transition-colors"
          >
            {actionLabel}
          </Link>
        )
      )}
    </div>
  )
}
