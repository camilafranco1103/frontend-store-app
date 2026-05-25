import { useCartStore } from '../../../store/useCartStore'
import type { CartItem as CartItemType } from '../../../store/useCartStore'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore()

  const subtotal = item.price * item.quantity

  const precioFmt = (v: number) =>
    v.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      {/* Icono */}
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-slate-100 flex items-center justify-center flex-shrink-0">
        <span className="text-2xl">🍽️</span>
      </div>

      {/* Nombre y precio unitario */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 truncate">{item.name}</p>
        <p className="text-sm text-slate-500">{precioFmt(item.price)} c/u</p>
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
        >
          −
        </button>
        <span className="w-6 text-center font-semibold text-slate-800">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right flex-shrink-0 min-w-[80px]">
        <p className="font-bold text-slate-900">{precioFmt(subtotal)}</p>
      </div>

      {/* Eliminar */}
      <button
        onClick={() => removeItem(item.id)}
        className="text-slate-300 hover:text-red-500 transition-colors flex-shrink-0"
        title="Eliminar del carrito"
      >
        ✕
      </button>
    </div>
  )
}
