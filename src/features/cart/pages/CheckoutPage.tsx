import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore, cartTotalPrice, type CartItem } from '../../../shared/store/cartStore'
import { createGuestOrder } from '../services/orders.service'

function formatPrice(price: number): string {
  return price.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (items.length === 0) navigate('/carrito', { replace: true })
  }, [items, navigate])

  const totalPrice = cartTotalPrice(items)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const order = await createGuestOrder({
        nombre_cliente: nombre.trim(),
        telefono: telefono.trim(),
        notas: notas.trim() || undefined,
        items: items.map((item: CartItem) => ({
          producto_id: item.id,
          cantidad: item.quantity,
          nombre_snapshot: item.name,
          precio_snapshot: item.price,
          subtotal_snapshot: item.price * item.quantity,
        })),
      })
      clearCart()
      navigate('/pedido-confirmado', { state: { orderId: order.id, nombre: order.nombre_cliente, total: order.total } })
    } catch {
      const msg = 'No se pudo confirmar el pedido. Revisá tu conexión e intentá de nuevo.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <Link
          to="/carrito"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors mb-3"
        >
          <ArrowLeft size={14} />
          Volver al carrito
        </Link>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Confirmar pedido</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1 text-sm">
          Ingresá tus datos para finalizar la compra.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 space-y-4">
            <h2 className="font-semibold text-stone-800 dark:text-stone-100">Tus datos</h2>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Nombre completo <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Ej: María González"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-200 dark:border-stone-700
                  bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100
                  placeholder-stone-400 dark:placeholder-stone-500
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Teléfono <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                placeholder="Ej: 11 4567-8901"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-200 dark:border-stone-700
                  bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100
                  placeholder-stone-400 dark:placeholder-stone-500
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Notas adicionales
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                placeholder="Instrucciones especiales, alergias, etc."
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-200 dark:border-stone-700
                  bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100
                  placeholder-stone-400 dark:placeholder-stone-500
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed
              text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                Confirmar pedido
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 space-y-4 sticky top-24">
          <h2 className="font-semibold text-stone-800 dark:text-stone-100">Resumen</h2>

          <div className="space-y-2 text-sm max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-stone-500 dark:text-stone-400">
                <span className="truncate max-w-[140px]">
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
        </div>
      </div>
    </div>
  )
}
