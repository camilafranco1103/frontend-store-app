import { Loader2, ArrowRight, AlertCircle } from 'lucide-react'
import type { CartItem } from '../../../../store/useCartStore'

function formatPrice(price: number): string {
  return price.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })
}

interface OrderSummarySidebarProps {
  items: CartItem[]
  totalPrice: number
  isPending: boolean
  isRedirecting: boolean
  selectedAddressId: number | null
  onPlaceOrder: () => void
}

export default function OrderSummarySidebar({
  items,
  totalPrice,
  isPending,
  isRedirecting,
  selectedAddressId,
  onPlaceOrder,
}: OrderSummarySidebarProps) {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 space-y-4 sticky top-24">
      <h2 className="font-semibold text-stone-800 dark:text-stone-100">Resumen del pedido</h2>

      {/* List items */}
      <div className="space-y-2.5 text-sm max-h-60 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-stone-600 dark:text-stone-400">
            <span className="truncate max-w-[150px]">
              {item.name} × {item.quantity}
            </span>
            <span className="shrink-0 font-medium">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Pricing list */}
      <div className="border-t border-stone-100 dark:border-stone-800 pt-3 space-y-2">
        <div className="flex justify-between text-sm text-stone-500">
          <span>Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm text-stone-500">
          <span>Costo de envío</span>
          <span className="text-green-500 font-medium">Gratis</span>
        </div>
        <div className="border-t border-stone-100 dark:border-stone-800 pt-2 flex justify-between font-bold text-stone-900 dark:text-stone-100">
          <span>Total</span>
          <span className="text-indigo-500 dark:text-indigo-400 text-lg">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Submit button */}
      <button
        onClick={onPlaceOrder}
        disabled={isPending || isRedirecting || selectedAddressId === null}
        className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-stone-200 dark:disabled:bg-stone-800 disabled:text-stone-400 text-white font-semibold py-3.5 rounded-xl transition disabled:cursor-not-allowed"
      >
        {isPending || isRedirecting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {isRedirecting ? 'Redirigiendo a pago...' : 'Procesando pedido...'}
          </>
        ) : (
          <>
            Confirmar Pedido
            <ArrowRight size={16} />
          </>
        )}
      </button>

      {selectedAddressId === null && (
        <p className="text-[10px] text-center text-amber-500 font-medium flex items-center justify-center gap-1">
          <AlertCircle size={10} />
          Cargá una dirección de entrega para confirmar.
        </p>
      )}
    </div>
  )
}
