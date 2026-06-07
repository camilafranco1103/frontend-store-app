import { Loader2, Plus, Trash2, MapPin } from 'lucide-react'
import type { DireccionEntrega } from '../../services/addresses.service'

interface AddressSelectionProps {
  addresses: DireccionEntrega[]
  isLoading: boolean
  selectedAddressId: number | null
  showNewAddressForm: boolean
  onSelectAddress: (id: number) => void
  onDeleteAddress: (id: number) => void
  onShowForm: () => void
}

export default function AddressSelection({
  addresses,
  isLoading,
  selectedAddressId,
  showNewAddressForm,
  onSelectAddress,
  onDeleteAddress,
  onShowForm,
}: AddressSelectionProps) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2">
          <MapPin size={18} className="text-indigo-500" />
          Dirección de entrega
        </h2>

        {!showNewAddressForm && (
          <button
            onClick={onShowForm}
            className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
          >
            <Plus size={14} />
            Agregar dirección
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex py-6 justify-center">
          <Loader2 className="animate-spin text-stone-400" size={20} />
        </div>
      ) : !showNewAddressForm ? (
        addresses.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl space-y-2">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              No tenés direcciones de entrega registradas.
            </p>
            <button
              onClick={onShowForm}
              className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-500 px-4 py-2 rounded-xl text-xs font-semibold transition"
            >
              <Plus size={14} />
              Crear primera dirección
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => onSelectAddress(addr.id)}
                className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition ${
                  selectedAddressId === addr.id
                    ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-500/5'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="selected_address"
                    checked={selectedAddressId === addr.id}
                    onChange={() => onSelectAddress(addr.id)}
                    className="mt-1 accent-indigo-500"
                  />
                  <div className="text-sm">
                    <div className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      {addr.alias || 'Dirección'}
                      {addr.es_principal && (
                        <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-500 px-1.5 py-0.5 rounded font-normal">
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 mt-0.5">
                      {addr.ciudad} {addr.linea1}
                      {addr.linea2 ? `, Piso/Depto ${addr.linea2}` : ''}
                    </p>
                    <p className="text-stone-400 dark:text-stone-500 text-xs mt-0.5">
                      {addr.provincia} • CP {addr.codigo_postal}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm('¿Eliminar esta dirección?')) {
                      onDeleteAddress(addr.id)
                    }
                  }}
                  className="text-stone-300 dark:text-stone-600 hover:text-red-500 dark:hover:text-red-400 transition"
                  aria-label="Eliminar dirección"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )
      ) : null}
    </div>
  )
}
