const COSTO_ENVIO = 50

interface CartSummaryProps {
  subtotal: number
  onConfirm: () => void
  loading: boolean
}

export default function CartSummary({ subtotal, onConfirm, loading }: CartSummaryProps) {
  const total = subtotal + COSTO_ENVIO

  const fmt = (v: number) =>
    v.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 sticky top-24">
      <h2 className="text-lg font-bold text-slate-800">Resumen del pedido</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span>{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Costo de envío</span>
          <span>{fmt(COSTO_ENVIO)}</span>
        </div>
        <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-slate-900 text-base">
          <span>Total</span>
          <span>{fmt(total)}</span>
        </div>
      </div>

      <button
        onClick={onConfirm}
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Procesando...
          </>
        ) : (
          '✓ Confirmar Pedido'
        )}
      </button>

      <p className="text-xs text-slate-400 text-center">
        Al confirmar, se enviará tu pedido al restaurante.
      </p>
    </div>
  )
}
