import { useMemo, useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import type { Categoria } from '../types'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import Spinner from '../../../shared/components/Spinner'
import EmptyState from '../../../shared/components/EmptyState'
import ErrorMessage from '../../../shared/components/ErrorMessage'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const { data: products, isLoading, isError, refetch } = useProducts()
  const { data: categories = [] } = useCategories()

  const categoriaMap = useMemo(() => {
    const map = new Map<number, Categoria>()
    categories.forEach((c) => map.set(c.id, c))
    return map
  }, [categories])

  const filtered = useMemo(() => {
    if (!products) return []
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchCat =
        selectedCategory === null ||
        p.categorias.some((c) => c.categoria_id === selectedCategory)
      return matchSearch && matchCat
    })
  }, [products, search, selectedCategory])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Nuestros Productos</h1>
        <p className="text-slate-500 mt-1">Explorá todo nuestro catálogo y armá tu pedido.</p>
      </div>

      {/* Filtros */}
      <div className="space-y-3">
        <SearchBar value={search} onChange={setSearch} />
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        )}
      </div>

      {/* Contenido */}
      {isLoading && <Spinner message="Cargando productos..." />}

      {isError && (
        <ErrorMessage
          message="No pudimos cargar los productos. Verificá que el servidor esté corriendo."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <EmptyState
          title={search || selectedCategory ? 'Sin resultados' : 'No hay productos disponibles'}
          description={
            search || selectedCategory
              ? 'Intentá con otra búsqueda o categoría.'
              : 'Volvé más tarde, pronto habrá productos.'
          }
        />
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <>
          <p className="text-sm text-slate-500">
            {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
            {selectedCategory || search ? ' encontrados' : ' en total'}
          </p>
          <ProductGrid productos={filtered} categoriaMap={categoriaMap} />
        </>
      )}
    </div>
  )
}
