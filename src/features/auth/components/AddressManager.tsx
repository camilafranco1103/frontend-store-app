import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MapPin, Plus, Edit2, Trash2, Home, Building2, Map } from 'lucide-react'
import { toast } from 'sonner'
import { 
  getAddresses, 
  deleteAddress, 
  createAddress, 
  updateAddress,
  type DireccionEntrega,
  type DireccionEntregaCreate 
} from '../../cart/services/addresses.service'
import AddressForm from '../../cart/components/checkout/AddressForm'
import Spinner from '../../../shared/components/Spinner'
import Modal from '../../../shared/components/Modal'

export default function AddressManager() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<DireccionEntrega | undefined>(undefined)
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null)

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('Dirección eliminada correctamente')
      setAddressToDelete(null)
    },
    onError: () => {
      toast.error('Error al eliminar la dirección')
    }
  })

  const saveMutation = useMutation({
    mutationFn: async (data: DireccionEntregaCreate) => {
      if (editingAddress) {
        return updateAddress(editingAddress.id, data)
      }
      return createAddress(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success(editingAddress ? 'Dirección actualizada' : 'Dirección creada con éxito')
      handleCloseForm()
    },
    onError: (error: any) => {
      const msg = error.response?.data?.detail || 'Error al guardar la dirección'
      toast.error(msg)
    }
  })

  function handleAdd() {
    if (addresses.length >= 3) {
      toast.error('Has alcanzado el límite máximo de 3 direcciones')
      return
    }
    setEditingAddress(undefined)
    setShowForm(true)
  }

  function handleEdit(address: DireccionEntrega) {
    setEditingAddress(address)
    setShowForm(true)
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditingAddress(undefined)
  }

  function getIcon(alias: string | null) {
    const l = alias?.toLowerCase() || ''
    if (l.includes('casa') || l.includes('hogar')) return <Home size={18} />
    if (l.includes('trabajo') || l.includes('oficina')) return <Building2 size={18} />
    return <Map size={18} />
  }

  if (isLoading) {
    return (
      <div className="py-10 flex justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <MapPin className="text-indigo-500" />
            Mis Direcciones
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Gestioná tus direcciones de entrega (máximo 3)
          </p>
        </div>
        {!showForm && addresses.length < 3 && (
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-4 py-2.5 sm:py-2 rounded-xl text-sm font-semibold transition"
          >
            <Plus size={16} />
            <span>Nueva Dirección</span>
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white dark:bg-stone-900/50 p-2 sm:p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
          <AddressForm
            initialData={editingAddress}
            isSaving={saveMutation.isPending}
            isFirstAddress={addresses.length === 0}
            onSave={(data) => saveMutation.mutate(data)}
            onCancel={handleCloseForm}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((addr) => (
            <div 
              key={addr.id} 
              className="relative group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700/50 hover:shadow-md transition-all flex flex-col h-full"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg w-fit max-w-[70%]">
                  <div className="shrink-0">{getIcon(addr.alias)}</div>
                  <span className="font-semibold text-sm truncate">
                    {addr.alias || 'Dirección'}
                  </span>
                </div>
                {addr.es_principal && (
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2.5 py-1 rounded-md">
                    Principal
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-1 mb-2 text-sm">
                <p className="text-stone-800 dark:text-stone-200 font-medium line-clamp-1">
                  {addr.ciudad} {addr.linea1}
                </p>
                {addr.linea2 && (
                  <p className="text-stone-500 dark:text-stone-400">
                    Depto/Piso: {addr.linea2}
                  </p>
                )}
                <p className="text-stone-500 dark:text-stone-400">
                  {addr.provincia} (CP: {addr.codigo_postal})
                </p>
              </div>

              {/* Botones de acción, fluyen al final */}
              <div className="mt-auto pt-4 flex justify-end gap-2 border-t border-stone-100 dark:border-stone-800/50 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(addr)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 px-3 py-2 sm:p-2 rounded-lg transition-colors"
                  title="Editar dirección"
                >
                  <Edit2 size={16} />
                  <span className="sm:hidden text-xs font-semibold">Editar</span>
                </button>
                <button
                  onClick={() => setAddressToDelete(addr.id)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 px-3 py-2 sm:p-2 rounded-lg transition-colors"
                  title="Eliminar dirección"
                >
                  <Trash2 size={16} />
                  <span className="sm:hidden text-xs font-semibold">Eliminar</span>
                </button>
              </div>
            </div>
          ))}

          {addresses.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl text-stone-500">
              <MapPin className="mb-2 opacity-50" size={32} />
              <p className="text-sm">No tenés direcciones guardadas</p>
              <button
                onClick={handleAdd}
                className="mt-4 text-sm font-semibold text-indigo-500 hover:text-indigo-600"
              >
                Agregar mi primera dirección
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={addressToDelete !== null}
        onClose={() => setAddressToDelete(null)}
        title="Eliminar Dirección"
      >
        <div className="p-6">
          <p className="text-stone-600 dark:text-stone-300 mb-6">
            ¿Estás seguro de que querés eliminar esta dirección? No podrás usarla para nuevos pedidos.
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setAddressToDelete(null)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </button>
            <button
              onClick={() => addressToDelete && deleteMutation.mutate(addressToDelete)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition flex items-center gap-2"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Sí, eliminar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
