import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, AlertCircle, Loader2, MapPin, Plus, CreditCard, Banknote, Trash2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCartStore, cartTotalPrice, type CartItem } from '../../../store/useCartStore'
import { useAuthStore } from '../../../store/useAuthStore'
import { getAddresses, createAddress, deleteAddress, type DireccionEntrega } from '../services/addresses.service'
import { createOrder } from '../services/orders.service'

function formatPrice(price: number): string {
  return price.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })
}

interface AddressFormErrors {
  alias?: string
  linea1?: string
  linea2?: string
  ciudad?: string
  provincia?: string
  codigo_postal?: string
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const user = useAuthStore((s) => s.user)

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/carrito', { replace: true })
    }
  }, [items, navigate])

  // Query: get delivery addresses
  const { data: addresses = [], isLoading: isLoadingAddresses, refetch: refetchAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
    enabled: !!user,
  })

  // Selected state
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'EFECTIVO' | 'MERCADO_PAGO'>('EFECTIVO')
  const [notas, setNotas] = useState('')

  // Form state for new address
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [addressAlias, setAddressAlias] = useState('')
  const [addressCalle, setAddressCalle] = useState('')
  const [addressAltura, setAddressAltura] = useState('')
  const [addressPisoDepto, setAddressPisoDepto] = useState('')
  const [addressProvincia, setAddressProvincia] = useState('Buenos Aires')
  const [addressCp, setAddressCp] = useState('')
  const [addressErrors, setAddressErrors] = useState<AddressFormErrors>({})
  const [isSavingAddress, setIsSavingAddress] = useState(false)

  // Auto-select first address or es_principal
  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === null) {
      const principal = addresses.find((a) => a.es_principal)
      setSelectedAddressId(principal ? principal.id : addresses[0].id)
    }
  }, [addresses, selectedAddressId])

  // Total price
  const totalPrice = cartTotalPrice(items)

  // Mutation: create new address
  const saveAddressMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: (newAddr) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('Dirección guardada con éxito')
      setSelectedAddressId(newAddr.id)
      setShowNewAddressForm(false)
      // Reset form
      setAddressAlias('')
      setAddressCalle('')
      setAddressAltura('')
      setAddressPisoDepto('')
      setAddressCp('')
      setAddressErrors({})
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'Error al guardar la dirección'
      toast.error(msg)
    },
    onSettled: () => {
      setIsSavingAddress(false)
    },
  })

  // Mutation: delete address
  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.info('Dirección eliminada')
      setSelectedAddressId(null)
    },
    onError: () => {
      toast.error('Error al eliminar la dirección')
    },
  })

  // Mutation: create order
  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] })
      toast.success(`¡Pedido #${order.id} confirmado!`, { duration: 5000 })
      clearCart()
      navigate('/pedido-confirmado', {
        state: {
          orderId: order.id,
          nombre: user ? `${user.name} ${user.lastname}` : 'Cliente',
          telefono: user?.phone_number ? String(user.phone_number) : '',
          total: order.total,
          fecha: new Date().toISOString(),
          resumen: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        },
      })
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'No se pudo crear el pedido. Intente nuevamente.'
      toast.error(msg)
    },
  })

  // Validate address form
  function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault()
    const errs: AddressFormErrors = {}

    if (!addressCalle.trim()) {
      errs.ciudad = 'La calle es obligatoria'
    }

    if (!addressAltura.trim()) {
      errs.linea1 = 'La altura/número es obligatoria'
    }

    let pisoDeptoVal: string | null = null
    if (addressPisoDepto.trim()) {
      pisoDeptoVal = addressPisoDepto.trim()
    }

    if (!addressProvincia.trim()) {
      errs.provincia = 'La provincia es obligatoria'
    }

    if (!addressCp.trim()) {
      errs.codigo_postal = 'El código postal es obligatorio'
    }

    setAddressErrors(errs)

    if (Object.keys(errs).length > 0) {
      toast.error('Revisá los campos de la dirección')
      return
    }

    setIsSavingAddress(true)
    saveAddressMutation.mutate({
      alias: addressAlias.trim() || null,
      linea1: addressAltura.trim(),
      linea2: pisoDeptoVal,
      ciudad: addressCalle.trim(),
      provincia: addressProvincia.trim(),
      codigo_postal: addressCp.trim(),
      es_principal: addresses.length === 0, // Primera dirección es principal
    })
  }

  // Handle Order Submit
  function handlePlaceOrder() {
    if (selectedAddressId === null) {
      toast.error('Por favor, selecciona o agrega una dirección de entrega.')
      return
    }

    orderMutation.mutate({
      direccion_entrega_id: selectedAddressId,
      forma_pago_codigo: paymentMethod,
      notas: notas.trim() || undefined,
      items: items.map((item: CartItem) => ({
        producto_id: item.id,
        cantidad: item.quantity,
        nombre_snapshot: item.name,
        precio_snapshot: item.price,
        subtotal_snapshot: item.price * item.quantity,
      })),
    })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back link */}
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
          Completá los datos de envío y pago para realizar tu compra.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Main form section */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Section: Delivery Address */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                <MapPin size={18} className="text-indigo-500" />
                Dirección de entrega
              </h2>
              
              {!showNewAddressForm && (
                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
                >
                  <Plus size={14} />
                  Agregar dirección
                </button>
              )}
            </div>

            {/* Address listing */}
            {isLoadingAddresses ? (
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
                    onClick={() => setShowNewAddressForm(true)}
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
                      onClick={() => setSelectedAddressId(addr.id)}
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
                          onChange={() => setSelectedAddressId(addr.id)}
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
                            deleteAddressMutation.mutate(addr.id)
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
            ) : (
              /* New Address Form */
              <form onSubmit={handleSaveAddress} className="space-y-4 border border-stone-100 dark:border-stone-800 p-4 rounded-xl">
                <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200">Nueva dirección de envío</h3>
                
                {/* Alias */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-stone-500 dark:text-stone-400">
                    Nombre / Alias (ej: Casa, Trabajo)
                  </label>
                  <input
                    type="text"
                    value={addressAlias}
                    onChange={(e) => setAddressAlias(e.target.value)}
                    placeholder="Mi casa"
                    className="w-full px-3 py-2 rounded-xl text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Calle (ciudad) */}
                  <div className="col-span-2 space-y-1">
                    <label className="block text-xs font-medium text-stone-500 dark:text-stone-400">
                      Calle <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressCalle}
                      onChange={(e) => setAddressCalle(e.target.value)}
                      placeholder="Av. Corrientes"
                      className={`w-full px-3 py-2 rounded-xl text-sm border bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 ${
                        addressErrors.ciudad ? 'border-red-400 dark:border-red-500' : 'border-stone-200 dark:border-stone-700'
                      }`}
                    />
                    {addressErrors.ciudad && <p className="text-[10px] text-red-500">{addressErrors.ciudad}</p>}
                  </div>

                  {/* Altura (linea1) */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-500 dark:text-stone-400">
                      Altura <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressAltura}
                      onChange={(e) => setAddressAltura(e.target.value)}
                      placeholder="1234"
                      className={`w-full px-3 py-2 rounded-xl text-sm border bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 ${
                        addressErrors.linea1 ? 'border-red-400 dark:border-red-500' : 'border-stone-200 dark:border-stone-700'
                      }`}
                    />
                    {addressErrors.linea1 && <p className="text-[10px] text-red-500">{addressErrors.linea1}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Piso/Dpto (linea2) */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-500 dark:text-stone-400">
                      Piso/Depto <span className="text-stone-400 font-normal">(Nro)</span>
                    </label>
                    <input
                      type="text"
                      value={addressPisoDepto}
                      onChange={(e) => setAddressPisoDepto(e.target.value)}
                      placeholder="4"
                      className={`w-full px-3 py-2 rounded-xl text-sm border bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 ${
                        addressErrors.linea2 ? 'border-red-400 dark:border-red-500' : 'border-stone-200 dark:border-stone-700'
                      }`}
                    />
                    {addressErrors.linea2 && <p className="text-[10px] text-red-500">{addressErrors.linea2}</p>}
                  </div>

                  {/* CP */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-500 dark:text-stone-400">
                      Cód. Postal <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressCp}
                      onChange={(e) => setAddressCp(e.target.value)}
                      placeholder="1425"
                      className={`w-full px-3 py-2 rounded-xl text-sm border bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 ${
                        addressErrors.codigo_postal ? 'border-red-400 dark:border-red-500' : 'border-stone-200 dark:border-stone-700'
                      }`}
                    />
                    {addressErrors.codigo_postal && <p className="text-[10px] text-red-500">{addressErrors.codigo_postal}</p>}
                  </div>

                  {/* Provincia */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-500 dark:text-stone-400">
                      Provincia <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressProvincia}
                      onChange={(e) => setAddressProvincia(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-sm border bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 ${
                        addressErrors.provincia ? 'border-red-400 dark:border-red-500' : 'border-stone-200 dark:border-stone-700'
                      }`}
                    />
                    {addressErrors.provincia && <p className="text-[10px] text-red-500">{addressErrors.provincia}</p>}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center gap-3 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewAddressForm(false)
                      setAddressErrors({})
                    }}
                    className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-semibold transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingAddress}
                    className="inline-flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold transition disabled:opacity-60"
                  >
                    {isSavingAddress ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar Dirección'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Section: Payment Method */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 space-y-4">
            <h2 className="font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2">
              <CreditCard size={18} className="text-indigo-500" />
              Método de pago
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Cash option */}
              <div
                onClick={() => setPaymentMethod('EFECTIVO')}
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
                onClick={() => setPaymentMethod('MERCADO_PAGO')}
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

          {/* Section: Additional Notes */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 space-y-3">
            <label className="block font-semibold text-stone-800 dark:text-stone-100">
              Notas adicionales <span className="text-xs text-stone-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              maxLength={250}
              placeholder="Instrucciones especiales para la entrega, alergias alimentarias, etc."
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <div className="text-right text-xs text-stone-400">
              {notas.length}/250
            </div>
          </div>

        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 space-y-4 sticky top-24">
          <h2 className="font-semibold text-stone-800 dark:text-stone-100">Resumen del pedido</h2>

          {/* List items */}
          <div className="space-y-2.5 text-sm max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-stone-600 dark:text-stone-400">
                <span className="truncate max-w-[150px]">
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Pricing list */}
          <div className="border-t border-stone-100 dark:border-stone-800 pt-3 space-y-2">
            <div className="flex justify-between text-sm text-stone-500">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-500">
              <span>Costo de envío</span>
              <span className="text-green-500 font-medium">Gratis</span>
            </div>
            <div className="border-t border-stone-100 dark:border-stone-800 pt-2 flex justify-between font-bold text-stone-900 dark:text-stone-100">
              <span>Total</span>
              <span className="text-indigo-500 dark:text-indigo-400 text-lg">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handlePlaceOrder}
            disabled={orderMutation.isPending || selectedAddressId === null}
            className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-stone-200 dark:disabled:bg-stone-800 disabled:text-stone-400 text-white font-semibold py-3.5 rounded-xl transition disabled:cursor-not-allowed"
          >
            {orderMutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Procesando pedido...
              </>
            ) : (
              <>
                Confirmar Pedido
                <ArrowRight size={16} />
              </>
            )}
          </button>
          
          {selectedAddressId === null && (
            <p className="text-[10px] text-center text-amber-500 font-medium flex items-center justify-center gap-1">
              <AlertCircle size={10} />
              Cargá una dirección de entrega para confirmar.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
