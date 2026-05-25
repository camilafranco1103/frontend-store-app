import { useMemo, useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import type { CategoriaMap } from '../types'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import { SkeletonGrid } from '../../../shared/components/SkeletonCard'
import EmptyState from '../../../shared/components/EmptyState'
import ErrorMessage from '../../../shared/components/ErrorMessage'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const {
    data: products,
    isLoading: loadingProducts,
    isError: productsError,
    error: productsRawError,
    refetch,
  } = useProducts()

  const {
    data: categories = [],
    isLoading: loadingCategories,
  } = useCategories()

  const categoriaMap = useMemo<CategoriaMap>(() => {
    const map: CategoriaMap = new Map()
    categories.forEach((c) => map.set(c.id, c))
    return map
  }, [categories])

  const filtered = useMemo(() => {
    if (!products) return []

    return products.filter((p) => {
      const nameMatch = typeof p.name === 'string'
        ? p.name.toLowerCase().includes(search.toLowerCase())
        : true

      const catMatch =
        selectedCategory === null ||
        (p.categorias ?? []).some((c) => c.categoria_id === selectedCategory)

      return nameMatch && catMatch
    })
  }, [products, search, selectedCategory])

  const hasActiveFilters = search !== '' || selectedCategory !== null

  function clearFilters() {
    setSearch('')
    setSelectedCategory(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          Nuestros Productos
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">
          Explorá nuestro catálogo y armá tu pedido.
        </p>
      </div>

      <div className="space-y-3">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
          loading={loadingCategories}
        />
      </div>

      {loadingProducts && <SkeletonGrid count={8} />}

      {productsError && !loadingProducts && (
        <ErrorMessage
          error={productsRawError}
          onRetry={() => void refetch()}
        />
      )}

      {!loadingProducts && !productsError && (
        <>
          {filtered.length > 0 ? (
            <>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {filtered.length}{' '}
                {filtered.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="ml-2 text-indigo-500 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Limpiar filtros
                  </button>
                )}
              </p>
              <ProductGrid productos={filtered} categoriaMap={categoriaMap} />
            </>
          ) : (
            <EmptyState
              title={hasActiveFilters ? 'Sin resultados' : 'No hay productos disponibles'}
              description={
                hasActiveFilters
                  ? 'Ningún producto coincide con tu búsqueda o categoría seleccionada.'
                  : 'Todavía no hay productos cargados. Volvé más tarde.'
              }
              actionLabel={hasActiveFilters ? 'Limpiar filtros' : undefined}
              onAction={hasActiveFilters ? clearFilters : undefined}
            />
          )}
        </>
      )}
    </div>
  )
}
