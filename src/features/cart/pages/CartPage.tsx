import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore, cartTotalItems, cartTotalPrice, type CartItem } from '../../../shared/store/cartStore'

const DEFAULT_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(32, 32) scale(1.5)'><rect width='18' height='18' x='3' y='3' rx='2' ry='2' fill='none' stroke='%23a8a29e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/><circle cx='9' cy='9' r='2' fill='none' stroke='%23a8a29e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' fill='none' stroke='%23a8a29e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></g></svg>"

function formatPrice(price: number): string {
  return price.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })
}

export default function CartPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)

  const totalItems = cartTotalItems(items)
  const totalPrice = cartTotalPrice(items)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-stone-100 dark:bg-stone-800">
          <ShoppingCart size={36} className="text-stone-400 dark:text-stone-500" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Tu carrito está vacío</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm max-w-xs">
            Explorá nuestro catálogo y agregá productos para hacer tu pedido.
          </p>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
        >
          <ShoppingBag size={16} />
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Carrito</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-0.5 text-sm">
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
          </p>
        </div>
        <button
          onClick={() => { clearCart(); toast.info('Carrito vaciado') }}
          className="flex items-center gap-1.5 text-sm text-stone-400 dark:text-stone-500 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium"
        >
          <Trash2 size={14} />
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 space-y-4 sticky top-24">
          <h2 className="font-semibold text-stone-800 dark:text-stone-100">Resumen del pedido</h2>

          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-stone-500 dark:text-stone-400">
                <span className="truncate max-w-[160px]">
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-100 dark:border-stone-800 pt-3 flex justify-between font-bold text-stone-900 dark:text-stone-100">
            <span>Total</span>
            <span className="text-indigo-500 dark:text-indigo-400 text-lg">{formatPrice(totalPrice)}</span>
          </div>

          <button
            className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3.5 rounded-xl transition-colors"
            onClick={() => navigate('/checkout')}
          >
            Confirmar pedido
            <ArrowRight size={16} />
          </button>

          <Link
            to="/"
            className="block text-center text-sm text-stone-400 dark:text-stone-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}

function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  function handleRemove() {
    removeItem(item.id)
    toast.info(`${item.name} eliminado del carrito`)
  }

  return (
    <div className="flex gap-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-4">
      {/* Image */}
      <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={item.imageSrc}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/productos/${item.id}`}
            className="font-medium text-stone-800 dark:text-stone-100 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors leading-snug line-clamp-2"
          >
            {item.name}
          </Link>
          <button
            onClick={handleRemove}
            className="shrink-0 text-stone-300 dark:text-stone-600 hover:text-red-400 dark:hover:text-red-400 transition-colors"
            aria-label="Eliminar producto"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity controls */}
          <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="px-2.5 py-1.5 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Reducir"
            >
              <Minus size={12} />
            </button>
            <span className="px-3 text-sm font-semibold text-stone-800 dark:text-stone-100">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-2.5 py-1.5 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Aumentar"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Subtotal */}
          <span className="font-bold text-stone-900 dark:text-stone-100">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
