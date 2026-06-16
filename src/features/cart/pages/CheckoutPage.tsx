import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCartStore, cartTotalPrice, type CartItem } from '../../../store/useCartStore'
import { useAuthStore } from '../../../store/useAuthStore'
import { getAddresses, createAddress, deleteAddress } from '../services/addresses.service'
import { createOrder, createPaymentPreference } from '../services/orders.service'

import AddressSelection from '../components/checkout/AddressSelection'
import AddressForm from '../components/checkout/AddressForm'
import PaymentMethodSelection from '../components/checkout/PaymentMethodSelection'
import CheckoutNotes from '../components/checkout/CheckoutNotes'
import OrderSummarySidebar from '../components/checkout/OrderSummarySidebar'

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
  const { data: addresses = [], isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
    enabled: !!user,
  })

  // Selected state
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'EFECTIVO' | 'MERCADO_PAGO'>('EFECTIVO')
  const [notas, setNotas] = useState('')
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Auto-select first address or es_principal
  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === null) {
      const principal = addresses.find((a) => a.es_principal)
      setSelectedAddressId(principal ? principal.id : addresses[0].id)
    }
  }, [addresses, selectedAddressId])

  const totalPrice = cartTotalPrice(items)

  // Mutation: create new address
  const saveAddressMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: (newAddr) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('Dirección guardada con éxito')
      setSelectedAddressId(newAddr.id)
      setShowNewAddressForm(false)
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'Error al guardar la dirección'
      toast.error(msg)
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
    onSuccess: async (order) => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] })

      if (order.forma_pago_codigo === 'MERCADO_PAGO') {
        setIsRedirecting(true)
        toast.loading('Generando pago seguro en Mercado Pago...', { id: 'mp-loading' })
        
        try {
          const { checkout_url } = await createPaymentPreference(order.id)
          if (checkout_url) {
            clearCart()
            toast.dismiss('mp-loading')
            window.location.href = checkout_url
            return
          } else {
            toast.dismiss('mp-loading')
            toast.error('No se pudo obtener el link de pago.')
            setIsRedirecting(false)
            return
          }
        } catch (error) {
          console.error(error)
          toast.dismiss('mp-loading')
          toast.error('Ocurrió un error al conectar con Mercado Pago.')
          setIsRedirecting(false)
          return
        }
      }

      toast.success(`¡Pedido #${order.id} confirmado!`, { duration: 5000 })
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
      
      // Limpiamos el carrito un instante después para asegurar que el router ya navegó
      setTimeout(() => {
        clearCart()
      }, 100)
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'No se pudo crear el pedido. Intente nuevamente.'
      toast.error(msg)
    },
  })

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
          
          <div>
            <AddressSelection
              addresses={addresses}
              isLoading={isLoadingAddresses}
              selectedAddressId={selectedAddressId}
              showNewAddressForm={showNewAddressForm}
              onSelectAddress={setSelectedAddressId}
              onDeleteAddress={(id) => deleteAddressMutation.mutate(id)}
              onShowForm={() => setShowNewAddressForm(true)}
            />

            {showNewAddressForm && (
              <AddressForm
                isSaving={saveAddressMutation.isPending}
                isFirstAddress={addresses.length === 0}
                onSave={(data) => saveAddressMutation.mutate(data)}
                onCancel={() => setShowNewAddressForm(false)}
              />
            )}
          </div>

          <PaymentMethodSelection
            paymentMethod={paymentMethod}
            onChange={setPaymentMethod}
          />

          <CheckoutNotes notas={notas} onChange={setNotas} />
        </div>

        <OrderSummarySidebar
          items={items}
          totalPrice={totalPrice}
          isPending={orderMutation.isPending}
          isRedirecting={isRedirecting}
          selectedAddressId={selectedAddressId}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>
    </div>
  )
}
