import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ClipboardList, ChevronRight, Clock, CheckCircle2, ChefHat, Package, XCircle, Truck } from 'lucide-react'
import { getMyOrders, type PedidoResponse } from '../services/orders.service'
import Spinner from '../../../shared/components/Spinner'

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
  EN_PREPARACION: {
    label: 'En Preparación',
    icon: ChefHat,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    border: 'border-orange-200 dark:border-orange-800',
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

function OrderCard({ order }: { order: PedidoResponse }) {
  const estado = ESTADO_CONFIG[order.estado_codigo] ?? ESTADO_CONFIG['PENDIENTE']
  const Icon = estado.icon

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl p-5 space-y-4 hover:shadow-lg dark:hover:shadow-stone-950/60 transition-shadow duration-200">
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

      {/* Items list */}
      {order.detalles_pedido && order.detalles_pedido.length > 0 && (
        <div className="space-y-1.5 pt-1 border-t border-stone-100 dark:border-stone-800">
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
      <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800">
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
  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['my-orders'],
    queryFn: getMyOrders,
  })

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
              <OrderCard key={order.id} order={order} />
            ))}
        </div>
      )}
    </div>
  )
}
