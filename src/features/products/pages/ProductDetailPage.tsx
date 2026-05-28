import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Package, AlertCircle, Minus, Plus, Leaf } from 'lucide-react'
import { toast } from 'sonner'
import { useProduct } from '../hooks/useProduct'
import { useCategories } from '../hooks/useCategories'
import { useIngredientes } from '../hooks/useIngredientes'
import { SkeletonDetail } from '../../../shared/components/SkeletonCard'
import ErrorMessage from '../../../shared/components/ErrorMessage'
import { useCartStore } from '../../../shared/store/cartStore'
import type { CategoriaMap, IngredienteMap } from '../types'

const DEFAULT_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(32, 32) scale(1.5)'><rect width='18' height='18' x='3' y='3' rx='2' ry='2' fill='none' stroke='%23a8a29e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/><circle cx='9' cy='9' r='2' fill='none' stroke='%23a8a29e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' fill='none' stroke='%23a8a29e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></g></svg>"

function formatPrice(price: number | null | undefined): string {
  if (price == null) return 'Sin precio'
  return price.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const productId = Number(id)

  const [quantity, setQuantity] = useState(1)

  const { data: product, isLoading, isError, error, refetch } = useProduct(productId)
  const { data: categories = [] } = useCategories()
  const { data: ingredientes = [] } = useIngredientes()

  const addItem = useCartStore((s) => s.addItem)

  const categoriaMap = useMemo<CategoriaMap>(() => {
    const map: CategoriaMap = new Map()
    categories.forEach((c) => map.set(c.id, c))
    return map
  }, [categories])

  const ingredienteMap = useMemo<IngredienteMap>(() => {
    const map: IngredienteMap = new Map()
    ingredientes.forEach((i) => map.set(i.id, i))
    return map
  }, [ingredientes])

  if (isLoading) return <SkeletonDetail />

  if (isError) {
    return (
      <div className="space-y-4">
        <BackButton />
        <ErrorMessage error={error} onRetry={() => void refetch()} />
      </div>
    )
  }

  if (!product) return null

  const categorias = product.categorias ?? []
  const principalCat = categorias.find((c) => c.es_principal) ?? categorias[0]
  const categoria = principalCat ? categoriaMap.get(principalCat.categoria_id) : undefined
  const imageSrc = product.imagen_url || categoria?.imagen_url || DEFAULT_IMAGE

  const productIngredientes = (product.ingredientes ?? [])
    .map((pi) => ingredienteMap.get(pi.ingrediente_id))
    .filter(Boolean)

  function handleAddToCart() {
    if (!product || !product.price || !product.name) return
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageSrc,
      })
    }
    toast.success(
      quantity === 1
        ? `${product.name} agregado al carrito`
        : `${quantity}× ${product.name} agregados al carrito`,
    )
  }

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 aspect-square lg:aspect-auto lg:h-[420px]">
          <img
            src={imageSrc}
            alt={product.name ?? 'Producto'}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE }}
          />
        </div>

        {/* Info */}
        <div className="space-y-5">
          {/* Category + availability */}
          <div className="flex flex-wrap gap-2 items-center">
            {categoria && (
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full border border-indigo-100 dark:border-indigo-500/20">
                {categoria.nombre}
              </span>
            )}
            {categorias.length > 1 &&
              categorias.slice(1).map((c) => {
                const cat = categoriaMap.get(c.categoria_id)
                return cat ? (
                  <span
                    key={c.categoria_id}
                    className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-xs font-medium rounded-full"
                  >
                    {cat.nombre}
                  </span>
                ) : null
              })}
            <span
              className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                product.disponible
                  ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-800'
              }`}
            >
              {product.disponible ? (
                <Package size={11} />
              ) : (
                <AlertCircle size={11} />
              )}
              {product.disponible ? 'Disponible' : 'Sin stock'}
            </span>
          </div>

          {/* Name */}
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <p className="text-4xl font-bold text-indigo-500 dark:text-indigo-400">
            {formatPrice(product.price)}
          </p>

          {/* Stock */}
          <p className="text-sm text-stone-400 dark:text-stone-500">
            Stock disponible: <span className="font-medium text-stone-600 dark:text-stone-300">{product.stock_cantidad} unidades</span>
          </p>

          {/* Quantity + Add to cart */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2.5 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  aria-label="Reducir cantidad"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 py-2.5 text-sm font-semibold text-stone-800 dark:text-stone-100 min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(q + 1, product.stock_cantidad ?? 99))}
                  className="px-3 py-2.5 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="text-xs text-stone-400 dark:text-stone-500">
                {formatPrice((product.price ?? 0) * quantity)} total
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.disponible}
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-stone-300 dark:disabled:bg-stone-700 disabled:cursor-not-allowed text-white disabled:text-stone-400 dark:disabled:text-stone-500 font-semibold py-3.5 rounded-xl transition-colors"
            >
              <ShoppingCart size={18} />
              Agregar al carrito
            </button>
          </div>

          {/* Ingredients */}
          {productIngredientes.length > 0 && (
            <div className="pt-2 space-y-3 border-t border-stone-100 dark:border-stone-800">
              <h2 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Ingredientes
              </h2>
              <ul className="space-y-2">
                {productIngredientes.map((ing) => (
                  ing && (
                    <li
                      key={ing.id}
                      className="flex items-center justify-between px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <Leaf size={13} className="text-stone-400 dark:text-stone-500 shrink-0" />
                        <span className="text-sm text-stone-700 dark:text-stone-200">{ing.name}</span>
                      </div>
                      {ing.esAlergeno && (
                        <span className="text-xs px-2 py-0.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800 rounded-full font-medium">
                          Alergeno
                        </span>
                      )}
                    </li>
                  )
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BackButton() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
    >
      <ArrowLeft size={15} />
      Volver a productos
    </Link>
  )
}
