import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ClipboardList, ChevronRight, Clock, CheckCircle2, ChefHat, Package, XCircle, Truck, Check } from 'lucide-react'
import { getMyOrders, type PedidoResponse } from '../services/orders.service'
import Spinner from '../../../shared/components/Spinner'
import { useWebSocket } from '../../../shared/hooks/useWebSocket'
import { useEffect, useState } from 'react'
import Modal from '../../../shared/components/Modal'

function formatPrice(price: number): string {
  return price.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface EstadoConfig {
  label: string
  icon: React.ElementType
  color: string
  bg: string
  border: string
}

const ESTADO_CONFIG: Record<string, EstadoConfig> = {
  PENDIENTE: {
    label: 'Pendiente',
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-800',
  },
  CONFIRMADO: {
    label: 'Confirmado',
    icon: CheckCircle2,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800',
  },
  EN_PREP: {
    label: 'En Preparación',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-500/10',
    border: 'border-orange-200 dark:border-orange-500/20',
    icon: ChefHat,
  },
  LISTO: {
    label: 'Listo',
    icon: Package,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
  ENTREGADO: {
    label: 'Entregado',
    icon: Truck,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-800',
  },
  CANCELADO: {
    label: 'Cancelado',
    icon: XCircle,
    color: 'text-red-500 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-red-200 dark:border-red-800',
  },
}

const FORMA_PAGO_LABELS: Record<string, string> = {
  EFECTIVO: 'Efectivo',
  MERCADO_PAGO: 'Mercado Pago',
  TARJETA: 'Tarjeta',
  TRANSFERENCIA: 'Transferencia',
}

function OrderCard({ order, onClick }: { order: PedidoResponse, onClick: (order: PedidoResponse) => void }) {
  const estado = ESTADO_CONFIG[order.estado_codigo] ?? ESTADO_CONFIG['PENDIENTE']
  const Icon = estado.icon

  const isCancelled = order.estado_codigo === 'CANCELADO'
  const isDelivered = order.estado_codigo === 'ENTREGADO'
  const isFinished = isCancelled || isDelivered

  // Array of linear steps
  const orderSteps = ['PENDIENTE', 'CONFIRMADO', 'EN_PREP', 'LISTO', 'ENTREGADO']
  const currentStepIndex = orderSteps.indexOf(order.estado_codigo)

  return (
    <div 
      onClick={() => onClick(order)}
      className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-lg dark:hover:shadow-stone-950/60 transition-shadow duration-200 cursor-pointer"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-stone-800 dark:text-stone-100">
              Pedido #{order.id}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${estado.bg} ${estado.color} ${estado.border}`}
            >
              <Icon size={10} />
              {estado.label}
            </span>
          </div>
          <p className="text-xs text-stone-400 dark:text-stone-500">
            {formatDate(order.created_at)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-stone-400 dark:text-stone-500">Total</p>
          <p className="text-base font-bold text-indigo-500 dark:text-indigo-400">
            {formatPrice(order.total)}
          </p>
        </div>
      </div>

      {/* Stepper visual para pedidos activos */}
      {!isFinished && currentStepIndex !== -1 && (
        <div className="py-4">
          <div className="relative flex justify-between items-center w-full max-w-md mx-auto">
            {/* Background line */}
            <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-1 bg-stone-100 dark:bg-stone-800 rounded-full z-0" />
            
            {/* Progress line */}
            <div 
              className="absolute left-[10%] top-1/2 -translate-y-1/2 h-1 bg-indigo-500 rounded-full z-0 transition-all duration-500" 
              style={{ width: `${(currentStepIndex / (orderSteps.length - 1)) * 80}%` }}
            />

            {orderSteps.map((stepCode, idx) => {
              const stepConfig = ESTADO_CONFIG[stepCode]
              const StepIcon = stepConfig.icon
              const isCompleted = idx < currentStepIndex
              const isCurrent = idx === currentStepIndex
              
              return (
                <div key={stepCode} className="relative z-10 flex flex-col items-center gap-2">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2
                      ${isCompleted ? 'bg-indigo-500 border-indigo-500 text-white' : 
                        isCurrent ? 'bg-white dark:bg-stone-900 border-indigo-500 text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 
                        'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-400 dark:text-stone-500'}`}
                  >
                    {isCompleted ? <Check size={14} strokeWidth={3} /> : <StepIcon size={14} />}
                  </div>
                  <span className={`text-[10px] font-semibold text-center w-16 leading-tight hidden sm:block
                    ${isCompleted || isCurrent ? 'text-stone-700 dark:text-stone-300' : 'text-stone-400 dark:text-stone-600'}`}>
                    {stepConfig.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Items list */}
      {order.detalles_pedido && order.detalles_pedido.length > 0 && (
        <div className="space-y-1.5 pt-1 border-t border-stone-100 dark:border-stone-800 mt-4">
          {order.detalles_pedido.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex justify-between text-xs text-stone-600 dark:text-stone-400">
              <span>
                {item.nombre_snapshot}
                <span className="text-stone-400 ml-1">× {item.cantidad}</span>
              </span>
              <span className="font-medium">{formatPrice(item.subtotal_snapshot)}</span>
            </div>
          ))}
          {order.detalles_pedido.length > 3 && (
            <p className="text-xs text-stone-400 dark:text-stone-500 italic">
              + {order.detalles_pedido.length - 3} producto{order.detalles_pedido.length - 3 > 1 ? 's' : ''} más
            </p>
          )}
        </div>
      )}

      {/* Footer: payment method */}
      <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
        <span className="text-xs text-stone-400 dark:text-stone-500">
          Pago: <span className="font-medium text-stone-600 dark:text-stone-400">
            {FORMA_PAGO_LABELS[order.forma_pago_codigo] ?? order.forma_pago_codigo}
          </span>
        </span>
      </div>
    </div>
  )
}

export default function MisPedidosPage() {
  const queryClient = useQueryClient()
  const [selectedOrder, setSelectedOrder] = useState<PedidoResponse | null>(null)
  
  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['my-orders'],
    queryFn: getMyOrders,
  })

  // Conexión a WebSockets para actualizaciones en tiempo real
  const { lastMessage, isConnected, sendMessage } = useWebSocket(`ws://${window.location.host}/pedidos/ws`)

  useEffect(() => {
    if (isConnected && orders) {
      orders.forEach((order) => {
        const isFinished = order.estado_codigo === 'ENTREGADO' || order.estado_codigo === 'CANCELADO'
        if (!isFinished) {
          sendMessage('subscribe-order', { order_id: order.id })
        }
      })
    }
  }, [isConnected, orders, sendMessage])

  useEffect(() => {
    if (lastMessage) {
      // Invalida la consulta de "my-orders" cuando el backend anuncia un cambio
      queryClient.invalidateQueries({ queryKey: ['my-orders'] })
    }
  }, [lastMessage, queryClient])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500">
          <ClipboardList size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Mis Pedidos</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Seguí el estado de tus pedidos realizados
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {isError && (
        <div className="text-center py-16 text-stone-500 dark:text-stone-400 space-y-2">
          <p className="text-sm">No se pudieron cargar tus pedidos.</p>
          <p className="text-xs text-stone-400">{(error as any)?.message}</p>
        </div>
      )}

      {!isLoading && !isError && orders && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-stone-100 dark:bg-stone-800">
            <ClipboardList size={36} className="text-stone-400 dark:text-stone-500" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Sin pedidos aún</h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm max-w-xs">
              Todavía no realizaste ningún pedido. ¡Explorá el catálogo y hacé tu primera compra!
            </p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors text-sm"
          >
            Ver productos
            <ChevronRight size={15} />
          </Link>
        </div>
      )}

      {!isLoading && !isError && orders && orders.length > 0 && (
        <div className="space-y-4">
          {/* Pedidos activos primero */}
          {orders
            .slice()
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((order) => (
              <OrderCard key={order.id} order={order} onClick={setSelectedOrder} />
            ))}
        </div>
      )}

      {/* Detalle del Pedido (Modal) */}
      <Modal 
        isOpen={selectedOrder !== null} 
        onClose={() => setSelectedOrder(null)} 
        title={`Detalle de Pedido #${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-stone-50 dark:bg-stone-800 p-4 rounded-xl border border-stone-100 dark:border-stone-700">
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase font-semibold">Estado</p>
                <p className={`text-sm font-bold mt-1 ${ESTADO_CONFIG[selectedOrder.estado_codigo]?.color || 'text-stone-600'}`}>
                  {ESTADO_CONFIG[selectedOrder.estado_codigo]?.label || selectedOrder.estado_codigo}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase font-semibold">Fecha</p>
                <p className="text-sm font-medium text-stone-800 dark:text-stone-200 mt-1">
                  {formatDate(selectedOrder.created_at)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-stone-800 dark:text-stone-100 mb-3">Productos</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {selectedOrder.detalles_pedido?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-3">
                      <span className="text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md text-xs">
                        {item.cantidad}x
                      </span>
                      <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                        {item.nombre_snapshot}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-stone-700 dark:text-stone-300">
                      {formatPrice(item.subtotal_snapshot)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-100 dark:border-stone-800 pt-4 flex justify-between items-center">
              <span className="font-semibold text-stone-600 dark:text-stone-400">Total</span>
              <span className="text-xl font-bold text-indigo-500">{formatPrice(selectedOrder.total)}</span>
            </div>
            
            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold py-2.5 rounded-xl transition-colors mt-2"
            >
              Cerrar
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
