interface SpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
}

export default function Spinner({ message, size = 'md' }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <div
        className={`${sizes[size]} border-slate-200 border-t-emerald-600 rounded-full animate-spin`}
      />
      {message && <p className="text-sm font-medium">{message}</p>}
    </div>
  )
}
