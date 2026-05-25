import type { Categoria } from '../types'

interface CategoryFilterProps {
  categories: Categoria[]
  selected: number | null
  onChange: (id: number | null) => void
}

export default function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selected === null
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-400'
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
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-400'
          }`}
        >
          {cat.nombre}
        </button>
      ))}
    </div>
  )
}
