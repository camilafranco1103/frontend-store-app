import { Link } from 'react-router-dom'
import { ShoppingCart, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { CategoriaMap, Producto } from '../types'
import { useCartStore } from '../../../store/useCartStore'

interface ProductCardProps {
  producto: Producto
  categoriaMap: CategoriaMap
}

function formatPrice(price: number | null | undefined): string {
  if (price == null) return 'Sin precio'
  return price.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })
}

const DEFAULT_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(32, 32) scale(1.5)'><rect width='18' height='18' x='3' y='3' rx='2' ry='2' fill='none' stroke='%23a8a29e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/><circle cx='9' cy='9' r='2' fill='none' stroke='%23a8a29e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' fill='none' stroke='%23a8a29e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></g></svg>"

export default function ProductCard({ producto, categoriaMap }: ProductCardProps) {
  const categorias = producto.categorias ?? []
  const principalCat = categorias.find((c) => c.es_principal) ?? categorias[0]
  const categoria = principalCat ? categoriaMap.get(principalCat.categoria_id) : undefined
  const imageSrc = producto.imagen_url || categoria?.imagen_url || DEFAULT_IMAGE

  const addItem = useCartStore((s) => s.addItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const cartItem = useCartStore((s) => s.items.find((i) => i.id === producto.id))

  const stock = producto.stock_cantidad ?? 0
  const inCart = cartItem?.quantity ?? 0
  const atStockLimit = inCart >= stock
  const sinStock = !producto.disponible || stock === 0

  function handleAdd() {
    if (sinStock || atStockLimit) return
    addItem({
      id: producto.id,
      name: producto.name ?? '',
      price: producto.price ?? 0,
      imageSrc,
    })
    toast.success(`${producto.name} agregado al carrito`)
  }

  function handleDecrease() {
    if (inCart === 1) toast.info(`${producto.name} quitado del carrito`)
    updateQuantity(producto.id, inCart - 1)
  }

  function handleIncrease() {
    if (atStockLimit) {
      toast.warning('Stock máximo alcanzado para este producto')
      return
    }
    updateQuantity(producto.id, inCart + 1)
  }

  return (
    <div className="group bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-lg dark:hover:shadow-stone-950/50 hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">

      {/* Clickable area → product detail */}
      <Link to={`/productos/${producto.id}`} className="flex flex-col flex-1">
        <div className="h-48 relative overflow-hidden bg-stone-100 dark:bg-stone-800">
          <img
            src={imageSrc}
            alt={producto.name ?? 'Producto'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE }}
          />
          {sinStock && (
            <span className="absolute top-2 right-2 bg-stone-900/75 dark:bg-stone-950/80 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
              Sin stock
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1 gap-2">
          {categoria && (
            <span className="self-start px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full border border-indigo-100 dark:border-indigo-500/20">
              {categoria.nombre}
            </span>
          )}

          <h3 className="font-semibold text-stone-800 dark:text-stone-100 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2">
            {producto.name}
          </h3>

          <div className="flex items-center justify-between mt-auto pt-1">
            <span className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {formatPrice(producto.price)}
            </span>
            <span className="text-xs text-stone-400 dark:text-stone-500">
              {stock} en stock
            </span>
          </div>
        </div>
      </Link>

      {/* Cart action — outside the Link */}
      <div className="px-4 pb-4">
        {inCart === 0 ? (
          <button
            onClick={handleAdd}
            disabled={sinStock}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-colors
              bg-indigo-500 hover:bg-indigo-600 text-white
              disabled:bg-stone-100 disabled:dark:bg-stone-800 disabled:text-stone-400 disabled:dark:text-stone-600 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={14} />
            {sinStock ? 'Sin stock' : 'Agregar al carrito'}
          </button>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden">
              <button
                onClick={handleDecrease}
                className="px-3 py-2 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Quitar uno"
              >
                <Minus size={13} />
              </button>
              <span className="px-3 text-sm font-bold text-stone-800 dark:text-stone-100 min-w-[2rem] text-center">
                {inCart}
              </span>
              <button
                onClick={handleIncrease}
                disabled={atStockLimit}
                className="px-3 py-2 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Agregar uno"
              >
                <Plus size={13} />
              </button>
            </div>
            <span className="text-xs font-medium text-indigo-500 dark:text-indigo-400">
              {formatPrice((producto.price ?? 0) * inCart)}
            </span>
            {atStockLimit && (
              <span className="text-xs text-amber-500 dark:text-amber-400 font-medium">
                Máx.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
