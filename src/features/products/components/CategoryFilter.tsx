import type { Categoria } from '../types'

interface CategoryFilterProps {
  categories: Categoria[]
  selected: number | null
  onChange: (id: number | null) => void
  loading?: boolean
}

export default function CategoryFilter({
  categories,
  selected,
  onChange,
  loading = false,
}: CategoryFilterProps) {
  if (loading) {
    return (
      <div className="flex gap-2 animate-pulse">
        {[80, 96, 72, 88].map((w) => (
          <div key={w} className={`h-8 bg-slate-200 rounded-full`} style={{ width: w }} />
        ))}
      </div>
    )
  }

  if (categories.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selected === null
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-400 hover:text-emerald-600'
        }`}
      >
        Todos
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected === cat.id
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-400 hover:text-emerald-600'
          }`}
        >
          {cat.nombre}
        </button>
      ))}
    </div>
  )
}
