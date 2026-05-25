import { Link } from 'react-router-dom'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  actionTo?: string
}

export default function EmptyState({ title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <span className="text-6xl">📭</span>
      <h3 className="text-xl font-semibold text-slate-700">{title}</h3>
      {description && <p className="text-slate-500 max-w-sm">{description}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-2 inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
