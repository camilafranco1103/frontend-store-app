import { CreditCard, Banknote } from 'lucide-react'

interface PaymentMethodSelectionProps {
  paymentMethod: 'EFECTIVO' | 'MERCADO_PAGO'
  onChange: (method: 'EFECTIVO' | 'MERCADO_PAGO') => void
}

export default function PaymentMethodSelection({ paymentMethod, onChange }: PaymentMethodSelectionProps) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 space-y-4">
      <h2 className="font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2">
        <CreditCard size={18} className="text-indigo-500" />
        Método de pago
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cash option */}
        <div
          onClick={() => onChange('EFECTIVO')}
          className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition ${
            paymentMethod === 'EFECTIVO'
              ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-500/5'
              : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40'
          }`}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/20 text-green-600">
            <Banknote size={20} />
          </div>
          <div>
            <div className="font-semibold text-sm text-stone-800 dark:text-stone-200">Efectivo</div>
            <div className="text-xs text-stone-400 dark:text-stone-500">Pagá al recibir tu entrega</div>
          </div>
        </div>

        {/* Mercado Pago option */}
        <div
          onClick={() => onChange('MERCADO_PAGO')}
          className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition ${
            paymentMethod === 'MERCADO_PAGO'
              ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-500/5'
              : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40'
          }`}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500">
            <CreditCard size={20} />
          </div>
          <div>
            <div className="font-semibold text-sm text-stone-800 dark:text-stone-200">Mercado Pago</div>
            <div className="text-xs text-stone-400 dark:text-stone-500">Tarjetas de crédito, débito o dinero en cuenta</div>
          </div>
        </div>
      </div>
    </div>
  )
}
