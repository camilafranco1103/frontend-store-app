import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCartStore, cartTotalPrice, type CartItem } from '../../../store/useCartStore'
import { createGuestOrder } from '../services/orders.service'

function formatPrice(price: number): string {
  return price.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })
}

interface FormErrors {
  nombre?: string
  telefono?: string
  notas?: string
}

function validate(nombre: string, telefono: string, notas: string): FormErrors {
  const errs: FormErrors = {}

  const nombreTrimmed = nombre.trim()
  if (!nombreTrimmed) {
    errs.nombre = 'El nombre es requerido.'
  } else if (nombreTrimmed.length < 2) {
    errs.nombre = 'El nombre debe tener al menos 2 caracteres.'
  } else if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(nombreTrimmed)) {
    errs.nombre = 'El nombre solo puede contener letras y espacios.'
  }

  const telefonoTrimmed = telefono.trim()
  const digitsOnly = telefonoTrimmed.replace(/\D/g, '')
  if (!telefonoTrimmed) {
    errs.telefono = 'El teléfono es requerido.'
  } else if (!/^[\d\s+\-().]+$/.test(telefonoTrimmed)) {
    errs.telefono = 'Solo se permiten dígitos y los caracteres + - ( ).'
  } else if (digitsOnly.length < 8) {
    errs.telefono = 'El teléfono debe tener al menos 8 dígitos.'
  } else if (digitsOnly.length > 15) {
    errs.telefono = 'El teléfono no puede superar los 15 dígitos.'
  }

  if (notas.length > 300) {
    errs.notas = `Máximo 300 caracteres (${notas.length}/300).`
  }

  return errs
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400 mt-1">
      <AlertCircle size={11} className="shrink-0" />
      {msg}
    </p>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [notas, setNotas] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const toastId = useRef<string | number | undefined>()

  useEffect(() => {
    if (items.length === 0) navigate('/carrito', { replace: true })
  }, [items, navigate])

  const totalPrice = cartTotalPrice(items)

  const mutation = useMutation({
    mutationFn: createGuestOrder,
    onMutate: () => {
      toastId.current = toast.loading('Enviando tu pedido...')
    },
    onSuccess: (order) => {
      toast.success(`¡Pedido #${order.id} confirmado!`, { id: toastId.current, duration: 5000 })
      clearCart()
      navigate('/pedido-confirmado', {
        state: {
          orderId: order.id,
          nombre: order.nombre_cliente,
          telefono: order.telefono,
          total: order.total,
          fecha: new Date().toISOString(),
          resumen: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        },
      })
    },
    onError: () => {
      toast.error('No se pudo confirmar el pedido. Revisá tu conexión e intentá de nuevo.', {
        id: toastId.current,
        duration: 5000,
      })
    },
  })

  function touch(field: string) {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors(validate(nombre, telefono, notas))
  }

  function showError(field: keyof FormErrors) {
    return (submitted || touched[field]) ? errors[field] : undefined
  }

  function inputClass(field: keyof FormErrors) {
    const hasError = showError(field)
    return `w-full px-3.5 py-2.5 rounded-xl text-sm border transition
      bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100
      placeholder-stone-400 dark:placeholder-stone-500
      focus:outline-none focus:ring-2 focus:ring-indigo-500
      ${hasError
        ? 'border-red-400 dark:border-red-500 focus:ring-red-400'
        : 'border-stone-200 dark:border-stone-700'
      }`
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)

    const errs = validate(nombre, telefono, notas)
    setErrors(errs)

    if (Object.keys(errs).length > 0) {
      toast.error('Revisá los campos antes de continuar.')
      return
    }

    mutation.mutate({
      nombre_cliente: nombre.trim(),
      telefono: telefono.trim(),
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
          Ingresá tus datos para finalizar la compra.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 space-y-4">
            <h2 className="font-semibold text-stone-800 dark:text-stone-100">Tus datos</h2>

            {/* Nombre */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Nombre completo <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value)
                  if (touched.nombre || submitted) setErrors(validate(e.target.value, telefono, notas))
                }}
                onBlur={() => touch('nombre')}
                placeholder="Ej: María González"
                autoComplete="name"
                className={inputClass('nombre')}
              />
              <FieldError msg={showError('nombre')} />
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Teléfono <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => {
                  setTelefono(e.target.value)
                  if (touched.telefono || submitted) setErrors(validate(nombre, e.target.value, notas))
                }}
                onBlur={() => touch('telefono')}
                placeholder="Ej: 11 4567-8901"
                autoComplete="tel"
                className={inputClass('telefono')}
              />
              <FieldError msg={showError('telefono')} />
              {!showError('telefono') && (
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                  Solo números. También podés usar +, -, ( )
                </p>
              )}
            </div>

            {/* Notas */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Notas adicionales
                <span className="ml-1.5 text-stone-400 font-normal">(opcional)</span>
              </label>
              <textarea
                value={notas}
                onChange={(e) => {
                  setNotas(e.target.value)
                  if (touched.notas || submitted) setErrors(validate(nombre, telefono, e.target.value))
                }}
                onBlur={() => touch('notas')}
                rows={3}
                maxLength={310}
                placeholder="Instrucciones especiales, alergias, etc."
                className={`${inputClass('notas')} resize-none`}
              />
              <div className="flex items-start justify-between">
                <FieldError msg={showError('notas')} />
                <span className={`text-xs ml-auto ${notas.length > 300 ? 'text-red-400' : 'text-stone-400 dark:text-stone-500'}`}>
                  {notas.length}/300
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600
              disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            {mutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                Confirmar pedido
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 space-y-4 sticky top-24">
          <h2 className="font-semibold text-stone-800 dark:text-stone-100">Resumen</h2>

          <div className="space-y-2 text-sm max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-stone-500 dark:text-stone-400">
                <span className="truncate max-w-[140px]">
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-100 dark:border-stone-800 pt-3 flex justify-between font-bold text-stone-900 dark:text-stone-100">
            <span>Total</span>
            <span className="text-indigo-500 dark:text-indigo-400 text-lg">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
