import { useEffect } from 'react'
import { useLocation, Link, useSearchParams, Navigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getOrderById } from '../services/orders.service'
import { useOrderStatusWS } from '../../../shared/hooks/useOrderStatusWS'
import { CheckCircle, ShoppingBag, Phone, User, Clock, ChefHat, Package } from 'lucide-react'
import { toast } from 'sonner'

interface OrderState {
  orderId?: number
  nombre?: string
  telefono?: string
  total?: number
  fecha?: string
  resumen?: { name: string; quantity: number; price: number }[]
}

function formatPrice(price: number): string {
  return price.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })
}

function formatDate(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const ORDER_STEPS = ['PENDIENTE', 'CONFIRMADO', 'EN_PREP', 'LISTO', 'ENTREGADO']

export default function OrderConfirmedPage() {
  const location = useLocation()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const urlOrderId = searchParams.get('order_id')

  // Estado del react router (solo disponible si paga en efectivo)
  const stateData = (location.state ?? {}) as OrderState

  // Si no hay stateData pero hay urlOrderId, buscamos el pedido al backend (flujo Mercado Pago)
  const orderId = stateData.orderId || (urlOrderId ? parseInt(urlOrderId, 10) : undefined)

  const { data: fetchedOrder, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: !!orderId,
  })

  // Mezclamos la info: damos prioridad al state, si no, usamos el fetched
  const nombre = stateData.nombre || 'Cliente'
  const telefono = stateData.telefono || ''
  const total = stateData.total ?? fetchedOrder?.total
  const fecha = stateData.fecha || fetchedOrder?.created_at
  const resumen = stateData.resumen || (fetchedOrder?.detalles_pedido?.map(d => ({
    name: d.nombre_snapshot,
    quantity: d.cantidad,
    price: d.precio_snapshot
  })))

  // Conexión WebSocket para tiempo real
  const { lastMessage, isConnected, sendMessage } = useOrderStatusWS(`ws://${window.location.host}/pedidos/ws`)

  useEffect(() => {
    if (isConnected && orderId) {
      sendMessage('subscribe-order', { order_id: orderId })
    }
  }, [isConnected, orderId, sendMessage])

  useEffect(() => {
    if (lastMessage && orderId) {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
    }
  }, [lastMessage, orderId, queryClient])

  useEffect(() => {
    if (orderId && (stateData.resumen || fetchedOrder)) {
      toast.success(`Pedido #${orderId} confirmado con éxito`, { duration: 5000, id: 'order-success' })
    }
  }, [orderId, stateData.resumen, fetchedOrder])

  // Redireccionar si no hay orderId, o si hay un error, o si el pedido fue cancelado
  if (!orderId || isError || fetchedOrder?.estado_codigo === 'CANCELADO') {
    return <Navigate to="/mis-pedidos" replace />
  }

  const firstName = nombre?.split(' ')[0]

  if (isLoading && !stateData.resumen && !fetchedOrder) {
    return (
      <div className="max-w-lg mx-auto py-20 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <p className="text-stone-500 dark:text-stone-400">Cargando detalles de tu compra...</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto py-10 space-y-6">
      {/* Hero */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-950/40">
          <CheckCircle size={52} className="text-indigo-500 dark:text-indigo-400" strokeWidth={1.5} />
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 dark:bg-green-500 rounded-full border-2 border-white dark:border-stone-950" />
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            {firstName ? `¡Gracias, ${firstName}!` : '¡Pedido confirmado!'}
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">
            Tu pedido fue recibido y está siendo procesado.
          </p>
        </div>

        {orderId != null && (
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 rounded-full">
            <span className="text-sm text-indigo-500 dark:text-indigo-400 font-medium">Pedido</span>
            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">#{orderId}</span>
          </div>
        )}
      </div>

      {/* Status timeline */}
      <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-4">
          Estado del pedido
        </h2>
        
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-[calc(16.67%)] right-[calc(16.67%)] h-0.5 bg-stone-200 dark:bg-stone-700" />
          
          {[
            { code: 'CONFIRMADO', label: 'Recibido', icon: CheckCircle },
            { code: 'EN_PREP', label: 'En preparación', icon: ChefHat },
            { code: 'LISTO', label: 'Listo', icon: Package }
          ].map((step, i) => {
            const Icon = step.icon
            // Determinamos si el paso actual está completado basado en el fetchedOrder.estado_codigo
            const currentStatusCode = fetchedOrder?.estado_codigo || 'PENDIENTE'
            const currentIdx = ORDER_STEPS.indexOf(currentStatusCode)
            const stepIdx = ORDER_STEPS.indexOf(step.code)
            
            // Si el índice del estado actual es mayor o igual al de este paso, está completado
            // Y si es PENDIENTE (índice 0), todos están en gris.
            const isDone = currentIdx >= stepIdx

            return (
              <div key={i} className="flex flex-col items-center gap-2 z-10 flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                    isDone
                      ? 'bg-indigo-500 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-400'
                  }`}
                >
                  <Icon size={15} strokeWidth={2} />
                </div>
                <span
                  className={`text-xs font-medium text-center ${
                    isDone
                      ? 'text-indigo-500 dark:text-indigo-400'
                      : 'text-stone-400 dark:text-stone-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Order details */}
      <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          Detalle del pedido
        </h2>

        {resumen && resumen.length > 0 && (
          <div className="space-y-2">
            {resumen.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-stone-600 dark:text-stone-300">
                  {item.name}
                  <span className="text-stone-400 dark:text-stone-500 ml-1">× {item.quantity}</span>
                </span>
                <span className="font-medium text-stone-800 dark:text-stone-100">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="border-t border-stone-100 dark:border-stone-800 pt-2 flex justify-between font-bold">
              <span className="text-stone-700 dark:text-stone-200">Total</span>
              <span className="text-indigo-500 dark:text-indigo-400">
                {total != null ? formatPrice(total) : '—'}
              </span>
            </div>
          </div>
        )}

        {!resumen && total != null && (
          <div className="flex justify-between font-bold text-sm">
            <span className="text-stone-700 dark:text-stone-200">Total</span>
            <span className="text-indigo-500 dark:text-indigo-400">{formatPrice(total)}</span>
          </div>
        )}
      </div>

      {/* Contact info */}
      {(nombre || telefono || fecha) && (
        <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Datos de contacto
          </h2>
          <div className="space-y-2.5 text-sm">
            {nombre && (
              <div className="flex items-center gap-2.5 text-stone-600 dark:text-stone-300">
                <User size={14} className="text-stone-400 dark:text-stone-500 shrink-0" />
                {nombre}
              </div>
            )}
            {telefono && (
              <div className="flex items-center gap-2.5 text-stone-600 dark:text-stone-300">
                <Phone size={14} className="text-stone-400 dark:text-stone-500 shrink-0" />
                {telefono}
              </div>
            )}
            {fecha && (
              <div className="flex items-center gap-2.5 text-stone-600 dark:text-stone-300">
                <Clock size={14} className="text-stone-400 dark:text-stone-500 shrink-0" />
                {formatDate(fecha)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          to="/mis-pedidos"
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          <Package size={16} />
          Ver mis pedidos
        </Link>
        <Link
          to="/"
          className="flex-1 flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold py-3 rounded-xl transition-colors border border-transparent dark:border-stone-700"
        >
          <ShoppingBag size={16} />
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
