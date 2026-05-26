import { useLocation, Link } from 'react-router-dom'
import { CheckCircle, ShoppingBag } from 'lucide-react'

function formatPrice(price: number): string {
  return price.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })
}

export default function OrderConfirmedPage() {
  const location = useLocation()
  const { orderId, nombre, total } = (location.state ?? {}) as {
    orderId?: number
    nombre?: string
    total?: number
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 text-center max-w-md mx-auto">
      <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40">
        <CheckCircle size={48} className="text-indigo-500 dark:text-indigo-400" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          {nombre ? `¡Gracias, ${nombre.split(' ')[0]}!` : '¡Pedido confirmado!'}
        </h1>
        <p className="text-stone-500 dark:text-stone-400">
          Tu pedido fue recibido y está siendo procesado.
        </p>
      </div>

      {(orderId != null || total != null) && (
        <div className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl p-5 space-y-2 text-sm">
          {orderId != null && (
            <div className="flex justify-between text-stone-500 dark:text-stone-400">
              <span>N° de pedido</span>
              <span className="font-semibold text-stone-800 dark:text-stone-100">#{orderId}</span>
            </div>
          )}
          {total != null && (
            <div className="flex justify-between text-stone-500 dark:text-stone-400">
              <span>Total</span>
              <span className="font-bold text-indigo-500 dark:text-indigo-400">{formatPrice(total)}</span>
            </div>
          )}
        </div>
      )}

      <Link
        to="/"
        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
      >
        <ShoppingBag size={16} />
        Seguir comprando
      </Link>
    </div>
  )
}
