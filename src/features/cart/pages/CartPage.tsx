import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../../../store/useCartStore'
import CartItem from '../components/CartItem'
import CartSummary from '../components/CartSummary'
import EmptyState from '../../../shared/components/EmptyState'
import { createOrder, createOrderDetail } from '../services/orders.service'

const USUARIO_ID = 2
const COSTO_ENVIO = 50

export default function CartPage() {
  const { items, total, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleConfirm() {
    if (items.length === 0) return
    setLoading(true)
    setError('')
    try {
      const subtotal = total
      const totalConEnvio = subtotal + COSTO_ENVIO

      const pedido = await createOrder({
        usuario_id: USUARIO_ID,
        subtotal,
        costo_envio: COSTO_ENVIO,
        total: totalConEnvio,
        estado_codigo: 'PENDIENTE',
        forma_pago_codigo: 'EFECTIVO',
      })

      await Promise.all(
        items.map((item) =>
          createOrderDetail({
            pedido_id: pedido.id,
            producto_id: item.id,
            cantidad: item.quantity,
            nombre_snapshot: item.name,
            precio_snapshot: item.price,
            subtotal_snapshot: item.price * item.quantity,
          })
        )
      )

      clearCart()
      setSuccess(true)
    } catch {
      setError('Hubo un error al confirmar el pedido. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
        <span className="text-7xl">🎉</span>
        <h2 className="text-2xl font-bold text-slate-900">¡Pedido confirmado!</h2>
        <p className="text-slate-500 max-w-sm">
          Tu pedido fue enviado al restaurante. Pronto estará listo.
        </p>
        <Link
          to="/"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Tu carrito está vacío"
        description="Explorá nuestros productos y agregá los que más te gusten."
        actionLabel="Ver productos"
        actionTo="/"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mi Carrito</h1>
        <p className="text-slate-500 mt-1">{items.length} {items.length === 1 ? 'producto' : 'productos'} seleccionados</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lista de ítems */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Resumen */}
        <div>
          <CartSummary subtotal={total} onConfirm={handleConfirm} loading={loading} />
        </div>
      </div>
    </div>
  )
}
