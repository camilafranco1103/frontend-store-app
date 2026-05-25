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
        {[80, 100, 72, 88, 96].map((w) => (
          <div
            key={w}
            className="h-8 bg-stone-200 dark:bg-stone-800 rounded-full"
            style={{ width: w }}
          />
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
            ? 'bg-indigo-500 text-white shadow-sm'
            : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400'
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
              ? 'bg-indigo-500 text-white shadow-sm'
              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400'
          }`}
        >
          {cat.nombre}
        </button>
      ))}
    </div>
  )
}
