import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import { SkeletonGrid } from '../../../shared/components/SkeletonCard'
import EmptyState from '../../../shared/components/EmptyState'
import ErrorMessage from '../../../shared/components/ErrorMessage'
import type { CategoriaMap } from '../types'
import { useMemo } from 'react'

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50]

export default function ProductsPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [searchInput, setSearchInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const search = useDebounce(searchInput, 400)

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1) }, [search, selectedCategory, pageSize])

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useProducts({
    page,
    pageSize,
    search,
    categoriaId: selectedCategory ?? undefined,
  })

  const { data: categories = [], isLoading: loadingCategories } = useCategories()

  const categoriaMap = useMemo<CategoriaMap>(() => {
    const map: CategoriaMap = new Map()
    categories.forEach((c) => map.set(c.id, c))
    return map
  }, [categories])

  const items = data?.items ?? []
  const totalPages = data?.total_pages ?? 1
  const hasActiveFilters = searchInput !== '' || selectedCategory !== null

  function clearFilters() {
    setSearchInput('')
    setSelectedCategory(null)
  }

  function handleCategoryChange(id: number | null) {
    setSelectedCategory(id)
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
        <SearchBar value={searchInput} onChange={setSearchInput} />
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={handleCategoryChange}
          loading={loadingCategories}
        />
      </div>

      {/* Loading skeleton — only on hard load, not on pagination/filter transitions */}
      {isLoading && <SkeletonGrid count={pageSize} />}

      {isError && !isLoading && (
        <ErrorMessage error={error} onRetry={() => void refetch()} />
      )}

      {!isLoading && !isError && (
        <>
          {/* Results bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className={`text-sm text-stone-500 dark:text-stone-400 transition-opacity ${isFetching ? 'opacity-50' : ''}`}>
              {items.length} producto{items.length !== 1 ? 's' : ''}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-2 text-indigo-500 dark:text-indigo-400 hover:underline font-medium"
                >
                  Limpiar filtros
                </button>
              )}
            </p>
          </div>

          {items.length > 0 ? (
            <>
              <div className={`transition-opacity duration-150 ${isFetching ? 'opacity-60' : ''}`}>
                <ProductGrid productos={items} categoriaMap={categoriaMap} />
              </div>

              {/* Pagination + page size */}
              <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1 || isFetching}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium border border-stone-200 dark:border-stone-700
                    text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800
                    disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={15} />
                  Anterior
                </button>

                <span className="text-sm text-stone-500 dark:text-stone-400">
                  Página{' '}
                  <span className="font-semibold text-stone-800 dark:text-stone-100">{page}</span>
                  {' '}de{' '}
                  <span className="font-semibold text-stone-800 dark:text-stone-100">{totalPages}</span>
                </span>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages || isFetching}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium border border-stone-200 dark:border-stone-700
                    text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800
                    disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                  <ChevronRight size={15} />
                </button>

                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="ml-2 px-3 py-2 rounded-xl text-sm font-medium border border-stone-200 dark:border-stone-700
                    bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size} por página
                    </option>
                  ))}
                </select>
              </div>
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
